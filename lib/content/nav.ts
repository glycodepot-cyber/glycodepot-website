export interface NavLink {
  label: string;
  href: string;
}

export interface ServiceNavLink extends NavLink {
  /** One short line shown under the label in the Services dropdown. */
  description: string;
}

/**
 * Service pages with a dedicated route, surfaced in the Services dropdown.
 * Services without their own page live on /services only — add them here as
 * and when they get a route of their own.
 */
export const serviceNav: ServiceNavLink[] = [
  {
    label: "Enzymatic Glycosylation",
    href: "/services/enzymatic-glycosylation",
    description:
      "Screen your small molecule against 380 plant glycosyltransferases, then scale the hit.",
  },
  {
    label: "Custom Glycan Synthesis",
    href: "/services/custom-glycan-synthesis",
    description:
      "Glycans and oligosaccharides built to your target structure and quantity.",
  },
];

export const mainNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" }, // mega dropdown attaches here
  { label: "Services", href: "/services" }, // services dropdown attaches here
  { label: "Blog", href: "/blog" },
  { label: "Order Tracking", href: "/order-tracking" },
  { label: "Start Selling", href: "/start-selling" },
];

export const utilityNav = {
  cart: { label: "Cart", href: "/cart" },
  account: { label: "My account", href: "/my-account" },
} as const;

export const popularSearches: string[] = [
  "UDP-GalNAz",
  "GloboH",
  "Lectin array",
  "Glycan array",
  "Human Milk Oligos",
  "Sugar Nucleotides",
  "Glycan antibodies",
  "PNGFase",
  "L-Fucose",
];

export const searchPlaceholder = "Search here";
