/**
 * Build-time catalog prebake.
 *
 * Fetches the full BysonHub catalog at build time, maps each product to the
 * domain shape, and writes lib/data/catalog.json. Runtime pages then read
 * this static JSON — no API dependency on the request path, no cold-start
 * penalty, no cache poisoning. Order placement still goes against the live
 * API.
 *
 * If the API is unreachable, the script logs a warning and leaves any
 * existing JSON intact so an outage at build time never erases the catalog.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "lib", "data");
const OUT_FILE = path.join(OUT_DIR, "catalog.json");
const R2_URL_MAP_FILE = path.join(__dirname, "r2-url-map.json");
const BLOB_URL_MAP_FILE = path.join(__dirname, "blob-url-map.json");

// Load the image URL map: prefer R2 (free), fall back to Vercel Blob.
// Either map rewrites product image URLs so images survive the DNS cutover.
async function loadBlobUrlMap() {
  for (const file of [R2_URL_MAP_FILE, BLOB_URL_MAP_FILE]) {
    try {
      const raw = await fs.readFile(file, "utf-8");
      const map = JSON.parse(raw);
      console.log(`[prebake] URL map loaded from ${path.basename(file)} (${Object.keys(map).length} entries)`);
      return map;
    } catch {
      // try next
    }
  }
  return null;
}

function applyBlobUrls(products, urlMap) {
  if (!urlMap) return products;
  let rewrote = 0;
  for (const p of products) {
    for (const img of p.images) {
      const mapped = urlMap[img.src];
      if (mapped && mapped !== img.src) {
        img.src = mapped;
        rewrote++;
      }
    }
  }
  if (rewrote > 0) {
    console.log(`[prebake] Rewrote ${rewrote} image URLs → Vercel Blob CDN`);
  }
  return products;
}

const API_URL = (process.env.BYSONHUB_API_URL ?? "").replace(/\/+$/, "");
const API_KEY = process.env.BYSONHUB_API_KEY ?? "";
const PAGE_SIZE = 100;
const FETCH_TIMEOUT_MS = 45_000;
const PAGE_CONCURRENCY = 6;

if (!API_URL || !API_KEY) {
  console.warn(
    "[prebake] BYSONHUB_API_URL / BYSONHUB_API_KEY not set — skipping prebake.",
  );
  process.exit(0);
}

async function fetchPage(page) {
  const url = `${API_URL}/api/v1/external/catalog?page=${page}&limit=${PAGE_SIZE}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchAllConcurrent(totalPages) {
  const results = new Array(totalPages);
  let next = 1;
  async function worker() {
    while (true) {
      const myPage = next++;
      if (myPage > totalPages) return;
      const data = await fetchPage(myPage);
      results[myPage - 1] = data.products;
      console.log(
        `[prebake] page ${myPage}/${totalPages} → ${data.products.length} products`,
      );
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(PAGE_CONCURRENCY, totalPages) }, worker),
  );
  return results.flat();
}

/* ------------- Mapper (duplicated from lib/api/bysonhub-map.ts to keep
   this script ESM-pure and free of TypeScript) ------------- */

function toSlug(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripHtmlToText(html) {
  if (!html) return "";
  return html
    .replace(/\\r\\n|\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\\t/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line, i, arr) => line || (i > 0 && arr[i - 1]))
    .join("\n")
    .trim();
}

function flattenToSingleLine(text) {
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Keep in lockstep with `compareAtFrom` in lib/api/bysonhub-map.ts — this file
 * is a standalone .mjs build script and cannot import the TS mapper, so the
 * pricing rules are duplicated here by necessity. Change both or neither.
 *
 * BysonHub's `compare_price` is their "Compare at price" (the higher
 * struck-through figure), NOT a discount — verified across the full catalog.
 * (Renamed from `sale_price` by BysonHub on 2026-07-17; values unchanged.)
 * `regular_price` is what the customer actually pays.
 */
function compareAtFrom(price, compare) {
  if (compare === null || compare === undefined || !(compare > price)) return null;
  return { amount: compare, currency: "USD" };
}

function variantFromByson(raw) {
  const price = raw.regular_price > 0 ? { amount: raw.regular_price, currency: "USD" } : null;
  return {
    id: `bvar_${raw.id}`,
    sku: raw.sku,
    name: raw.name,
    price,
    compareAtPrice: price ? compareAtFrom(raw.regular_price, raw.compare_price) : null,
    inStock: raw.stock_status === "instock",
  };
}

