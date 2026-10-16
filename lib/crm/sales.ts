import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { getDb } from "@/lib/db";
import type { QuoteRequest, QuoteResponse } from "@/lib/cart/types";
import { serviceQuoteItem } from "./service-quote";
import { GhlSalesClient, type SalesPayload } from "./client";
import { drainSalesNotifications } from "@/lib/email/sales-outbox";
import { drainDraftEstimates } from "@/lib/crm/estimates";

export function directSalesEnabled(): boolean {
  return process.env.GHL_DIRECT_ENABLED === "true";
}

let schemaReady: Promise<void> | undefined;
export function ensureSalesSchema(): Promise<void> {
  if (!schemaReady) {
    const sql = getDb();
    schemaReady = sql`CREATE TABLE IF NOT EXISTS website_sales_requests (
      id uuid PRIMARY KEY,
      source_key text NOT NULL UNIQUE,
      payload jsonb NOT NULL,
      version integer NOT NULL DEFAULT 1,
      delivered_version integer NOT NULL DEFAULT 0,
      ghl_contact_id text,
      ghl_opportunity_id text,
      attempts integer NOT NULL DEFAULT 0,
      next_attempt_at timestamptz NOT NULL DEFAULT now(),
      locked_until timestamptz,
      lease_token uuid,
      last_error text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`.then(() => undefined).catch((error: unknown) => {
      schemaReady = undefined;
      throw error;
    });
  }
  return schemaReady;
}

