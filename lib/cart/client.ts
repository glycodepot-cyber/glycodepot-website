/**
 * Catalog adapter — server-side ONLY.
 *
 * Source-of-truth priority:
 *   1) Prebaked JSON at lib/data/catalog.json (written by scripts/prebake-catalog.mjs
 *      during `prebuild`). Instant, immune to API outages.
 *   2) Live BysonHub API (used when the prebake file is absent and credentials
 *      are configured).
 *   3) Static mocks (last-resort fallback so the site still renders).
 *
 * Caches only ever store SUCCESSFUL fetches — failed live API calls do not
 * poison the cache, so the next request can pick up the prebake/live API
 * cleanly the moment it returns.
 */

import "server-only";

import { unstable_cache } from "next/cache";
import prebakedCatalogJson from "@/lib/data/catalog.json";
import { mockCategories, mockProducts } from "./mock";
import type {
  Category,
  ListQuery,
  PaginatedResult,
  Product,
} from "./types";
import {
  BYSON_CONFIGURED,
  fetchCatalogPage,
  fetchFullCatalog,
  type BysonProduct,
} from "@/lib/api/bysonhub";
import {
  buildCategories,
  productFromByson,
} from "@/lib/api/bysonhub-map";
import { categoryGroups } from "@/lib/content/category-groups";
import { isDatabaseConfigured } from "@/lib/db";
import { loadDatabaseCatalog } from "./database";
import { applyPricePolicy } from "./price-policy";
import { tagSlug } from "@/lib/seo/legacy-map";

/* ----------------- Product image serving guard ----------------- */

/**
 * Product images are served from the `image-glycodepot` Vercel Blob store,
 * which belongs to the glycodepot team.
 *
 * History worth keeping, because this broke twice: the catalogue's own image
 * URLs pointed at BysonHub's Supabase bucket, whose objects were deleted (404
 * NoSuchKey). A rescue copy was taken from the WordPress uploads folder into
 * a Vercel Blob store that was NOT in this team — and when that store went
 * away, every product page broke. The WordPress folder was the only surviving
 * copy; all 2,995 images were re-uploaded from it on 2026-11-06 into a store
 * the team owns outright, so no host outside this Vercel team is in the path
 * any more.
 *
 * Until 2026-11-08 this module also rewrote each dead Supabase URL to its Blob
 * equivalent at render time, using scripts/blob-url-map.json. That map has now
 * been written into the database (scripts/repoint-product-images.mjs), so 3,452
 * rows carry the correct URL and the rewrite is gone — along with the 554 KB of
 * JSON it dragged into every serverless bundle.
 *
 * What remains is the guard below. 47 rows still point at Supabase because
 * their images did not survive anywhere; those render the brand placeholder,
 * which is correct until new photography replaces them.
 *
 * Set this to `false` to fall back to the brand placeholder if the store ever
 * becomes unreachable again — that is strictly better than broken-image icons.
 */
const BLOB_IMAGES_AVAILABLE = true;

const BLOB_IMAGE_HOST = ".public.blob.vercel-storage.com";

/** Brand placeholder shown when a product's real image cannot be served. */
export const PLACEHOLDER_IMAGE_SRC = "/Glycodepot_Logo.jpeg";

function isUnservableImage(src: string): boolean {
  if (src.includes(".supabase.co/storage/")) return true;
  if (!BLOB_IMAGES_AVAILABLE && src.includes(BLOB_IMAGE_HOST)) return true;
  return false;
}

function guardProductImages(product: Product): Product {
  if (!product.images.some((image) => isUnservableImage(image.src))) {
    return product;
  }
  return {
    ...product,
    images: product.images.map((image) =>
      isUnservableImage(image.src)
        ? { ...image, src: PLACEHOLDER_IMAGE_SRC }
        : image,
    ),
  };
}

/* ----------------- Prebake (build-time JSON) ----------------- */

interface PrebakedCatalog {
  generatedAt: string;
  source: string;
  totalItems: number;
  products: Product[];
  categories: Category[];
}

// Top-level static import → JSON gets inlined into the function bundle.
// No dynamic chunk-loading, no missing-file risk at runtime.
const prebake: PrebakedCatalog | null =
  Array.isArray((prebakedCatalogJson as PrebakedCatalog | undefined)?.products) &&
  (prebakedCatalogJson as PrebakedCatalog).products.length > 0
    ? (prebakedCatalogJson as PrebakedCatalog)
    : null;

if (prebake) {
  console.info(
    `[catalog] Prebake ready: ${prebake.products.length} products, ${prebake.categories.length} categories (${prebake.generatedAt}).`,
  );
}

/* ----------------- Categories ----------------- */

const _getCategoriesLiveRaw = unstable_cache(
  async (): Promise<Category[]> => {
    const sample = await fetchCatalogPage({ page: 1, limit: 200 });
    return buildCategories(sample.products);
  },
  ["bysonhub-categories-v3"],
  { revalidate: 300, tags: ["bysonhub-catalog"] },
);

