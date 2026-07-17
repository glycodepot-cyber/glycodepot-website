export interface NavLink {
  label: string;
  href: string;
}

export const mainNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" }, // mega dropdown attaches here
  { label: "Services", href: "/services" },
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
