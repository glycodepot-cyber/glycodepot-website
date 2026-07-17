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

async function loadCatalog(): Promise<{
  products: Product[];
  categories: Category[];
}> {
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