function productFromByson(raw) {
  const variants = (raw.variations ?? []).map(variantFromByson);
  // Track the cheapest priced variant itself (not just its amount) so its
  // compare-at travels with the card price and the pair stays coherent.
  const pricedVariants = variants.filter(
    (v) => typeof v.price?.amount === "number" && v.price.amount > 0,
  );
  const cheapestVariant = pricedVariants.length
    ? pricedVariants.reduce((a, b) => (b.price.amount < a.price.amount ? b : a))
    : null;
  const minVariantPrice = cheapestVariant?.price.amount ?? null;
  const isRfq = raw.is_rfq === true;
  const productPrice = isRfq
    ? null
    : minVariantPrice !== null
      ? { amount: minVariantPrice, currency: "USD" }
      : raw.regular_price > 0
        ? { amount: raw.regular_price, currency: "USD" }
        : null;
  const productCompareAt = isRfq
    ? null
    : minVariantPrice !== null
      ? (cheapestVariant?.compareAtPrice ?? null)
      : raw.regular_price > 0
        ? compareAtFrom(raw.regular_price, raw.compare_price)
        : null;

  const primaryCategoryId = raw.category ? `bcat_${raw.category.id}` : undefined;

  const images = raw.images.length
    ? raw.images.map((src) => ({ src, alt: raw.name }))
    : [{ src: "/Glycodepot_Logo.jpeg", alt: raw.name }];

  const attributes = {};
  if (raw.sku) attributes.SKU = raw.sku;
  if (raw.weight) attributes.Weight = String(raw.weight);

  const descriptionText = stripHtmlToText(raw.description);
  const shortText = flattenToSingleLine(descriptionText);
  const shortDescription = shortText
    ? shortText.slice(0, 160) + (shortText.length > 160 ? "…" : "")
    : undefined;

  return {
    id: `bprd_${raw.id}`,
    slug: toSlug(raw.name) || `product-${raw.id}`,
    name: raw.name,
    shortDescription,
    description: descriptionText || undefined,
    categories: primaryCategoryId ? [primaryCategoryId] : [],
    primaryCategoryId,
    images,
    variants,
    price: productPrice,
    compareAtPrice: productCompareAt,
    isRfq: isRfq || undefined,
    badge: null,
    attributes: Object.keys(attributes).length ? attributes : undefined,
  };
}

function buildCategories(rawProducts) {
  const byId = new Map();
  for (const p of rawProducts) {
    if (!p.category) continue;
    const existing = byId.get(p.category.id);
    if (existing) existing.count += 1;
    else byId.set(p.category.id, { raw: p.category, count: 1 });
  }
  return [...byId.values()]
    .sort((a, b) => b.count - a.count)
    .map(({ raw, count }) => ({
      id: `bcat_${raw.id}`,
      slug: toSlug(raw.name),
      name: raw.name,
      productCount: count,
    }));
}

/* ------------- Main ------------- */

async function existingFreshness() {
  try {
    const stat = await fs.stat(OUT_FILE);
    return stat.mtime.toISOString();
  } catch {
    return null;
  }
}

(async () => {
  const existing = await existingFreshness();
  console.log(
    `[prebake] Starting catalog prebake. Existing JSON: ${existing ?? "none"}`,
  );

  const blobUrlMap = await loadBlobUrlMap();
  if (blobUrlMap) {
    console.log(`[prebake] Blob URL map loaded (${Object.keys(blobUrlMap).length} entries)`);
  }

  try {
    const first = await fetchPage(1);
    const totalPages = first.pagination.total_pages;
    const totalItems = first.pagination.total_items;
    console.log(
      `[prebake] Catalog reports ${totalItems} products in ${totalPages} pages.`,
    );

    let rawProducts;
    if (totalPages === 1) {
      rawProducts = first.products;
    } else {
      // Already fetched page 1; fetch 2..N concurrently
      const rest = await fetchAllConcurrent(totalPages);
      // results array is 0-indexed by (page - 1); we filled 2..N, so prepend page 1
      const restProducts = rest.slice(1); // drop the empty slot for page 1
      rawProducts = [...first.products, ...restProducts];
    }

    const products = applyBlobUrls(rawProducts.map(productFromByson), blobUrlMap);
    const categories = buildCategories(rawProducts);

    await fs.mkdir(OUT_DIR, { recursive: true });
    const payload = {
      generatedAt: new Date().toISOString(),
      source: "bysonhub-staging",
      totalItems,
      products,
      categories,
    };
    await fs.writeFile(OUT_FILE, JSON.stringify(payload));

    const sizeKb = Math.round((await fs.stat(OUT_FILE)).size / 1024);
    console.log(
      `[prebake] ✓ Wrote ${products.length} products + ${categories.length} categories (${sizeKb} KB) → lib/data/catalog.json`,
    );
  } catch (err) {
    if (existing) {
      console.warn(
        `[prebake] ⚠ Fetch failed (${err?.message ?? err}). Keeping existing JSON from ${existing}.`,
      );
    } else {
      console.warn(
        `[prebake] ⚠ Fetch failed (${err?.message ?? err}). No prior JSON — runtime will fall back to live API or mocks.`,
      );
    }
    // Never fail the build; the adapter has its own fallback chain.
    process.exit(0);
  }
})();
