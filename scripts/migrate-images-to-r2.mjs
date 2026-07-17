/**
 * One-time script: Download all product images from glycodepot.com WP media
 * and upload them to Cloudflare R2 for CDN serving after DNS cutover.
 *
 * Run:
 *   node --env-file=.env.local scripts/migrate-images-to-r2.mjs
 *
 * Required env vars (add to .env.local):
 *   R2_ACCOUNT_ID         — Cloudflare account ID (dashboard top-right)
 *   R2_ACCESS_KEY_ID      — R2 API token Access Key ID
 *   R2_SECRET_ACCESS_KEY  — R2 API token Secret Access Key
 *   R2_BUCKET_NAME        — R2 bucket name (e.g. glycodepot-images)
 *   R2_PUBLIC_URL         — Public bucket URL (e.g. https://pub-abc123.r2.dev)
 *
 * Reads  : lib/data/catalog.json
 * Writes : scripts/r2-url-map.json        (old → new R2 URL map)
 *          scripts/r2-migration-progress.json  (checkpoint, safe to delete after)
 */

import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

// ── Config ────────────────────────────────────────────────────────────────────
const CATALOG_PATH = path.resolve("lib/data/catalog.json");
const URL_MAP_PATH = path.resolve("scripts/r2-url-map.json");
const PROGRESS_PATH = path.resolve("scripts/r2-migration-progress.json");
const CONCURRENCY = 6;
const DELAY_MS = 150;
const FETCH_TIMEOUT_MS = 20_000;

// ── Verify env vars ───────────────────────────────────────────────────────────
const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET = process.env.R2_BUCKET_NAME;
const PUBLIC_URL = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");

if (!ACCOUNT_ID || !ACCESS_KEY || !SECRET_KEY || !BUCKET || !PUBLIC_URL) {
  console.error("❌  Missing required env vars. Add to .env.local:\n");
  console.error("    R2_ACCOUNT_ID");
  console.error("    R2_ACCESS_KEY_ID");
  console.error("    R2_SECRET_ACCESS_KEY");
  console.error("    R2_BUCKET_NAME");
  console.error("    R2_PUBLIC_URL\n");
  process.exit(1);
}

// ── R2 client (S3-compatible) ─────────────────────────────────────────────────
const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
});

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
    if (typeof src === "string" && src.includes("glycodepot.com")) {
      urlSet.add(src);
    }
  }
}
const allUrls = [...urlSet];
console.log(`🖼   ${allUrls.length} unique images to migrate\n`);

// ── Load progress checkpoint ──────────────────────────────────────────────────
let urlMap = {};
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

function r2Key(srcUrl) {
  try {
    const u = new URL(srcUrl);
    const filename = u.pathname.split("/").pop() || "image.jpg";
    return `products/${filename}`;
  } catch {
    return `products/image-${Math.random().toString(36).slice(2)}.jpg`;
  }
}

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

async function migrateOne(srcUrl) {
  if (urlMap[srcUrl]) return;

  let buffer;
  try {
    buffer = await download(srcUrl);
  } catch (err) {
    console.warn(`  ⚠️  Download failed (${srcUrl}): ${err.message}`);
    urlMap[srcUrl] = srcUrl;
    return;
  }

  const ext = (srcUrl.split(".").pop() ?? "jpg").split("?")[0].toLowerCase();
  const contentTypeMap = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
    gif: "image/gif", webp: "image/webp", svg: "image/svg+xml",
  };
  const contentType = contentTypeMap[ext] ?? "image/jpeg";
  const key = r2Key(srcUrl);

  try {
    await r2.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }));
    urlMap[srcUrl] = `${PUBLIC_URL}/${key}`;
  } catch (err) {
    console.warn(`  ⚠️  Upload failed (${srcUrl}): ${err.message}`);
    urlMap[srcUrl] = srcUrl;
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

  fs.writeFileSync(PROGRESS_PATH, JSON.stringify(urlMap, null, 2));

  const pct = ((done / total) * 100).toFixed(1);
  process.stdout.write(`\r   ${done}/${total} (${pct}%)  `);

  if (i + CONCURRENCY < remaining.length) {
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }
}

console.log("\n\n✅  All images processed\n");

// ── Save URL map ──────────────────────────────────────────────────────────────
fs.writeFileSync(URL_MAP_PATH, JSON.stringify(urlMap, null, 2));
const succeeded = Object.entries(urlMap).filter(([k, v]) => k !== v).length;
const failed = Object.entries(urlMap).filter(([k, v]) => k === v).length;
console.log(`📊  Results:`);
console.log(`    ✅  Migrated : ${succeeded}`);
console.log(`    ⚠️   Kept original (error): ${failed}\n`);

console.log("🎉  Done! Next steps:");
console.log("    1. npm run build   (prebake will pick up r2-url-map.json automatically)");
console.log("    2. vercel deploy\n");