export async function captureWebsiteQuote(request: QuoteRequest): Promise<QuoteResponse> {
  if (!request.customer?.name?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.customer?.email ?? "")) {
    throw new Error("Please provide your name and a valid email address.");
  }
  if (!Array.isArray(request.lines)) throw new Error("Invalid quote items.");
  const serviceItem = serviceQuoteItem(request);
  const service = Boolean(serviceItem);
  if (!Array.isArray(request.lines) || (!service && !request.lines.length) || request.lines.length > 100) {
    throw new Error("Please select between 1 and 100 products.");
  }
  await ensureSalesSchema();
  const sql = getDb();
  const details: string[] = [];
  const items: NonNullable<SalesPayload["quoteDetails"]>["items"] = [];
  if (serviceItem) {
    details.push("Custom glycan synthesis — feasibility and price review required");
    items.push(serviceItem);
  }
  for (const line of request.lines) {
    if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 10000) {
      throw new Error("Invalid requested quantity.");
    }
    // Resolve names/SKUs from the website database, not client-provided names.
    const rows = line.variantId
      ? await sql`SELECT concat(p.name, ' — ', v.name) AS name, coalesce(v.sku, p.sku) AS sku,
                         p.slug, c.slug AS category_slug, v.price_cents, p.tags
                  FROM products p JOIN product_variants v ON v.product_id = p.id
                  LEFT JOIN categories c ON c.id = p.primary_category_id
                  WHERE p.id = ${line.productId} AND v.id = ${line.variantId}
                    AND p.is_active = true AND v.is_active = true`
      : await sql`SELECT p.name, p.sku, p.slug, c.slug AS category_slug, p.price_cents, p.tags FROM products p
                  LEFT JOIN categories c ON c.id = p.primary_category_id
                  WHERE p.id = ${line.productId} AND p.is_active = true`;
    const product = (rows as Array<{ name: string; sku: string | null; slug: string; category_slug: string | null; price_cents:number|null;tags:string[] }>)[0];
    if (!product) throw new Error("A selected product is no longer available.");
    details.push(`${line.quantity} × ${product.name}${product.sku ? ` [${product.sku}]` : ""}`);
    const url = product.category_slug ? `${(process.env.NEXT_PUBLIC_SITE_URL ?? "https://glycodepot.com").replace(/\/$/, "")}/products/${encodeURIComponent(product.category_slug)}/${encodeURIComponent(product.slug)}` : undefined;
    if (url) details.push(url);
    items.push({productId:line.productId,variantId:line.variantId,name:product.name,sku:product.sku??undefined,quantity:line.quantity,unitPriceCents:product.price_cents,url,requiresDryIce:(product.tags??[]).some(tag=>/dry.?ice/i.test(tag))});
  }
  const customer = request.customer;
  const shipping = {name:customer.name,company:customer.company,address1:customer.address1,city:customer.city,state:customer.state,postal:customer.postal,country:customer.country,phone:customer.phone};
  const billing = customer.billingAddress ? {name:`${customer.billingAddress.firstName} ${customer.billingAddress.lastName}`.trim(),company:customer.billingAddress.company,address1:customer.billingAddress.address1,city:customer.billingAddress.city,state:customer.billingAddress.state,postal:customer.billingAddress.postal,country:customer.billingAddress.country,phone:customer.phone} : {...shipping};
  const key = createHash("sha256").update(JSON.stringify({
    customer: { ...customer, email: customer.email.trim().toLowerCase() },
    service: request.service,
    items: request.lines.map((l) => `${l.productId}|${l.variantId ?? ""}|${l.quantity}`).sort(),
    minute: Math.floor(Date.now() / 60_000),
  })).digest("hex");
  const id = randomUUID();
  const payload: SalesPayload = {
    reference: id,
    kind: "quote",
    paid: false,
    name: customer.name.trim(),
    email: customer.email.trim().toLowerCase(),
    phone: customer.phone,
    company: customer.company,
    productDetails: details.join("\n"),
    quoteDetails:{billing,shipping,items},
    notes: [customer.notes, `Billing: ${[billing.name,billing.company,billing.address1,billing.city,billing.state,billing.postal,billing.country].filter(Boolean).join(", ")}`, `Shipping: ${[customer.address1, customer.city, customer.state, customer.postal, customer.country].filter(Boolean).join(", ")}`,
      `Source: ${request.meta?.leadSource ?? "Website submission"}`,
      request.meta?.googleAdsCampaign ? `Google Ads campaign: ${request.meta.googleAdsCampaign}` : undefined,
      request.meta?.googleAdsAdGroup ? `Google Ads ad group: ${request.meta.googleAdsAdGroup}` : undefined,
      request.meta?.gclid ? `Google Ads click ID: ${request.meta.gclid}` : undefined,
      request.meta?.landingPageUrl ? `Landing page: ${request.meta.landingPageUrl}` : undefined].filter(Boolean).join("\n"),
  };
  const rows = await sql`INSERT INTO website_sales_requests (id, source_key, payload)
    VALUES (${id}::uuid, ${`quote:${key}`}, ${JSON.stringify(payload)}::jsonb)
    ON CONFLICT (source_key) DO UPDATE SET source_key = EXCLUDED.source_key
    RETURNING id, created_at`;
  const stored = (rows as Array<{ id: string; created_at: string }>)[0];
  return { id: stored.id, receivedAt: new Date(stored.created_at).toISOString() };
}

export async function captureWebsiteOrder(orderId: string, paid = false): Promise<void> {
  if (!directSalesEnabled()) return;
  await ensureSalesSchema();
  const sql = getDb();
  const orders = await sql`SELECT id, order_number, customer_name, customer_email, total_cents,
    shipping_address, billing_address, status FROM orders WHERE id = ${orderId}::uuid`;
  type OrderRow = { id: string; order_number: string; customer_name: string; customer_email: string;
    total_cents: number; shipping_address: Record<string, string>; billing_address: Record<string, string>; status: string };
  const order = (orders as OrderRow[])[0];
  if (!order) throw new Error("Website order was not found");
  const items = await sql`SELECT name, sku, quantity FROM order_items WHERE order_id = ${orderId}::uuid ORDER BY id`;
  const payload: SalesPayload = {
    reference: order.id,
    kind: "order",
    paid: paid || order.status === "paid",
    name: order.customer_name,
    email: order.customer_email,
    phone: order.shipping_address.phone,
    company: order.shipping_address.company ?? order.billing_address.company,
    value: order.total_cents / 100,
    productDetails: (items as Array<{ name: string; sku: string | null; quantity: number }>).map((i) => `${i.quantity} × ${i.name}${i.sku ? ` [${i.sku}]` : ""}`).join("\n"),
    notes: `Website order number: ${order.order_number}\nShipping: ${JSON.stringify(order.shipping_address)}`,
  };
  // A late checkout event must never overwrite a verified paid event. Repeated
  // Stripe notifications with the same paid state do not enqueue more work.
  await sql`INSERT INTO website_sales_requests (id, source_key, payload)
    VALUES (${randomUUID()}::uuid, ${`order:${orderId}`}, ${JSON.stringify(payload)}::jsonb)
    ON CONFLICT (source_key) DO UPDATE SET
      payload = EXCLUDED.payload, version = website_sales_requests.version + 1,
      next_attempt_at = now(), updated_at = now()
    WHERE EXCLUDED.payload->>'paid' = 'true' AND website_sales_requests.payload->>'paid' != 'true'`;
}

