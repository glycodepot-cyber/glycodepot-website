import { PLACEHOLDER_IMAGE_SRC } from "../cart/client";
import type { Category, Product } from "../cart/types";
import { SITE_URL } from "../site-url";
import { productDescription } from "./product-data";

/**
 * Google Merchant Center product feed.
 *
 * Why this file exists: Merchant Center was running on "Found by Google" —
 * an automatic crawl of glycodepot.com with no feed behind it. That crawl
 * ingests every page carrying Product schema, which is most of a catalogue
 * that is predominantly quote-only, and then disapproves each one for
 * "missing product price". A real feed takes precedence over the crawl and
 * submits only what is genuinely purchasable.
 *
 * Two rules govern everything here, and neither is negotiable:
 *
 * 1. NEVER invent a price. A product reaches this feed only when
 *    `applyPricePolicy` has already produced a non-null `price`, which means
 *    the stored value survived `isQuotePriceCents` (the .99 RFQ marker is
 *    stripped there). An RFQ product has no price on its landing page and no
 *    checkout, so any number submitted for it would mismatch by definition —
 *    and Google enforces price accuracy across feed, landing page, structured
 *    data and checkout, with account suspension as the endpoint.
 *
 * 2. ONE ITEM PER PRODUCT, priced at `product.price`. `applyPricePolicy` sets
 *    that to the cheapest real variant price, which is exactly the figure the
 *    product page shows. Submitting each variant separately would advertise
 *    prices that are not the prominent price on the landing page unless the
 *    variant were preselected there, which it is not. Google's guidance for a
 *    price range is to submit the cheapest value; that is what this does.
 */

const MAX_ADDITIONAL_IMAGES = 10;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Strip control characters XML 1.0 cannot represent, then escape. */
function tag(name: string, value: string): string {
  const clean = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
  return `<${name}>${escapeXml(clean)}</${name}>`;
}

function absolute(src: string): string | null {
  try {
    return new URL(src, SITE_URL).href;
  } catch {
    return null;
  }
}

function categorySlug(product: Product, categories: Category[]): string | null {
  const id = product.primaryCategoryId ?? product.categories[0];
  if (!id) return null;
  return categories.find((c) => c.id === id)?.slug ?? null;
}

/**
 * Availability for the offer actually being advertised: the variant whose
 * price became `product.price`. Falling back to the product's own stock flag
 * when there are no variants.
 */
function availability(product: Product): "in_stock" | "out_of_stock" {
  const priced = product.variants.filter((v) => v.price !== null);
  if (priced.length === 0) return "in_stock";
  const cheapest = priced.reduce((low, v) =>
    v.price!.amount < low.price!.amount ? v : low,
  );
  return cheapest.inStock ? "in_stock" : "out_of_stock";
}

export function merchantFeedItems(
  products: Product[],
  categories: Category[],
): string[] {
  const items: string[] = [];

  for (const product of products) {
    // Rule 1. `price` is non-null only after the price policy has cleared it.
    if (!product.price) continue;
    if (product.isRfq) continue;

    const slug = categorySlug(product, categories);
    if (!slug) continue;

    const link = `${SITE_URL}/products/${encodeURIComponent(slug)}/${encodeURIComponent(product.slug)}`;
    // The brand placeholder stands in for images that cannot currently be
    // served. It is a logo, not a product shot: Google treats a generic or
    // promotional image as grounds for disapproval, so such a product is
    // left out of the feed entirely rather than submitted to fail.
    const images = product.images
      .filter((image) => image.src !== PLACEHOLDER_IMAGE_SRC)
      .map((image) => absolute(image.src))
      .filter((src): src is string => src !== null);
    // Google requires an image. No image, no listing — better absent than disapproved.
    if (images.length === 0) continue;

    const category = categories.find(
      (c) => c.id === (product.primaryCategoryId ?? product.categories[0]),
    );

    const parts = [
      tag("g:id", product.sku || product.id),
      tag("g:title", product.name),
      tag("g:description", productDescription(product)),
      tag("g:link", link),
      tag("g:image_link", images[0]),
      ...images
        .slice(1, 1 + MAX_ADDITIONAL_IMAGES)
        .map((src) => tag("g:additional_image_link", src)),
      tag("g:availability", availability(product)),
      tag(
        "g:price",
        `${product.price.amount.toFixed(2)} ${product.price.currency}`,
      ),
      tag("g:brand", "GlycoDepot"),
      tag("g:condition", "new"),
    ];

    // Research chemicals carry no GTIN. The SKU is the manufacturer part
    // number; without one, Google must be told no identifier exists.
    if (product.sku) parts.push(tag("g:mpn", product.sku));
    else parts.push(tag("g:identifier_exists", "no"));

    if (category) parts.push(tag("g:product_type", category.name));

    items.push(`<item>${parts.join("")}</item>`);
  }

  return items;
}

export function buildMerchantFeed(
  products: Product[],
  categories: Category[],
): string {
  const items = merchantFeedItems(products, categories);
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
${tag("title", "GlycoDepot product feed")}
${tag("link", SITE_URL)}
${tag("description", "Purchasable GlycoDepot catalogue items. Quote-only products are deliberately excluded — they have no price and no checkout.")}
${items.join("\n")}
</channel>
</rss>`;
}
