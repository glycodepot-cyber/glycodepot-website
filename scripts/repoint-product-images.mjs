/**
 * Repoint product_images.src at the team's own Vercel Blob store.
 *
 * The catalogue in Postgres still stores BysonHub's Supabase URLs, whose
 * objects were deleted. The site currently papers over this at render time:
 * lib/cart/client.ts matches each dead URL's filename against
 * scripts/blob-url-map.json and substitutes the Blob URL. That works, but it
 * means the database holds URLs that resolve to nothing, and every consumer
 * of the data — the merchant feed, an export, anything built later — has to
 * know about the shim.
 *
 * This writes the correct URLs into the database so the shim can be deleted.
 *
 * Matching is by filename, exactly as the shim does it: take the basename,
 * drop WordPress's "<digits>_main_" prefix, compare case-insensitively. A row
 * that does not match is LEFT ALONE rather than guessed at — an unmatched row
 * keeps rendering the brand placeholder, which is correct, whereas inventing a
 * URL would produce a broken image.
 *
 * Usage, from the repo root:
 *
 *   $env:DATABASE_URL = "postgres://..."        # PowerShell
 *   node scripts/repoint-product-images.mjs              # dry run, changes nothing
 *   node scripts/repoint-product-images.mjs --apply      # writes
 *
 * The dry run prints exactly what the real run would do and writes the list of
 * unmatched rows to scripts/product-images-unmatched.csv, which is the list of
 * products that need new photography.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { neon } from "@neondatabase/serverless";

const APPLY = process.argv.includes("--apply");
const MAP_PATH = path.resolve("scripts/blob-url-map.json");
const UNMATCHED_PATH = path.resolve("scripts/product-images-unmatched.csv");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("❌  DATABASE_URL is not set.\n");
  console.error("    Vercel → glycodepot-staging → Settings → Environment Variables");
  console.error("    → DATABASE_URL → copy value, then:\n");
  console.error('      $env:DATABASE_URL = "postgres://..."\n');
  process.exit(1);
}

/** Basename, minus WordPress's "<digits>_main_" prefix, lowercased. */
function normalizedFilename(src) {
  try {
    return decodeURIComponent(new URL(src, "https://glycodepot.com").pathname)
      .split("/")
      .pop()
      .replace(/^\d+_main_/i, "")
      .toLowerCase();
  } catch {
    return "";
  }
}

const map = JSON.parse(fs.readFileSync(MAP_PATH, "utf8"));
const byFilename = new Map();
for (const blobUrl of Object.values(map)) {
  const name = normalizedFilename(blobUrl);
  if (name && !byFilename.has(name)) byFilename.set(name, blobUrl);
}
console.log(`📄  ${byFilename.size} uploaded images indexed by filename`);

const sql = neon(url);

const rows = await sql`
  SELECT pi.id, pi.src, p.sku, p.name AS product_name, p.slug, p.is_active
  FROM product_images pi
  JOIN products p ON p.id = pi.product_id
  ORDER BY p.id, pi.position`;
console.log(`🗃   ${rows.length} product_images rows in the database\n`);

const BLOB_HOST = "laoycnbsattw3wiy.public.blob.vercel-storage.com";

const updates = [];
const unmatched = [];
let alreadyCorrect = 0;
let placeholderRows = 0;

for (const row of rows) {
  const src = row.src ?? "";
  if (src.includes(BLOB_HOST)) {
    alreadyCorrect++;
    continue;
  }
  const name = normalizedFilename(src);
  if (name.includes("glycodepot_logo")) {
    placeholderRows++;
    continue;
  }
  const target = byFilename.get(name);
  if (target) updates.push({ id: row.id, from: src, to: target });
  else unmatched.push(row);
}

console.log(`   already on the Blob store : ${alreadyCorrect}`);
console.log(`   already a placeholder     : ${placeholderRows}`);
console.log(`   to repoint                : ${updates.length}`);
console.log(`   no surviving image        : ${unmatched.length}`);

// The unmatched rows are the real deliverable for the owner: these products
// need new photography, and nothing in the data can fix them.
const csv = [
  "sku,product_name,slug,is_active,expected_filename,current_src",
  ...unmatched.map((r) =>
    [r.sku, r.product_name, r.slug, r.is_active, normalizedFilename(r.src), r.src]
      .map((v) => {
        const s = String(v ?? "");
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      })
      .join(","),
  ),
].join("\n");
fs.writeFileSync(UNMATCHED_PATH, csv);
console.log(`\n📝  Unmatched rows written to ${path.relative(process.cwd(), UNMATCHED_PATH)}`);

if (!APPLY) {
  console.log("\n🔍  Dry run — nothing was written.");
  console.log("    Examples of what would change:");
  for (const u of updates.slice(0, 3)) {
    console.log(`      ${u.from.slice(0, 72)}`);
    console.log(`   →  ${u.to.slice(0, 72)}\n`);
  }
  console.log("    Re-run with --apply to write these changes.");
  process.exit(0);
}

console.log(`\n✍️   Applying ${updates.length} updates …`);
let done = 0;
for (let i = 0; i < updates.length; i += 100) {
  const batch = updates.slice(i, i + 100);
  await Promise.all(batch.map((u) => sql`UPDATE product_images SET src = ${u.to} WHERE id = ${u.id}`));
  done += batch.length;
  console.log(`    ${done}/${updates.length}`);
}

const [{ count: remaining }] = await sql`
  SELECT count(*)::int AS count FROM product_images
  WHERE src LIKE '%supabase.co%'`;
console.log(`\n✅  Done. Rows still pointing at Supabase: ${remaining}`);
console.log("    (These are the ones with no surviving image; see the CSV above.)");
