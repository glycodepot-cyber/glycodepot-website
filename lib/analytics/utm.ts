/**
 * First-touch UTM / ad-click attribution.
 *
 * Captured once, on the visitor's FIRST landing, and persisted to
 * localStorage so it survives navigation and still describes the campaign
 * that actually acquired the lead — even if they submit an RFQ three pages
 * and two sessions later. Last-touch would overwrite this with "direct" or
 * an internal referrer, which is exactly the attribution bug we want to avoid.
 *
 * Feeds two consumers:
 *   1. The GHL webhook payload (SOW §3.2: Lead source, Google Ads campaign,
 *      Google Ads ad group, Landing page URL).
 *   2. GTM/GA4, which read the same values off the dataLayer.
 *
 * SSR-safe: every function no-ops when `window` is absent.
 */

const STORAGE_KEY = "gd_attribution_v1";

export interface Attribution {
  source?: string; // utm_source
  medium?: string; // utm_medium
  campaign?: string; // utm_campaign
  content?: string; // utm_content  → maps to "Google Ads ad group" in §3.2
  term?: string; // utm_term
  gclid?: string; // Google Ads click id
  landingPage?: string; // first page URL (path + query stripped of PII)
  capturedAt?: string; // ISO timestamp of first touch
}

/** Human-readable lead source derived from the raw UTM/gclid, for §3.2 "Lead source". */
export function deriveLeadSource(a: Attribution): string {
  if (a.gclid || a.source === "google" || a.medium === "cpc" || a.medium === "ppc") {
    return "Google Ads";
  }
  const s = a.source?.toLowerCase();
  if (s === "linkedin") return "LinkedIn";
  if (a.medium === "referral" || a.source === "referral") return "Referral";
  if (a.medium === "organic" || a.source === "organic") return "Organic";
  if (a.source) return "Website submission";
  return "Direct";
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Read+store attribution on first touch. Idempotent: once a value exists it is
 * never overwritten (first-touch wins). Call once, early, on the client.
 */
export function captureAttribution(): void {
  if (!isBrowser()) return;
  try {
    if (localStorage.getItem(STORAGE_KEY)) return; // already first-touched

    const params = new URLSearchParams(window.location.search);
    const get = (k: string) => params.get(k) || undefined;

    const attribution: Attribution = {
      source: get("utm_source"),
      medium: get("utm_medium"),
      campaign: get("utm_campaign"),
      content: get("utm_content"),
      term: get("utm_term"),
      gclid: get("gclid"),
      // Path only — never persist query strings, which can carry PII/tokens.
      landingPage: window.location.origin + window.location.pathname,
      capturedAt: new Date().toISOString(),
    };

    // Only persist a first-touch record if it carries at least one real signal;
    // otherwise leave storage empty so a later campaigned visit can still win.
    const hasSignal =
      attribution.source ||
      attribution.medium ||
      attribution.campaign ||
      attribution.gclid;
    if (!hasSignal) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // localStorage can throw in private mode / when full — attribution is
    // best-effort, never block the page over it.
  }
}

/** Read the stored first-touch attribution (empty object if none). */
export function getAttribution(): Attribution {
  if (!isBrowser()) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

/**
 * Flatten attribution into the exact field names the GHL webhook + §3.2
 * custom fields expect. Safe to spread straight into a webhook payload.
 */
export function attributionForWebhook(): {
  leadSource: string;
  googleAdsCampaign?: string;
  googleAdsAdGroup?: string;
  landingPageUrl?: string;
  gclid?: string;
} {
  const a = getAttribution();
  return {
    leadSource: deriveLeadSource(a),
    googleAdsCampaign: a.campaign,
    googleAdsAdGroup: a.content, // §3.2: "Auto-populated from UTM_content"
    landingPageUrl: a.landingPage,
    gclid: a.gclid,
  };
}
