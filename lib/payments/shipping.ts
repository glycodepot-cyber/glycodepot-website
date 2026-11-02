export const DRY_ICE_TAG = "dry-ice";

export function shippingFeeCents(country: string, requiresDryIce: boolean): number {
  const isUs = country.trim().toUpperCase() === "US";
  if (isUs) return requiresDryIce ? 12_000 : 6_000;
  return requiresDryIce ? 15_000 : 9_000;
}

export function hasDryIceTag(tags: readonly string[] | null | undefined): boolean {
  return (tags ?? []).some((tag) =>
    ["dry-ice", "dry ice", "dry_ice"].includes(tag.trim().toLowerCase()),
  );
}
