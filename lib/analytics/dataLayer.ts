/**
 * GTM dataLayer bridge.
 *
 * Every conversion the SOW (§4.1) needs is pushed here as a named event.
 * GTM (once the container in NEXT_PUBLIC_GTM_ID is configured) listens for
 * these event names and forwards them to Google Ads / GA4. The website's job
 * is only to *emit* the events with clean data; the routing lives in GTM so
 * marketing can retarget tags without a redeploy.
 *
 * SSR-safe: pushes are dropped when `window` is absent.
 */

import { getAttribution } from "./utm";

export type GtmEventName =
  | "RFQ_Submit"
  | "Purchase"
  | "High_Intent_Visit"
  | "Add_To_Cart"
  | "Quote_Page_View";

type DataLayerRecord = Record<string, unknown> & { event: GtmEventName };

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/** Low-level push. Attaches first-touch attribution to every event so GA4
 * audiences and Google Ads see consistent source data. */
export function pushEvent(
  event: GtmEventName,
  payload: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const a = getAttribution();
  const record: DataLayerRecord = {
    event,
    ...payload,
    utm_campaign: a.campaign,
    utm_content: a.content,
    lead_source_hint: a.gclid ? "google_ads" : a.source,
  };
  window.dataLayer.push(record);
}

/* ---- Typed convenience wrappers, one per SOW conversion ---- */

/** §4.1 RFQ_Submit — RFQ cart submitted. */
export function trackRfqSubmit(input: {
  itemCount: number;
  categories: string[];
  bhQuoteId?: string;
}): void {
  pushEvent("RFQ_Submit", {
    rfq_item_count: input.itemCount,
    product_categories: input.categories,
    bh_quote_id: input.bhQuoteId,
  });
}

/** §4.1 Purchase — order confirmed. */
export function trackPurchase(input: {
  orderId: string;
  value: number;
  currency?: string;
  itemCount: number;
}): void {
  pushEvent("Purchase", {
    transaction_id: input.orderId,
    value: input.value,
    currency: input.currency ?? "USD",
    item_count: input.itemCount,
  });
}

/** §4.1 High_Intent_Visit — >60s on a product page (GA4 audience). */
export function trackHighIntentVisit(input: {
  productId: string;
  productName: string;
}): void {
  pushEvent("High_Intent_Visit", {
    product_id: input.productId,
    product_name: input.productName,
  });
}

/** §4.1 Add_To_Cart — item added to cart (GA4 micro-conversion). */
export function trackAddToCart(input: {
  productId: string;
  productName: string;
  variantName?: string;
  value?: number;
}): void {
  pushEvent("Add_To_Cart", {
    product_id: input.productId,
    product_name: input.productName,
    variant_name: input.variantName,
    value: input.value,
    currency: "USD",
  });
}

/** §4.1 Quote_Page_View — /quote-request viewed (GA4 micro-conversion). */
export function trackQuotePageView(): void {
  pushEvent("Quote_Page_View", {});
}
