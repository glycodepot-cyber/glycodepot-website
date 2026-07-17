/**
 * Map BysonHub raw shapes to GlycoDepot domain types.
 *
 * Rules:
 *  - All ids become strings (the rest of the app is string-typed).
 *  - Variant or product with price=0 → null (front end shows "Request quote").
 *  - Product-level price = lowest non-zero variant price ("from $X" cards).
 *  - Category slug = kebab-case of the API name.
 *  - Product slug = kebab-case of the API name; SKU appended only for collisions
 *    (resolved at the build-catalog level, not here).
 */

import type {
  BysonCategory,
  BysonProduct,
  BysonVariation,
} from "./bysonhub";
import type {
  Category,
  Money,
  Product,
  ProductVariant,
} from "@/lib/cart/types";

const usd = (amount: number): Money => ({ amount, currency: "USD" });

export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * BysonHub descriptions are WooCommerce HTML blobs that have also been
 * round-tripped through JSON encoding, so they contain literal `\n`/`\r`/`\t`
 * sequences (two characters: backslash + letter) rather than real newlines.
 * Strip tags, decode escapes + entities, and preserve paragraph breaks so
 * the product detail page can render structured spec sheets readably.
 */
export function stripHtmlToText(html: string | undefined | null): string {
  if (!html) return "";
  return html
    // Convert literal escape sequences to real characters FIRST.
    .replace(/\\r\\n|\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\\t/g, " ")
    // Then strip HTML.
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    // Decode HTML entities.
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Collapse runs of spaces/tabs but preserve real newlines.
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    // Trim each line, then the whole string.
    .split("\n")
    .map((line) => line.trim())
    .filter((line, i, arr) => line || (i > 0 && arr[i - 1]))
    .join("\n")
    .trim();
}

/** Collapse to a single line for card subtitles + meta tags. */
export function flattenToSingleLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function categoryFromByson(raw: BysonCategory): Category {
  return {
    id: `bcat_${raw.id}`,
    slug: toSlug(raw.name),
    name: raw.name,
  };
}

/**
 * BysonHub's `sale_price` is their admin UI's "Compare at price" — the higher
 * struck-through figure — NOT a WooCommerce-style discount. Verified across the
 * full catalog: of 54 variants with it set, every one is ABOVE `regular_price`
 * and none below. `regular_price` is what the customer actually pays.
 *
 * Guarded with `> price` anyway: if BysonHub ever sends a genuine discount
 * (sale < regular), we drop it rather than render a struck-through price that
 * is lower than the live price, which would misrepresent the offer.
 */
function compareAtFrom(price: number, sale: number | null): Money | null {
  if (sale === null || !(sale > price)) return null;
  return usd(sale);
}

function variantFromByson(raw: BysonVariation): ProductVariant {
  const price = raw.regular_price > 0 ? usd(raw.regular_price) : null;
  return {
    id: `bvar_${raw.id}`,
    sku: raw.sku,
    name: raw.name,
    price,
    compareAtPrice: price
      ? compareAtFrom(raw.regular_price, raw.sale_price)
      : null,
    inStock: raw.stock_status === "instock",
  };
}

export function productFromByson(raw: BysonProduct): Product {
  const variants = (raw.variations ?? []).map(variantFromByson);

  // Card price: lowest non-zero variant price; for simple products use product price.
  // Track the variant that wins, so its compare-at travels with it — otherwise
  // the struck-through figure could belong to a different size than the price.
  const pricedVariants = variants.filter(
    (v): v is ProductVariant & { price: Money } =>
      typeof v.price?.amount === "number" && v.price.amount > 0,
  );
  const cheapestVariant = pricedVariants.length
    ? pricedVariants.reduce((a, b) => (b.price.amount < a.price.amount ? b : a))
    : null;
  const minVariantPrice = cheapestVariant?.price.amount ?? null;
  // is_rfq = true means this product must go through the quote flow — no direct purchase.
  // Force price to null so all existing null-price UI (quote button, "Quote on request")
  // kicks in automatically, regardless of what price the API might also return.
  const isRfq = raw.is_rfq === true;
  const productPrice: Money | null = isRfq
    ? null
    : minVariantPrice !== null
      ? usd(minVariantPrice)
      : raw.regular_price > 0
        ? usd(raw.regular_price)
        : null;

  // Compare-at must describe the same variant the card price came from.
  // RFQ products never show a price, so they never show a compare-at either.
  const productCompareAt: Money | null = isRfq
    ? null
    : minVariantPrice !== null
      ? (cheapestVariant?.compareAtPrice ?? null)
      : raw.regular_price > 0
        ? compareAtFrom(raw.regular_price, raw.sale_price)
        : null;

  const primaryCategoryId = raw.category ? `bcat_${raw.category.id}` : undefined;

  const images = raw.images.length
    ? raw.images.map((src) => ({ src, alt: raw.name }))
    : [{ src: "/Glycodepot_Logo.jpeg", alt: raw.name }];

  // Attributes from variation meta_data "Attribute 1 name" pattern.
  const attributes: Record<string, string> = {};
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

/**
 * Build the category list from a full set of mapped products (the API has no
 * dedicated /categories endpoint, so we derive uniquely from products).
 */
export function buildCategories(rawProducts: BysonProduct[]): Category[] {
  const byId = new Map<number, { raw: BysonCategory; count: number }>();
  for (const p of rawProducts) {
    if (!p.category) continue;
    const existing = byId.get(p.category.id);
    if (existing) existing.count += 1;
    else byId.set(p.category.id, { raw: p.category, count: 1 });
  }
  return [...byId.values()]
    .sort((a, b) => b.count - a.count)
    .map(({ raw, count }) => ({
      ...categoryFromByson(raw),
      productCount: count,
    }));
}

/**
 * Recover the BysonHub numeric ids from our prefixed string ids — required
 * when posting an order back to the API.
 */
export function bysonProductIdFromDomain(id: string): number | null {
  const m = /^bprd_(\d+)$/.exec(id);
  return m ? Number(m[1]) : null;
}

export function bysonVariantIdFromDomain(id: string | undefined): number | null {
  if (!id) return null;
  const m = /^bvar_(\d+)$/.exec(id);
  return m ? Number(m[1]) : null;
}
