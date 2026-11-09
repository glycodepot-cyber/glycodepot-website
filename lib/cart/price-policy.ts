import type { Money, Product, ProductVariant } from "./types";

/**
 * The variant a product is priced by: the cheapest one carrying a real price.
 *
 * Three things must agree on this or Google suspends the account, so they all
 * call this one function:
 *
 *   1. `applyPricePolicy` below, which puts its price in `product.price`
 *   2. the Google Merchant feed, which advertises `product.price`
 *   3. `ProductPurchasePanel`, which opens on this variant, so the price a
 *      visitor sees on arrival is the price that was advertised
 *
 * They disagreed until 2026-11-08: the panel opened on the first in-stock
 * priced variant, so UDP-GalNAz advertised $220 and then showed $1,800 on
 * arrival. Stock is deliberately not considered here — the feed reports
 * availability from this same variant, so price and availability stay
 * consistent with each other.
 */
export function pricedVariant(
  variants: ProductVariant[],
): ProductVariant | undefined {
  return variants
    .filter((variant) => variant.price !== null)
    .sort((a, b) => a.price!.amount - b.price!.amount)[0];
}

/** A stored .99 price is an internal RFQ marker, never a checkout price. */
export function isQuotePriceCents(cents: number | null): boolean {
  return cents === null || !Number.isSafeInteger(cents) || cents < 0 || cents % 100 === 99;
}

export function publicPrice(price: Money | null): Money | null {
  return price && !isQuotePriceCents(Math.round(price.amount * 100)) ? price : null;
}

export function applyPricePolicy(product: Product): Product {
  const variants = product.variants.map(variant => {
    const price = publicPrice(variant.price);
    return { ...variant, price, compareAtPrice: price ? publicPrice(variant.compareAtPrice ?? null) : null };
  });
  const cardVariant = pricedVariant(variants);
  const price = cardVariant?.price ?? publicPrice(product.price);
  return {
    ...product,
    price,
    compareAtPrice: price ? (cardVariant ? cardVariant.compareAtPrice : publicPrice(product.compareAtPrice ?? null)) : null,
    variants,
  };
}

// Exact products in the approved October stock/pricing sheet, not the entire category.
export const PROTECTED_SUGAR_NUCLEOTIDE_IDS = [
  "bprd_15158", "bprd_15161", "bprd_15164", "bprd_15167", "bprd_15159",
  "bprd_15162", "bprd_15165", "bprd_15160", "bprd_15163", "bprd_15166",
  "bprd_15182", "bprd_15183", "bprd_15218", "bprd_15216", "bprd_15220",
  "bprd_15219", "bprd_11425", "bprd_11453", "bprd_11444", "bprd_11454",
  "bprd_12768",
] as const;
