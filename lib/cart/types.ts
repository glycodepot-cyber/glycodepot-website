/**
 * Domain types for the GlycoDepot commerce backend.
 * Shapes are intentionally minimal — extend as the real API surface is wired in.
 */

export type Money = {
  amount: number;          // smallest unit if api dictates, else dollars; normalise on adapter boundary
  currency: "USD";
};

export type Image = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type ProductId = string;
export type CategoryId = string;
export type CartId = string;
export type OrderId = string;
export type CustomerId = string;

export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  description?: string;
  parentId?: CategoryId | null;
  image?: Image;
  productCount?: number;
}

export interface ProductVariant {
  id: string;
  sku?: string;
  name?: string;          // e.g., "10 mg", "50 mg"
  price: Money | null;    // null → quote-only
  /**
   * Higher "was" price, rendered struck-through next to `price`.
   * Sourced from BysonHub's `compare_price` ("Compare at price") — always
   * ABOVE `regular_price`, never a discount. Only set when it genuinely
   * exceeds `price`.
   */
  compareAtPrice?: Money | null;
  inStock: boolean;
}

export interface Product {
  id: ProductId;
  slug: string;
  name: string;
  shortDescription?: string;
  description?: string;
  categories: CategoryId[];
  primaryCategoryId?: CategoryId;
  images: Image[];
  variants: ProductVariant[];
  price: Money | null;      // null → "Request a quote"
  /**
   * Card-level "was" price, struck through beside `price`. Mirrors the
   * variant whose price became the card price, so the pair always shown
   * together refers to the same variant.
   */
  compareAtPrice?: Money | null;
  /** True when BysonHub marks this product as RFQ-only (is_rfq = true). Price will always be null. */
  isRfq?: boolean;
  badge?: "sale" | "new" | "popular" | "hot" | null;
  isFeatured?: boolean;
  isHot?: boolean;
  /** Product must ship with dry ice; managed with the `dry-ice` catalog tag. */
  requiresDryIce?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  attributes?: Record<string, string>;
}

export interface CartLine {
  id: string;
  productId: ProductId;
  variantId?: string;
  name: string;
  image?: Image;
  unitPrice: Money;
  quantity: number;
  subtotal: Money;
}

export interface Cart {
  id: CartId;
  lines: CartLine[];
  subtotal: Money;
  total: Money;
  itemCount: number;
}

export interface QuoteLine {
  productId: ProductId;
  variantId?: string;
  name: string;
  quantity: number;
  image?: Image;
}

export interface QuoteRequest {
  lines: QuoteLine[];
  customer: {
    name: string;
    email: string;
    company: string;
    phone: string;
    address1: string;
    city: string;
    state: string;
    postal: string;
    /** ISO 3166-1 alpha-2, e.g. "US" — same convention as checkout. */
    country: string;
    billingAddress?: {
      firstName: string;
      lastName: string;
      company: string;
      address1: string;
      city: string;
      state: string;
      postal: string;
      country: string;
    };
    notes?: string;
  };
  /**
   * Marketing attribution + category context, resolved on the client (where
   * localStorage attribution lives) and forwarded so the GHL webhook payload
   * can populate the SOW §3.2 fields. All optional — the quote still submits
   * without them.
   */
  meta?: {
    productCategories?: string[]; // §3.2 "Product category interest" (group names)
    leadSource?: string;
    googleAdsCampaign?: string;
    googleAdsAdGroup?: string;
    landingPageUrl?: string;
    gclid?: string;
  };
}

export interface QuoteResponse {
  id: string;
  receivedAt: string;
  /** BysonHub Quote Request / Quotation ID, when the RFQ reached BysonHub. */
  bhQuotationId?: string;
}

export interface Customer {
  id: CustomerId;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface Order {
  id: OrderId;
  number: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  placedAt: string;
  total: Money;
  lines: CartLine[];
}

export interface ListQuery {
  page?: number;
  pageSize?: number;
  sort?: "popular" | "newest" | "price-asc" | "price-desc";
  search?: string;
  categorySlug?: string;
  /** Filter to all categories within a hierarchical group (Glycochemistry/Biology/Analysis/Other). */
  groupSlug?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
