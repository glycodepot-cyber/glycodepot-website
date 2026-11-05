import "server-only";

/**
 * Thin GoHighLevel inbound-webhook poster.
 *
 * Each form posts a JSON payload to a different webhook URL. We don't ship
 * real credentials in code — set these as Vercel env vars when the client
 * provides them, and the forms light up automatically.
 *
 *   GHL_CONTACT_WEBHOOK_URL
 *   GHL_QUOTE_WEBHOOK_URL
 *   GHL_NEWSLETTER_WEBHOOK_URL
 *
 * When a URL is missing in development we log the payload and return success,
 * so local work doesn't need live webhooks. In production a missing URL is a
 * REAL failure and is reported as one: these payloads carry consent records
 * and opt-out requests, and silently discarding one while telling the visitor
 * "thanks, you're on the list" is both a broken promise and a compliance gap.
 */

const FETCH_TIMEOUT_MS = 10_000;

async function postJson(url: string, body: unknown): Promise<void> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`GHL webhook ${res.status}: ${text.slice(0, 200)}`);
    }
  } finally {
    clearTimeout(t);
  }
}

export interface GHLContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  source: "contact" | "quote-request" | "newsletter";
  /**
   * Structured fields that map 1:1 to GHL custom fields (SOW §3.2). Flattened
   * to the TOP LEVEL of the webhook body so GHL's inbound-webhook field mapper
   * can pick them up by key without digging into a nested object. Keep keys in
   * sync with the GHL field mapping documented in the SOP.
   */
  fields?: Record<string, unknown>;
  extra?: Record<string, unknown>;
}

async function sendToGHL(
  envVar: string,
  payload: GHLContactPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const url = process.env[envVar];
  if (!url) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        `[crm] ${envVar} is not set; refusing to drop a submission silently.`,
      );
      return {
        ok: false,
        error:
          "We couldn't record that just now. Please email info@glycodepot.com and we'll handle it directly.",
      };
    }
    console.info(
      `[crm] ${envVar} not set; would have posted:`,
      JSON.stringify(payload).slice(0, 300),
    );
    return { ok: true };
  }
  try {
    const { fields, ...rest } = payload;
    // Flatten `fields` to the top level; keep the rest of the payload alongside.
    await postJson(url, {
      ...rest,
      ...(fields ?? {}),
      receivedAt: new Date().toISOString(),
    });
    return { ok: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "GHL webhook unreachable";
    console.error("[ghl] post failed:", message);
    return { ok: false, error: message };
  }
}

export const ghlContact = (payload: Omit<GHLContactPayload, "source">) =>
  sendToGHL("GHL_CONTACT_WEBHOOK_URL", { ...payload, source: "contact" });

export const ghlQuote = (payload: Omit<GHLContactPayload, "source">) =>
  sendToGHL("GHL_QUOTE_WEBHOOK_URL", { ...payload, source: "quote-request" });

export const ghlNewsletter = (payload: Omit<GHLContactPayload, "source">) =>
  sendToGHL("GHL_NEWSLETTER_WEBHOOK_URL", { ...payload, source: "newsletter" });
