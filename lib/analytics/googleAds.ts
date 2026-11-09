// Public Google Ads identifiers, reused from the existing conversion actions.
export const GOOGLE_ADS_ID = "AW-11409763010";
export const QUOTE_CONVERSION = `${GOOGLE_ADS_ID}/D-zcCMnJ2OEcEMLVzMAq`;
export const PURCHASE_CONVERSION = `${GOOGLE_ADS_ID}/sti5CJ_czYsbEMLVzMAq`;

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
 * configured to fall back to $1 when no value arrives. Passing an explicit 0
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
