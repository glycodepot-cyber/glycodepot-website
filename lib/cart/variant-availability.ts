/** A quote can be requested without inventory; checkout still requires stock. */
export function canSelectVariant(variant: { inStock: boolean; price: unknown | null }): boolean {
  return variant.inStock || variant.price === null;
}