async function getCategoriesSafe(): Promise<Category[]> {
  if (isDatabaseConfigured()) {
    try {
      return (await loadDatabaseCatalog()).categories;
    } catch (err) {
      console.error("[catalog] database category load failed, using transition fallback:", err);
    }
  }
  if (prebake) return prebake.categories;
  if (!BYSON_CONFIGURED) return mockCategories;
  try {
    return await _getCategoriesLiveRaw();
  } catch (err) {
    console.error("[catalog] live category fetch failed, using mocks:", err);
    return mockCategories;
  }
}

/* ----------------- Full catalog ----------------- */

let memoLiveProducts: Product[] | null = null;
let memoLiveCategories: Category[] | null = null;

async function loadRawCatalog(): Promise<{
  products: Product[];
  categories: Category[];
}> {
  if (isDatabaseConfigured()) {
    try {
      const databaseCatalog = await loadDatabaseCatalog();
      if (databaseCatalog.products.length) return databaseCatalog;
      console.error("[catalog] database returned an empty catalog; using transition fallback");
    } catch (err) {
      console.error("[catalog] database load failed, using transition fallback:", err);
    }
  }
  if (prebake) {
    return { products: prebake.products, categories: prebake.categories };
  }
  if (!BYSON_CONFIGURED) {
    return { products: mockProducts, categories: mockCategories };
  }
  if (memoLiveProducts && memoLiveCategories) {
    return { products: memoLiveProducts, categories: memoLiveCategories };
  }
  try {
    const raw = await fetchFullCatalog();
    if (!raw.length) throw new Error("Empty catalog returned");
    const products = raw.map(productFromByson);
    const categories = buildCategories(raw);
    memoLiveProducts = products;
    memoLiveCategories = categories;
    return { products, categories };
  } catch (err) {
    console.error("[catalog] live catalog fetch failed, using mocks:", err);
    // Do NOT memoize a failure — let the next request retry the live API.
    return { products: mockProducts, categories: mockCategories };
  }
}

async function loadCatalog(): Promise<{ products: Product[]; categories: Category[] }> {
  const catalog = await loadRawCatalog();
  return {
    ...catalog,
    products: catalog.products.map(guardProductImages).map(applyPricePolicy),
  };
}

/* ----------------- Public catalog API ----------------- */

export async function listCategories(): Promise<Category[]> {
  return getCategoriesSafe();
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const categories = await getCategoriesSafe();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function listProducts(
  query: ListQuery = {},
): Promise<PaginatedResult<Product>> {
  const { products, categories } = await loadCatalog();
  let items = products;

  if (query.categorySlug) {
    const cat = categories.find((c) => c.slug === query.categorySlug);
    if (cat) items = items.filter((p) => p.categories.includes(cat.id));
    else items = [];
  } else if (query.groupSlug) {
    const group = categoryGroups.find((g) => g.slug === query.groupSlug);
    if (group) {
      const groupCategoryIds = new Set(
        categories
          .filter((c) => group.categorySlugs.includes(c.slug))
          .map((c) => c.id),
      );
      items = items.filter((p) =>
        p.categories.some((cid) => groupCategoryIds.has(cid)),
      );
    } else {
      items = [];
    }
  }
  if (query.tagSlug) items = items.filter(p => p.tags?.some(tag => tagSlug(tag) === query.tagSlug));
  if (query.search) {
    const q = query.search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        Object.values(p.attributes ?? {})
          .join(" ")
          .toLowerCase()
          .includes(q),
    );
  }
  if (query.sort === "price-asc") {
    items = [...items].sort(
      (a, b) =>
        (a.price?.amount ?? Number.POSITIVE_INFINITY) -
        (b.price?.amount ?? Number.POSITIVE_INFINITY),
    );
  } else if (query.sort === "price-desc") {
    items = [...items].sort(
      (a, b) => (b.price?.amount ?? -1) - (a.price?.amount ?? -1),
    );
  } else {
    // Default: float priced products above RFQ/no-price products.
    // Stable sort preserves original order within each group.
    items = [...items].sort((a, b) => {
      const aHasPrice = a.price !== null ? 0 : 1;
      const bHasPrice = b.price !== null ? 0 : 1;
      return aHasPrice - bHasPrice;
    });
  }

  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 12;
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    totalItems: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { products } = await loadCatalog();
  return products.find((p) => p.slug === slug) ?? null;
}

/**
 * Resolve a product from the identifier published to Google Merchant Center.
 *
 * This is the exact inverse of the feed's `g:id` (see lib/seo/merchant-feed.ts,
 * which emits `product.sku || product.id`). Google substitutes that value into
 * the cart link template, so if the two ever disagree the add-to-cart link in
 * Shopping goes nowhere. Matching is case-insensitive because SKUs are quoted
 * inconsistently in supplier paperwork.
 */
export async function getProductByFeedId(
  feedId: string,
): Promise<Product | null> {
  const wanted = feedId.trim().toLowerCase();
  if (!wanted) return null;
  const { products } = await loadCatalog();
  return (
    products.find((p) => p.sku?.toLowerCase() === wanted) ??
    products.find((p) => p.id.toLowerCase() === wanted) ??
    null
  );
}

export async function listRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const { products } = await loadCatalog();
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.categories.some((c) => product.categories.includes(c)),
    )
    .slice(0, limit);
}
