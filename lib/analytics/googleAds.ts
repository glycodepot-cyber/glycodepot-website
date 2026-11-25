// Public Google Ads identifiers, reused from the existing conversion actions.
export const GOOGLE_ADS_ID = "AW-11409763010";
export const QUOTE_CONVERSION = `${GOOGLE_ADS_ID}/D-zcCMnJ2OEcEMLVzMAq`;
export const PURCHASE_CONVERSION = `${GOOGLE_ADS_ID}/sti5CJ_czYsbEMLVzMAq`;

/**
 * Micro-conversions, kept Primary while real quotes and purchases are too rare
 * for Smart Bidding to learn from. Both actions carry a fixed $5 value set in
 * Google Ads (a submitted quote is $50, a purchase its real amount), so they
 * are called without a value. Move them to Secondary in Google Ads once quotes
 * and purchases arrive at roughly 15–30 a month.
 *
 * "Add to cart for GlycoDepot" — stocked items (sugar nucleotides) added to the cart.
 */
export const ADD_TO_CART_CONVERSION = `${GOOGLE_ADS_ID}/1h5YCPyt0osbEMLVzMAq`;
/** "Add to quote list" — quote-only products added to the RFQ list (created 2026-11-25). */
export const ADD_TO_QUOTE_CONVERSION = `${GOOGLE_ADS_ID}/eDKBCOuih78dEMLVzMAq`;

/** A one-off id for events that have no natural record id (cart/quote-list adds). */
export function newEventId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${random}`;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Never send checkout secrets, customer form fields, or arbitrary query values. */
export function safeMeasurementUrl(url: string): string {
  const parsed = new URL(url);
  return parsed.origin + parsed.pathname;
}

/**
 * Send a conversion to Google Ads.
 *
 * `value` is optional on purpose. Omitting it leaves the amount to the
 * conversion action's own setting in Google Ads — "Submit lead form" is
 * configured with a fixed $50 per lead (since 2026-11-25). Passing an explicit 0
 * is NOT the same thing: it overrides that fallback and books the conversion
 * as worth nothing, which is what the RFQ call did until 2026-11-09. Only
 * pass a value when the amount is genuinely known, as a purchase is.
 */
export function trackAdsConversion(
  destination: string,
  transactionId: string,
  value?: number,
  currency = "USD",
) {
  if (typeof window === "undefined" || !["glycodepot.com", "www.glycodepot.com"].includes(window.location.hostname)) return;
  if (!transactionId) return;
  const hasValue = value !== undefined;
  if (hasValue && (!Number.isFinite(value) || value! < 0)) return;
  window.dataLayer = window.dataLayer || [];
  // Google uses the Arguments object as its command queue format.
  // eslint-disable-next-line prefer-rest-params
  window.gtag = window.gtag || function () { window.dataLayer!.push(arguments); };
  window.gtag("event", "conversion", {
    send_to: destination,
    transaction_id: transactionId,
    ...(hasValue ? { value, currency } : {}),
    page_location: safeMeasurementUrl(window.location.href),
    page_referrer: document.referrer ? safeMeasurementUrl(document.referrer) : "",
  });
}