export async function drainWebsiteSales(limit = 3) {
  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!directSalesEnabled() || !token || !locationId) throw new Error("Direct GHL sales connection is not configured");
  await ensureSalesSchema();
  const sql = getDb();
  // Recover orders saved before an invocation ended or before CRM capture
  // succeeded. Orders are already durable; their delivery can be recreated.
  const syncFrom = process.env.GHL_SYNC_FROM_AT;
  if (syncFrom && Number.isFinite(Date.parse(syncFrom))) {
    const unqueued = await sql`SELECT o.id FROM orders o
      LEFT JOIN website_sales_requests s ON s.source_key = 'order:' || o.id::text
      WHERE o.created_at >= ${syncFrom}::timestamptz AND o.status IN ('pending_payment', 'paid')
        AND (o.stripe_payment_intent_id IS NOT NULL OR o.stripe_checkout_session_id IS NOT NULL)
        AND (s.id IS NULL OR (o.status = 'paid' AND s.payload->>'paid' != 'true'))
      ORDER BY o.created_at LIMIT 3`;
    for (const order of unqueued as Array<{ id: string }>) await captureWebsiteOrder(order.id);
  }
  let emailResult = { emailAccepted: 0, emailFailed: 0 };
  try { emailResult = await drainSalesNotifications(); }
  catch { console.error("[email] Sales email delivery is pending"); }
  const lease = randomUUID();
  const rows = await sql`UPDATE website_sales_requests SET
    lease_token = ${lease}::uuid, locked_until = now() + interval '5 minutes', attempts = attempts + 1
    WHERE id IN (SELECT id FROM website_sales_requests
      WHERE delivered_version < version AND next_attempt_at <= now()
        AND (locked_until IS NULL OR locked_until < now())
      ORDER BY created_at LIMIT ${Math.min(3, Math.max(1, limit))} FOR UPDATE SKIP LOCKED)
    RETURNING id, payload, version, attempts`;
  const client = new GhlSalesClient({ token, locationId, pipelineName: process.env.GHL_PIPELINE_NAME ?? "Website Sales", version: process.env.GHL_API_VERSION ?? "v3" });
  let delivered = 0;
  let failed = 0;
  for (const row of rows as Array<{ id: string; payload: SalesPayload; version: number; attempts: number }>) {
    try {
      const result = await client.sync(row.payload);
      await sql`UPDATE website_sales_requests SET delivered_version = ${row.version},
        ghl_contact_id = ${result.contactId}, ghl_opportunity_id = ${result.opportunityId},
        lease_token = NULL, locked_until = NULL, last_error = NULL, updated_at = now()
        WHERE id = ${row.id}::uuid AND lease_token = ${lease}::uuid`;
      delivered++;
    } catch {
      // Store only a generic failure label. Customer data/token-bearing provider
      // bodies must never leak into logs or monitoring responses.
      await sql`UPDATE website_sales_requests SET lease_token = NULL, locked_until = NULL,
        last_error = 'GHL delivery failed', next_attempt_at = now() + ${Math.min(3600, 60 * 2 ** Math.min(row.attempts, 6))} * interval '1 second'
        WHERE id = ${row.id}::uuid AND lease_token = ${lease}::uuid`;
      failed++;
    }
  }
  let estimatesCreated = 0;
  try { estimatesCreated = await drainDraftEstimates(); }
  catch { console.error("[ghl] Draft estimate delivery is pending"); }
  return { delivered, failed, ...emailResult, estimatesCreated };
}
