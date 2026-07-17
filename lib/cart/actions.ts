"use server";

/**
 * Server Actions invoked from client components.
 * Runtime entry-point — never imports server-only modules from a place
 * that the bundler could trace into the client bundle.
 */

import { createHash } from "node:crypto";
import {
  BYSON_CONFIGURED,
  placeOrder,
  type BysonOrderPayload,
} from "@/lib/api/bysonhub";
import { ghlContact, ghlNewsletter, ghlQuote } from "@/lib/api/ghl";

/**
 * Stable idempotency key derived from cart contents + customer email.
 * Double-clicks within a short window send the same key — BysonHub
 * dedupes server-side, so the user never creates a duplicate order.
 * The minute bucket lets a deliberate retry after >60s create a new key.
 */
function makeIdempotencyKey(input: SubmitOrderInput): string {
  const minuteBucket = Math.floor(Date.now() / 60_000);
  const stableShape = {
    email: input.customer.email.trim().toLowerCase(),
    items: input.items
      .map((i) => `${i.productId}|${i.variantId ?? ""}|${i.quantity}`)
      .sort(),
    minuteBucket,
  };
  return createHash("sha256")
    .update(JSON.stringify(stableShape))
    .digest("hex")
    .slice(0, 32);
}
import {
  bysonProductIdFromDomain,
  bysonVariantIdFromDomain,
} from "@/lib/api/bysonhub-map";
import type { Order, QuoteRequest, QuoteResponse } from "./types";

/* ----------- Checkout ----------- */

export interface SubmitOrderInput {
  customer: {
    name: string;
    email: string;
    phone: string;
    address1: string;
    address2?: string;
    postal_code?: string;
  };
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
  }>;
}

export type SubmitOrderResult =
  | { ok: true; orderId: string; paymentLink: string | null }
  | { ok: false; error: string };

export async function submitOrder(
  input: SubmitOrderInput,
): Promise<SubmitOrderResult> {
  if (!BYSON_CONFIGURED) {
    return {
      ok: false,
      error:
        "Order backend not configured yet. We've captured your details — our team will follow up.",
    };
  }
  if (!input.items.length) {
    return { ok: false, error: "Your cart is empty." };
  }

  const mappedItems: BysonOrderPayload["items"] = [];
  for (const i of input.items) {
    const productId = bysonProductIdFromDomain(i.productId);
    if (productId === null) {
      return {
        ok: false,
        error: `Unrecognised product reference: ${i.productId}`,
      };
    }
    const variantId = bysonVariantIdFromDomain(i.variantId);
    mappedItems.push({
      product_id: productId,
      variant_id: variantId ?? undefined,
      quantity: i.quantity,
    });
  }

  const payload: BysonOrderPayload = {
    customer_info: input.customer,
    items: mappedItems,
  };

  try {
    const res = await placeOrder(payload, makeIdempotencyKey(input));
    return {
      ok: true,
      orderId: String(res.order_id),
      paymentLink: res.payment_link,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unable to place the order.";
    return { ok: false, error: message };
  }
}

/* ----------- Quote (RFQ) → BysonHub + GHL ----------- */

export async function submitQuote(
  request: QuoteRequest,
): Promise<QuoteResponse> {
  // Primary: post to BysonHub so the RFQ appears in their Orders dashboard
  if (BYSON_CONFIGURED && request.lines.length) {
    const mappedItems: BysonOrderPayload["items"] = [];
    for (const line of request.lines) {
      const productId = bysonProductIdFromDomain(line.productId);
      if (productId !== null) {
        mappedItems.push({
          product_id: productId,
          variant_id: bysonVariantIdFromDomain(line.variantId) ?? undefined,
          quantity: line.quantity,
        });
      }
    }

    if (mappedItems.length) {
      const rfqKey = createHash("sha256")
        .update(
          JSON.stringify({
            email: request.customer.email.trim().toLowerCase(),
            items: mappedItems.map((i) => `${i.product_id}|${i.variant_id ?? ""}|${i.quantity}`).sort(),
            bucket: Math.floor(Date.now() / 60_000),
          }),
        )
        .digest("hex")
        .slice(0, 32);

      await placeOrder(
        {
          customer_info: {
            name: request.customer.name,
            email: request.customer.email,
            phone: request.customer.phone ?? "N/A",
            address1: "N/A",
            address2: "N/A",
            postal_code: "N/A",
          },
          items: mappedItems.map((i) => ({
            product_id: i.product_id,
            variant_id: i.variant_id ?? 0,
            quantity: 1,
          })),
        },
        rfqKey,
      );
    }
  }

  // Secondary: fire GHL webhook if configured (CRM notification)
  await ghlQuote({
    name: request.customer.name,
    email: request.customer.email,
    subject: "Quote request",
    message:
      `Customer: ${request.customer.name} (${request.customer.email})\n` +
      (request.customer.company ? `Company: ${request.customer.company}\n` : "") +
      (request.customer.phone ? `Phone: ${request.customer.phone}\n` : "") +
      (request.customer.notes ? `Notes: ${request.customer.notes}\n` : "") +
      `\nLines:\n` +
      request.lines
        .map(
          (l) =>
            `  - ${l.quantity}× ${l.name}${l.variantId ? ` (variant ${l.variantId})` : ""}`,
        )
        .join("\n"),
    extra: { lines: request.lines, customer: request.customer },
  });

  return {
    id: `quote_${Date.now()}`,
    receivedAt: new Date().toISOString(),
  };
}

/* ----------- Contact form → GHL ----------- */

export interface SubmitContactInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function submitContact(
  input: SubmitContactInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  return ghlContact({
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
  });
}

/* ----------- Newsletter signup → GHL ----------- */

export async function subscribeNewsletter(
  email: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  return ghlNewsletter({
    name: email.split("@")[0],
    email,
    message: "Newsletter subscription",
  });
}

/* ----------- Order tracking — stub, no GET /orders in API yet ----------- */

export async function trackOrder(
  _orderId: string,
  _billingEmail: string,
): Promise<Order | null> {
  return null;
}
