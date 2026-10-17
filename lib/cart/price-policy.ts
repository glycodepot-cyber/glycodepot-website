import type { Money, Product } from "./types";

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
  const cardVariant = variants.filter(variant => variant.price !== null)
    .sort((a,b) => a.price!.amount-b.price!.amount)[0];
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
