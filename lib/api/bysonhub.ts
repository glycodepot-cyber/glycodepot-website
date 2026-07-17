/**
 * BysonHub External Partner API — server-side adapter.
 *
 * Reads BYSONHUB_API_URL + BYSONHUB_API_KEY from env. Do NOT import from a
 * client component — the API key must never leak to the browser.
 *
 * Swap staging → production by changing the env vars; no code change required.
 */

import "server-only";

export const BYSON_API_URL =
  process.env.BYSONHUB_API_URL?.replace(/\/+$/, "") ?? "";
export const BYSON_API_KEY = process.env.BYSONHUB_API_KEY ?? "";

export const BYSON_CONFIGURED = Boolean(BYSON_API_URL && BYSON_API_KEY);

const CATALOG_REVALIDATE_SECONDS = 300;
const CATALOG_TAG = "bysonhub-catalog";
/**
 * Short per-request timeout so a sleeping/dead upstream doesn't hang a
 * Vercel function for 60+ seconds. Callers can catch the AbortError and
 * fall back to mocks instantly.
 */
const FETCH_TIMEOUT_MS = 30000;

/* =========================================================================
   Raw response shapes (mirror the OpenAPI spec verbatim)
   ========================================================================= */

export interface BysonCategory {
  id: number;
  name: string;
}

export interface BysonVariation {
  id: number;
  name: string;
  sku?: string;
  regular_price: number;
  sale_price: number | null;
  stock_quantity: number;
  stock_status: "instock" | "outofstock";
  image?: string[];
  meta_data?: Record<string, unknown>;
}

export interface BysonProduct {
  id: number;
  type: "simple" | "variable";
  sku: string;
  name: string;
  description: string;
  published: boolean;
  regular_price: number;
  sale_price: number | null;
  tax_status: "taxable" | "none";
  stock_status: "instock" | "outofstock";
  stock_quantity: number;
  category: BysonCategory | null;
  images: string[];
  weight?: string | number | null;
  /** Nohar sets this to true on products that require a quote instead of direct purchase. */
  is_rfq?: boolean;
  meta_data?: Record<string, unknown>;
  variations?: BysonVariation[];
}

export interface BysonPagination {
  current_page: number;
  limit: number;
  total_items: number;
  total_variants: number;
  total_pages: number;
}

export interface BysonCatalogResponse {
  products: BysonProduct[];
  pagination: BysonPagination;
}

export interface BysonOrderPayload {
  customer_info: {
    name: string;
    email: string;
    phone?: string;
    address1?: string;
    address2?: string;
    postal_code?: string;
  };
  items: Array<{
    product_id: number;
    variant_id?: number | null;
    quantity: number;
  }>;
}

export interface BysonOrderResponse {
  success: boolean;
  message: string;
  order_id: number;
  payment_link: string | null;
}

/* =========================================================================
   Fetch helpers
   ========================================================================= */

function assertConfigured(): void {
  if (!BYSON_CONFIGURED) {
    throw new Error(
      "BysonHub API not configured. Set BYSONHUB_API_URL and BYSONHUB_API_KEY in env.",
    );
  }
}

/**
 * Fetch one page of the catalog. Cached for 300s on the Next data cache,
 * tagged for on-demand revalidation if we wire a webhook later.
 */
export async function fetchCatalogPage(
  params: { page?: number; limit?: number; search?: string } = {},
): Promise<BysonCatalogResponse> {
  assertConfigured();
  const search = new URLSearchParams();
  search.set("page", String(params.page ?? 1));
  search.set("limit", String(params.limit ?? 200));
  if (params.search) search.set("search", params.search);

  const url = `${BYSON_API_URL}/api/v1/external/catalog?${search.toString()}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": BYSON_API_KEY,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      next: { revalidate: CATALOG_REVALIDATE_SECONDS, tags: [CATALOG_TAG] },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `BysonHub catalog ${res.status} ${res.statusText}: ${body.slice(0, 200)}`,
      );
    }
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch the entire catalog by walking pages until exhausted.
 * Cached at the page level so subsequent calls only re-hit live pages
 * that have changed (none, normally).
 */
/**
 * Page size is capped at 100 because BysonHub responses average ~10 KB/product
 * and Next's data cache rejects items over 2 MB. Smaller chunks → all
 * cached → cold renders only fetch once per chunk per revalidate window.
 */
const CATALOG_PAGE_SIZE = 50;

export async function fetchFullCatalog(): Promise<BysonProduct[]> {
  const first = await fetchCatalogPage({ page: 1, limit: CATALOG_PAGE_SIZE });
  const totalPages = first.pagination.total_pages;
  if (totalPages <= 1) return first.products;

  // Parallel-fetch the rest. Each page is cached individually by Next, so
  // warm requests barely hit the network. Cold requests bound by the
  // slowest single fetch, not the sum.
  const remaining = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) =>
      fetchCatalogPage({ page: i + 2, limit: CATALOG_PAGE_SIZE }),
    ),
  );
  return [first, ...remaining].flatMap((p) => p.products);
}

/**
 * POST an order. NOT cached. Caller MUST supply a unique idempotency key
 * per checkout attempt (UUID is fine).
 */
export async function placeOrder(
  payload: BysonOrderPayload,
  idempotencyKey: string,
): Promise<BysonOrderResponse> {
  assertConfigured();
  if (!idempotencyKey) {
    throw new Error("placeOrder requires a non-empty idempotency key.");
  }

  const url = `${BYSON_API_URL}/api/v1/external/orders`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "x-api-key": BYSON_API_KEY,
      "Content-Type": "application/json",
      "idempotency-key": idempotencyKey,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await res.text();
  let parsed: unknown;
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    parsed = { raw: text };
  }

  if (!res.ok) {
    const msg =
      (parsed as { message?: string }).message ??
      `BysonHub /orders ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }
  return parsed as BysonOrderResponse;
}
