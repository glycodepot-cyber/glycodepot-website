/**
 * Downloads all product images from glycodepot.com, named by product ID.
 * Output: scripts/product-images/{product_id}.{ext}
 * Also writes scripts/product-images/manifest.csv  (productId, imageUrl, filename)
 *
 * Run: node scripts/download-product-images.mjs
 */

import fs from "fs";
import path from "path";
import { createWriteStream } from "fs";

const CATALOG_PATH = path.resolve("lib/data/catalog.json");
const OUT_DIR = path.resolve("scripts/product-images");
const PROGRESS_PATH = path.resolve("scripts/product-images-progress.json");

const CONCURRENCY = 8;
const DELAY_MS = 100;
const FETCH_TIMEOUT_MS = 20_000;

// ── Prep output directory ─────────────────────────────────────────────────────
fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Load catalog ──────────────────────────────────────────────────────────────
console.log("📦  Loading catalog …");
const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf-8"));
const products = catalog.products ?? [];
console.log(`    ${products.length} products\n`);

// ── Build download list ───────────────────────────────────────────────────────
// Each entry: { productId, srcUrl, filename }
const downloadList = [];
for (const p of products) {
  const img = p.images?.[0];
  if (!img?.src || img.src.startsWith("/")) continue; // skip placeholder

  const srcUrl = img.src;
  const ext = (srcUrl.split(".").pop() ?? "jpg").split("?")[0].toLowerCase();
  const safeExt = ["jpg","jpeg","png","gif","webp","svg"].includes(ext) ? ext : "jpg";
  const filename = `${p.id}.${safeExt}`;
  downloadList.push({ productId: p.id, srcUrl, filename });
}
console.log(`🖼   ${downloadList.length} images to download\n`);

// ── Load progress checkpoint ──────────────────────────────────────────────────
let done = new Set();
if (fs.existsSync(PROGRESS_PATH)) {
  try {
    done = new Set(JSON.parse(fs.readFileSync(PROGRESS_PATH, "utf-8")));
    console.log(`♻️   Resuming — ${done.size} already done\n`);
  } catch { done = new Set(); }
}

// ── Download helpers ──────────────────────────────────────────────────────────
async function downloadOne({ productId, srcUrl, filename }) {
  if (done.has(productId)) return;

  const destPath = path.join(OUT_DIR, filename);
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(srcUrl, {
      signal: ctrl.signal,
      headers: { "User-Agent": "GlycoDepot-ImageDownload/1.0" },
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buffer));
    done.add(productId);
  } catch (err) {
    clearTimeout(timeout);
    console.warn(`\n  ⚠️  Failed ${productId}: ${err.message}`);
  }
}

// ── Batch processing ──────────────────────────────────────────────────────────
const remaining = downloadList.filter((d) => !done.has(d.productId));
let completed = done.size;
const total = downloadList.length;

console.log(`🚀  Downloading ${remaining.length} images …\n`);

for (let i = 0; i < remaining.length; i += CONCURRENCY) {
  const batch = remaining.slice(i, i + CONCURRENCY);
  await Promise.all(batch.map(downloadOne));
  completed = done.size;

  fs.writeFileSync(PROGRESS_PATH, JSON.stringify([...done], null, 2));
  const pct = ((completed / total) * 100).toFixed(1);
  process.stdout.write(`\r   ${completed}/${total} (${pct}%)  `);

  if (i + CONCURRENCY < remaining.length) {
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }
}

console.log("\n\n✅  Download complete\n");

// ── Write manifest CSV ────────────────────────────────────────────────────────
const manifestPath = path.join(OUT_DIR, "manifest.csv");
const csvLines = ["product_id,filename,original_url"];
for (const d of downloadList) {
  csvLines.push(`${d.productId},${d.filename},${d.srcUrl}`);
}
fs.writeFileSync(manifestPath, csvLines.join("\n"));
console.log(`📋  manifest.csv written (${downloadList.length} rows)`);

// ── Summary ───────────────────────────────────────────────────────────────────
const files = fs.readdirSync(OUT_DIR).filter((f) => f !== "manifest.csv");
const failed = downloadList.filter((d) => !done.has(d.productId));
console.log(`\n📊  Results:`);
console.log(`    ✅  Downloaded : ${files.length}`);
console.log(`    ⚠️   Failed     : ${failed.length}`);
console.log(`\n📁  Images saved to: scripts/product-images/`);
console.log(`    Zip the folder and send to Nihar along with manifest.csv\n`);
if (failed.length > 0) {
  console.log(`Failed products:\n${failed.map((d) => `  ${d.productId}`).join("\n")}\n`);
}
