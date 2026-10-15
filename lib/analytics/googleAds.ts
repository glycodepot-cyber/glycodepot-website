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

export function trackAdsConversion(destination: string, transactionId: string, value: number, currency = "USD") {
  if (typeof window === "undefined" || !["glycodepot.com", "www.glycodepot.com"].includes(window.location.hostname)) return;
  if (!transactionId || !Number.isFinite(value) || value < 0) return;
  window.dataLayer = window.dataLayer || [];
  // Google uses the Arguments object as its command queue format.
  // eslint-disable-next-line prefer-rest-params
  window.gtag = window.gtag || function () { window.dataLayer!.push(arguments); };
  window.gtag("event", "conversion", {
    send_to: destination,
    transaction_id: transactionId,
    value,
    currency,
    page_location: safeMeasurementUrl(window.location.href),
    page_referrer: document.referrer ? safeMeasurementUrl(document.referrer) : "",
  });
}
