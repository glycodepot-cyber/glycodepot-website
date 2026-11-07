/**
 * Re-host the WordPress product images on a Vercel Blob store you own.
 *
 * Why this exists: the original product images were migrated to a Vercel Blob
 * store that is no longer in the glycodepot Vercel team, and BysonHub's
 * Supabase objects have been deleted. Both URL families now fail, so every
 * product page renders a placeholder. The only surviving copy of the images is
 * the WordPress uploads folder.
 *
 * This script reads those files from a LOCAL folder — no dependency on
 * Hostinger, on the old blob store, or on glycodepot.com still serving
 * /wp-content — and uploads them to a Blob store of your own. After this runs,
 * nothing about the images depends on a host you do not control.
 *
 * Usage:
 *   1. Unzip uploads.zip somewhere, e.g. ~/Downloads/uploads
 *      (it should contain the year folders: 2023/ 2024/ 2025/)
 *   2. Create a Blob store in your own Vercel team and connect it to the
 *      glycodepot-website project, then copy its read/write token.
 *   3. From the repo root:
 *
 *        export BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
 *        node scripts/upload-wp-uploads-to-blob.mjs --dir ~/Downloads/uploads
 *
 * Reads  : scripts/blob-url-map.disabled.json   (the 2,995 original WP URLs)
 *          <--dir>/YYYY/MM/<filename>           (the actual image files)
 * Writes : scripts/blob-url-map.json            (original WP URL → new blob URL)
 *          scripts/blob-upload-progress.json    (checkpoint; safe to delete after)
 *
 * Safe to re-run. Completed uploads are checkpointed and skipped, so an
 * interrupted run resumes where it stopped.
 */

import fs from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";

const SOURCE_MAP_PATH = path.resolve("scripts/blob-url-map.disabled.json");
const OUT_MAP_PATH = path.resolve("scripts/blob-url-map.json");
const PROGRESS_PATH = path.resolve("scripts/blob-upload-progress.json");
const CONCURRENCY = 8;

const CONTENT_TYPES = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  avif: "image/avif",
};

// ── Arguments ────────────────────────────────────────────────────────────────
const dirFlag = process.argv.indexOf("--dir");
const UPLOADS_DIR = dirFlag !== -1 ? path.resolve(process.argv[dirFlag + 1] ?? "") : null;

if (!UPLOADS_DIR || !fs.existsSync(UPLOADS_DIR)) {
  console.error("❌  Pass the unzipped uploads folder:\n");
  console.error("    node scripts/upload-wp-uploads-to-blob.mjs --dir ~/Downloads/uploads\n");
  console.error("    It should contain the year folders (2023, 2024, 2025).\n");
  process.exit(1);
}

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error("❌  BLOB_READ_WRITE_TOKEN is not set.\n");
  console.error("    Vercel → your team → Storage → the Blob store → copy its");
  console.error("    read/write token, then:\n");
  console.error('      export BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."\n');
  process.exit(1);
}

// ── Work out what to upload ──────────────────────────────────────────────────
// The keys of the existing map are the original WordPress URLs. Their paths
// carry the year/month, which is exactly the folder layout inside uploads.zip.
const originalUrls = Object.keys(JSON.parse(fs.readFileSync(SOURCE_MAP_PATH, "utf-8")));
console.log(`📄  ${originalUrls.length} product images recorded in the archive map`);

/** /wp-content/uploads/2024/04/x.png → 2024/04/x.png */
function relativePathFor(wpUrl) {
  const match = new URL(wpUrl).pathname.match(/\/wp-content\/uploads\/(.+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

/** Keep the blob pathname identical to the old convention: products/<filename>. */
function blobPathname(wpUrl) {
  const filename = decodeURIComponent(new URL(wpUrl).pathname.split("/").pop() ?? "");
  return `products/${filename}`;
}

let urlMap = {};
if (fs.existsSync(PROGRESS_PATH)) {
  try {
    urlMap = JSON.parse(fs.readFileSync(PROGRESS_PATH, "utf-8"));
    console.log(`♻️   Resuming: ${Object.keys(urlMap).length} already uploaded`);
  } catch {
    urlMap = {};
  }
}

// Only the originals. WordPress also generates -150x150 style thumbnails; those
// are not referenced by the catalogue and would waste storage and time.
const missing = [];
const todo = [];
for (const wpUrl of originalUrls) {
  if (urlMap[wpUrl]) continue;
  const rel = relativePathFor(wpUrl);
  if (!rel) continue;
  const file = path.join(UPLOADS_DIR, rel);
  if (fs.existsSync(file)) todo.push({ wpUrl, file });
  else missing.push(rel);
}

console.log(`🖼   ${todo.length} to upload, ${missing.length} not found on disk\n`);
if (missing.length) {
  console.log("    First few not found (check the unzip is complete):");
  for (const m of missing.slice(0, 5)) console.log(`      ${m}`);
  console.log();
}
if (todo.length === 0) {
  console.log("Nothing to upload.");
}

// ── Upload ───────────────────────────────────────────────────────────────────
let done = 0;
let failed = 0;

async function uploadOne({ wpUrl, file }) {
  const ext = path.extname(file).slice(1).toLowerCase();
  try {
    const result = await put(blobPathname(wpUrl), fs.readFileSync(file), {
      access: "public",
      contentType: CONTENT_TYPES[ext] ?? "application/octet-stream",
      token,
      addRandomSuffix: false, // deterministic names, so the map stays stable
      allowOverwrite: true,
    });
    urlMap[wpUrl] = result.url;
  } catch (err) {
    failed++;
    console.warn(`  ⚠️  ${path.basename(file)}: ${err.message}`);
  }
  done++;
  if (done % 50 === 0 || done === todo.length) {
    fs.writeFileSync(PROGRESS_PATH, JSON.stringify(urlMap, null, 2));
    console.log(`    ${done}/${todo.length} uploaded`);
  }
}

for (let i = 0; i < todo.length; i += CONCURRENCY) {
  await Promise.all(todo.slice(i, i + CONCURRENCY).map(uploadOne));
}

// ── Write the map ────────────────────────────────────────────────────────────
fs.writeFileSync(OUT_MAP_PATH, JSON.stringify(urlMap, null, 2));

const hosts = new Set(
  Object.values(urlMap).map((u) => {
    try {
      return new URL(u).host;
    } catch {
      return "?";
    }
  }),
);

console.log("\n✅  Done.");
console.log(`    uploaded ok : ${Object.keys(urlMap).length}`);
console.log(`    failed      : ${failed}`);
console.log(`    not on disk : ${missing.length}`);
console.log(`    new host    : ${[...hosts].join(", ")}`);
console.log(`\n    Map written to ${path.relative(process.cwd(), OUT_MAP_PATH)}`);
console.log("    Send me that file (or just the new host above) and I'll wire it up.\n");
