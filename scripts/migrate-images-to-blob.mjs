/**
 * One-time script: Download all product images from glycodepot.com WP media
 * and re-upload them to Vercel Blob for CDN serving after DNS cutover.
 *
 * Run: node scripts/migrate-images-to-blob.mjs
 *
 * Reads  : lib/data/catalog.json
 * Writes : lib/data/catalog.json   (in-place, replaces image src URLs)
 *          scripts/blob-url-map.json  (old → new URL map, for reference)
 *          scripts/blob-migration-progress.json  (checkpoint, safe to delete after)
 */

import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";

// ── Config ────────────────────────────────────────────────────────────────────
const CATALOG_PATH = path.resolve("lib/data/catalog.json");
const URL_MAP_PATH = path.resolve("scripts/blob-url-map.json");
const PROGRESS_PATH = path.resolve("scripts/blob-migration-progress.json");
const CONCURRENCY = 6;      // parallel uploads at once
const DELAY_MS = 150;        // ms between batches (be polite to glycodepot.com)
const FETCH_TIMEOUT_MS = 20_000;

// ── Verify token ──────────────────────────────────────────────────────────────
const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error("❌  BLOB_READ_WRITE_TOKEN not set. Add it to .env.local and run:\n");
  console.error("    node -r dotenv/config scripts/migrate-images-to-blob.mjs\n");
  console.error("    (or export BLOB_READ_WRITE_TOKEN=... before running)\n");
  process.exit(1);
}

// ── Load catalog ──────────────────────────────────────────────────────────────
console.log("📦  Loading catalog.json …");
const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf-8"));
const products = catalog.products ?? [];
console.log(`    ${products.length} products loaded`);

// ── Collect unique glycodepot.com image URLs ──────────────────────────────────
const urlSet = new Set();
for (const p of products) {
  for (const img of p.images ?? []) {
    const src = img.src ?? img;
    if (typeof src === "string" && src.startsWith("https://glycodepot.com")) {
      urlSet.add(src);
    }
  }
}
const allUrls = [...urlSet];
console.log(`🖼   ${allUrls.length} unique images to migrate\n`);

// ── Load progress checkpoint (for resuming) ───────────────────────────────────
let urlMap = {}; // old → new blob URL
if (fs.existsSync(PROGRESS_PATH)) {
  try {
    urlMap = JSON.parse(fs.readFileSync(PROGRESS_PATH, "utf-8"));
    const done = Object.keys(urlMap).length;
    console.log(`♻️   Resuming from checkpoint: ${done}/${allUrls.length} already done\n`);
  } catch {
    urlMap = {};
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Derive a clean blob pathname from a WP URL */
function blobPathname(srcUrl) {
  try {
    const u = new URL(srcUrl);
    // e.g. /wp-content/uploads/2024/04/some-image.png → products/some-image.png
    const filename = u.pathname.split("/").pop() || "image.jpg";
    return `products/${filename}`;
  } catch {
    return `products/${Date.now()}.jpg`;
  }
}

/** Download an image and return an ArrayBuffer */
async function download(url) {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "GlycoDepot-ImageMigration/1.0" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.arrayBuffer();
  } finally {
    clearTimeout(timeout);
  }
}

/** Upload one image: download → upload to Blob → return new URL */
async function migrateOne(srcUrl) {
  if (urlMap[srcUrl]) return; // already done

  let blob;
  try {
    blob = await download(srcUrl);
  } catch (err) {
    console.warn(`  ⚠️  Download failed (${srcUrl}): ${err.message}`);
    urlMap[srcUrl] = srcUrl; // keep original URL on failure
    return;
  }

  const ext = (srcUrl.split(".").pop() ?? "jpg").split("?")[0].toLowerCase();
  const contentTypeMap = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp", svg: "image/svg+xml" };
  const contentType = contentTypeMap[ext] ?? "image/jpeg";

  try {
    const result = await put(blobPathname(srcUrl), blob, {
      access: "public",
      contentType,
      token,
      addRandomSuffix: false, // keep deterministic names
    });
    urlMap[srcUrl] = result.url;
  } catch (err) {
    console.warn(`  ⚠️  Upload failed (${srcUrl}): ${err.message}`);
    urlMap[srcUrl] = srcUrl; // keep original on failure
  }
}

// ── Batch processing ──────────────────────────────────────────────────────────
const remaining = allUrls.filter((u) => !urlMap[u]);
console.log(`🚀  Migrating ${remaining.length} images (${CONCURRENCY} at a time) …\n`);

let done = allUrls.length - remaining.length;
const total = allUrls.length;

for (let i = 0; i < remaining.length; i += CONCURRENCY) {
  const batch = remaining.slice(i, i + CONCURRENCY);
  await Promise.all(batch.map(migrateOne));
  done += batch.length;

  // Save checkpoint after every batch
  fs.writeFileSync(PROGRESS_PATH, JSON.stringify(urlMap, null, 2));

  const pct = ((done / total) * 100).toFixed(1);
  const failed = Object.values(urlMap).filter((v, idx) => v === Object.keys(urlMap)[idx]).length;
  process.stdout.write(`\r   ${done}/${total} (${pct}%)  `);

  if (i + CONCURRENCY < remaining.length) {
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }
}

console.log("\n\n✅  All images processed\n");

// ── Save URL map ──────────────────────────────────────────────────────────────
fs.writeFileSync(URL_MAP_PATH, JSON.stringify(urlMap, null, 2));
const succeeded = Object.entries(urlMap).filter(([k, v]) => k !== v).length;
const skipped = Object.entries(urlMap).filter(([k, v]) => k === v).length;
console.log(`📊  Results:`);
console.log(`    ✅  Migrated : ${succeeded}`);
console.log(`    ⚠️   Kept original (download/upload error): ${skipped}\n`);

// ── Rewrite catalog.json with new URLs ────────────────────────────────────────
console.log("✍️   Rewriting catalog.json with Blob URLs …");
let replaced = 0;
for (const p of products) {
  for (const img of p.images ?? []) {
    const oldSrc = img.src ?? img;
    if (typeof oldSrc === "string" && urlMap[oldSrc] && urlMap[oldSrc] !== oldSrc) {
      if (typeof img === "string") {
        // shouldn't happen given our image format, but guard anyway
      } else {
        img.src = urlMap[oldSrc];
        replaced++;
      }
    }
  }
}
console.log(`    ${replaced} image references rewritten`);

fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog));
console.log("    catalog.json saved\n");

console.log("🎉  Done! Next steps:");
console.log("    1. npm run build   (rebuilds with new Blob URLs)");
console.log("    2. vercel deploy   (deploys the updated build)");
console.log("    3. Delete scripts/blob-migration-progress.json when satisfied\n");
