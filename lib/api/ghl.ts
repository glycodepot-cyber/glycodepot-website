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
 * When a URL is missing we log the payload (so the form still feels
 * connected during demos) but return success so the user UX is unchanged.
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
  extra?: Record<string, unknown>;
}

async function sendToGHL(
  envVar: string,
  payload: GHLContactPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const url = process.env[envVar];
  if (!url) {
    console.info(
      `[ghl] ${envVar} not set; would have posted:`,
      JSON.stringify(payload).slice(0, 300),
    );
    return { ok: true };
  }
  try {
    await postJson(url, { ...payload, receivedAt: new Date().toISOString() });
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
