import { isQuotePriceCents } from "@/lib/cart/price-policy";
import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { getDb } from "@/lib/db";
import type { QuoteRequest, QuoteResponse } from "@/lib/cart/types";
import type { PreparedQuoteFile } from "@/lib/quote/files";
import { serviceQuoteItem } from "./service-quote";
import { GhlSalesClient, type SalesPayload } from "./client";
import { MetisSalesClient, type MetisSyncResult } from "./metis";
import { drainSalesNotifications } from "@/lib/email/sales-outbox";
import { drainDraftEstimates } from "@/lib/crm/estimates";

export function directSalesEnabled(): boolean {
  return process.env.GHL_DIRECT_ENABLED === "true";
}

/** Website orders and RFQs go to the MetisSuite GlycoDepot account once its API key is set. */
export function metisSalesEnabled(): boolean {
  return Boolean(process.env.METIS_API_KEY?.trim());
}

/** True when any CRM delivery (MetisSuite or the legacy GoHighLevel path) is configured. */
export function salesSyncEnabled(): boolean {
  return metisSalesEnabled() || directSalesEnabled();
}

// Defaults: the GlycoDepot MetisSuite "Sales" pipeline and its stages.
function metisClient(): MetisSalesClient {
  return new MetisSalesClient({
    apiKey: process.env.METIS_API_KEY!.trim(),
    baseUrl: process.env.METIS_API_BASE_URL || undefined,
    pipelineId: process.env.METIS_PIPELINE_ID || "a6a370cd-b5a7-4368-95a4-f8d6ab0022b7",
    stageNewId: process.env.METIS_STAGE_NEW_ID || "d77cfe8d-ee4b-4c23-a416-e5dda52165d9",
    stagePendingId: process.env.METIS_STAGE_PENDING_ID || "7b55ada5-99aa-45ad-a64c-abe21219d7fa",
    stageWonId: process.env.METIS_STAGE_WON_ID || "fd9c2e2b-c018-4da1-ad44-5174ce42676a",
    logoUrl: process.env.METIS_INVOICE_LOGO_URL || "https://www.glycodepot.com/Glycodepot_Logo.jpeg",
    accentColor: "#006837",
  });
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
    )`.then(async () => {
      await sql`CREATE TABLE IF NOT EXISTS website_quote_files (
        id uuid PRIMARY KEY,
        request_id uuid NOT NULL REFERENCES website_sales_requests(id),
        position integer NOT NULL,
        filename text NOT NULL,
        size_bytes integer NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 3145728),
        data_base64 text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE (request_id, position)
      )`;
      await sql`ALTER TABLE website_sales_requests
        ADD COLUMN IF NOT EXISTS metis_delivered_version integer NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS metis_lead_id text,
        ADD COLUMN IF NOT EXISTS metis_invoice_id text,
        ADD COLUMN IF NOT EXISTS metis_payment_recorded boolean NOT NULL DEFAULT false`;
    }).catch((error: unknown) => {
      schemaReady = undefined;
      throw error;
    });
  }
  return schemaReady;
}

export async function captureWebsiteQuote(request: QuoteRequest, files: PreparedQuoteFile[] = []): Promise<QuoteResponse> {
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
    items.push({productId:line.productId,variantId:line.variantId,name:product.name,sku:product.sku??undefined,quantity:line.quantity,unitPriceCents:isQuotePriceCents(product.price_cents)?null:product.price_cents,url,requiresDryIce:(product.tags??[]).some(tag=>/dry.?ice/i.test(tag))});
  }
  const customer = request.customer;
  const shipping = {name:customer.name,company:customer.company,address1:customer.address1,city:customer.city,state:customer.state,postal:customer.postal,country:customer.country,phone:customer.phone};
  const billing = customer.billingAddress ? {name:`${customer.billingAddress.firstName} ${customer.billingAddress.lastName}`.trim(),company:customer.billingAddress.company,address1:customer.billingAddress.address1,city:customer.billingAddress.city,state:customer.billingAddress.state,postal:customer.billingAddress.postal,country:customer.billingAddress.country,phone:customer.phone} : {...shipping};
  const key = createHash("sha256").update(JSON.stringify({
    customer: { ...customer, email: customer.email.trim().toLowerCase() },
    service: request.service,
    files: files.map(file => ({name:file.filename,digest:file.digest})),
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
    notes: [customer.notes,
      ...files.map(file => `Uploaded file: ${file.filename} (${file.size} bytes) — https://www.glycodepot.com/admin/quote-files/${file.id}`),
      files.length ? "Uploaded files require a GlycoDepot website admin login to download." : undefined,
      `Billing: ${[billing.name,billing.company,billing.address1,billing.city,billing.state,billing.postal,billing.country].filter(Boolean).join(", ")}`, `Shipping: ${[customer.address1, customer.city, customer.state, customer.postal, customer.country].filter(Boolean).join(", ")}`,
      `Source: ${request.meta?.leadSource ?? "Website submission"}`,
      request.meta?.googleAdsCampaign ? `Google Ads campaign: ${request.meta.googleAdsCampaign}` : undefined,
      request.meta?.googleAdsAdGroup ? `Google Ads ad group: ${request.meta.googleAdsAdGroup}` : undefined,
      request.meta?.gclid ? `Google Ads click ID: ${request.meta.gclid}` : undefined,
      request.meta?.landingPageUrl ? `Landing page: ${request.meta.landingPageUrl}` : undefined].filter(Boolean).join("\n"),
  };
  // Persist the request and its files atomically before confirming receipt.
  const rows = await sql`WITH stored AS (
    INSERT INTO website_sales_requests (id, source_key, payload)
    VALUES (${id}::uuid, ${`quote:${key}`}, ${JSON.stringify(payload)}::jsonb)
    ON CONFLICT (source_key) DO UPDATE SET source_key = EXCLUDED.source_key
    RETURNING id, created_at
  ), saved_files AS (
    INSERT INTO website_quote_files (id, request_id, position, filename, size_bytes, data_base64)
    SELECT f.id::uuid, s.id, f.position, f.filename, f.size, f.data
    FROM stored s CROSS JOIN jsonb_to_recordset(${JSON.stringify(files)}::jsonb)
      AS f(id text, position integer, filename text, size integer, data text)
    ON CONFLICT (request_id, position) DO NOTHING
  ) SELECT id, created_at FROM stored`;
  const stored = (rows as Array<{ id: string; created_at: string }>)[0];
  return { id: stored.id, receivedAt: new Date(stored.created_at).toISOString() };
}

type AnyAddress = Record<string, unknown>;
function str(a: AnyAddress | null | undefined, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = a?.[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}
function normalizeAddress(a: AnyAddress | null | undefined, fallbackName: string) {
  const name = str(a, "name") ?? ([str(a, "firstName", "first_name"), str(a, "lastName", "last_name")].filter(Boolean).join(" ") || fallbackName);
  return {
    name,
    company: str(a, "company"),
    address1: str(a, "address1", "line1") ?? "",
    address2: str(a, "address2", "line2"),
    city: str(a, "city") ?? "",
    state: str(a, "state") ?? "",
    postal: str(a, "postal", "postalCode", "postal_code") ?? "",
    country: str(a, "country") ?? "",
    phone: str(a, "phone"),
  };
}

export async function captureWebsiteOrder(orderId: string, paid = false): Promise<void> {
  if (!directSalesEnabled() && !metisSalesEnabled()) return;
  await ensureSalesSchema();
  const sql = getDb();
  const orders = await sql`SELECT id, order_number, customer_name, customer_email, subtotal_cents, shipping_cents, tax_cents,
    total_cents, currency, shipping_address, billing_address, status, stripe_payment_intent_id, updated_at
    FROM orders WHERE id = ${orderId}::uuid`;
  type OrderRow = { id: string; order_number: string; customer_name: string; customer_email: string;
    subtotal_cents: number; shipping_cents: number | null; tax_cents: number | null; total_cents: number; currency: string | null;
    shipping_address: AnyAddress | null; billing_address: AnyAddress | null; status: string;
    stripe_payment_intent_id: string | null; updated_at: string };
  const order = (orders as OrderRow[])[0];
  if (!order) throw new Error("Website order was not found");
  const items = await sql`SELECT name, sku, quantity, unit_price_cents FROM order_items WHERE order_id = ${orderId}::uuid ORDER BY id`;
  const lines = items as Array<{ name: string; sku: string | null; quantity: number; unit_price_cents: number }>;
  const shipping = normalizeAddress(order.shipping_address, order.customer_name);
  const billing = order.billing_address ? normalizeAddress(order.billing_address, order.customer_name) : { ...shipping };
  const isPaid = paid || order.status === "paid";
  const payload: SalesPayload = {
    reference: order.id,
    kind: "order",
    paid: isPaid,
    name: order.customer_name,
    email: order.customer_email,
    phone: shipping.phone ?? billing.phone,
    company: shipping.company ?? billing.company,
    value: order.total_cents / 100,
    productDetails: lines.map((i) => `${i.quantity} × ${i.name}${i.sku ? ` [${i.sku}]` : ""}`).join("\n"),
    notes: `Website order number: ${order.order_number}\nShipping: ${[shipping.name, shipping.company, shipping.address1, shipping.address2, shipping.city, shipping.state, shipping.postal, shipping.country].filter(Boolean).join(", ")}`,
    orderDetails: {
      orderNumber: String(order.order_number),
      currency: order.currency ?? "usd",
      items: lines.map((i) => ({ name: i.name, sku: i.sku ?? undefined, quantity: i.quantity, unitPriceCents: i.unit_price_cents })),
      shippingCents: order.shipping_cents ?? 0,
      taxCents: order.tax_cents ?? 0,
      totalCents: order.total_cents,
      billing,
      shipping,
      paymentReference: order.stripe_payment_intent_id ?? undefined,
      paidAt: isPaid ? new Date(order.updated_at).toISOString() : undefined,
    },
  };
  // A late checkout event must never overwrite a verified paid event. Repeated
  // Stripe notifications with the same paid state do not enqueue more work.
  await sql`INSERT INTO website_sales_requests (id, source_key, payload)
    VALUES (${randomUUID()}::uuid, ${`order:${orderId}`}, ${JSON.stringify(payload)}::jsonb)
    ON CONFLICT (source_key) DO UPDATE SET
      payload = EXCLUDED.payload, version = website_sales_requests.version + 1,
      next_attempt_at = now(), updated_at = now()
    WHERE (EXCLUDED.payload->>'paid' = 'true' AND website_sales_requests.payload->>'paid' != 'true')
      OR website_sales_requests.payload->'orderDetails' IS NULL`;
}

async function requeueRecentOrders(syncFrom: string | undefined) {
  if (!syncFrom || !Number.isFinite(Date.parse(syncFrom))) return;
  const sql = getDb();
  // Recover orders saved before an invocation ended or before CRM capture
  // succeeded. Orders are already durable; their delivery can be recreated.
  const unqueued = await sql`SELECT o.id FROM orders o
    LEFT JOIN website_sales_requests s ON s.source_key = 'order:' || o.id::text
    WHERE o.created_at >= ${syncFrom}::timestamptz AND o.status IN ('pending_payment', 'paid')
      AND (o.stripe_payment_intent_id IS NOT NULL OR o.stripe_checkout_session_id IS NOT NULL)
      AND (s.id IS NULL OR (o.status = 'paid' AND s.payload->>'paid' != 'true') OR s.payload->'orderDetails' IS NULL)
    ORDER BY o.created_at LIMIT 3`;
  for (const order of unqueued as Array<{ id: string }>) await captureWebsiteOrder(order.id);
}

export async function drainWebsiteSales(limit = 3) {
  if (metisSalesEnabled()) return drainToMetis(limit);
  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!directSalesEnabled() || !token || !locationId) throw new Error("Direct GHL sales connection is not configured");
  await ensureSalesSchema();
  const sql = getDb();
  await requeueRecentOrders(process.env.GHL_SYNC_FROM_AT);
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

/**
 * MetisSuite delivery: every RFQ and order becomes (or updates) a contact in the
 * Sales pipeline; every paid order also gets an invoice in MetisSuite Payments
 * with the card payment recorded on it. Rows older than METIS_SYNC_FROM_AT are
 * never pushed, so historical test orders stay out of the CRM.
 */
async function drainToMetis(limit: number) {
  await ensureSalesSchema();
  const sql = getDb();
  const syncFrom = process.env.METIS_SYNC_FROM_AT;
  const fromValid = Boolean(syncFrom && Number.isFinite(Date.parse(syncFrom)));
  await requeueRecentOrders(fromValid ? syncFrom : process.env.GHL_SYNC_FROM_AT);
  let emailResult = { emailAccepted: 0, emailFailed: 0 };
  try { emailResult = await drainSalesNotifications(); }
  catch { console.error("[email] Sales email delivery is pending"); }
  const from = fromValid ? syncFrom! : new Date().toISOString();
  const lease = randomUUID();
  const rows = await sql`UPDATE website_sales_requests SET
    lease_token = ${lease}::uuid, locked_until = now() + interval '5 minutes', attempts = attempts + 1
    WHERE id IN (SELECT id FROM website_sales_requests
      WHERE metis_delivered_version < version AND next_attempt_at <= now()
        AND created_at >= ${from}::timestamptz
        AND (locked_until IS NULL OR locked_until < now())
      ORDER BY created_at LIMIT ${Math.min(3, Math.max(1, limit))} FOR UPDATE SKIP LOCKED)
    RETURNING id, payload, version, attempts, metis_lead_id, metis_invoice_id, metis_payment_recorded`;
  const client = metisClient();
  let delivered = 0;
  let failed = 0;
  let invoicesCreated = 0;
  type Row = { id: string; payload: SalesPayload; version: number; attempts: number;
    metis_lead_id: string | null; metis_invoice_id: string | null; metis_payment_recorded: boolean };
  for (const row of rows as Row[]) {
    try {
      const result = await client.sync(row.payload, {
        leadId: row.metis_lead_id, invoiceId: row.metis_invoice_id, paymentRecorded: row.metis_payment_recorded,
      });
      if (result.invoiceId && !row.metis_invoice_id) invoicesCreated++;
      await sql`UPDATE website_sales_requests SET metis_delivered_version = ${row.version},
        metis_lead_id = ${result.leadId}, metis_invoice_id = ${result.invoiceId}, metis_payment_recorded = ${result.paymentRecorded},
        lease_token = NULL, locked_until = NULL, last_error = NULL, updated_at = now()
        WHERE id = ${row.id}::uuid AND lease_token = ${lease}::uuid`;
      delivered++;
    } catch (error) {
      const partial = (error as { partial?: MetisSyncResult }).partial;
      const label = error instanceof Error ? error.message.replace(/[^\w .:/{}-]/g, "").slice(0, 120) : "MetisSuite delivery failed";
      await sql`UPDATE website_sales_requests SET lease_token = NULL, locked_until = NULL,
        metis_lead_id = coalesce(${partial?.leadId ?? null}, metis_lead_id),
        metis_invoice_id = coalesce(${partial?.invoiceId ?? null}, metis_invoice_id),
        metis_payment_recorded = metis_payment_recorded OR ${partial?.paymentRecorded ?? false},
        last_error = ${label}, next_attempt_at = now() + ${Math.min(3600, 60 * 2 ** Math.min(row.attempts, 6))} * interval '1 second'
        WHERE id = ${row.id}::uuid AND lease_token = ${lease}::uuid`;
      console.error(`[metis] ${label}`);
      failed++;
    }
  }
  return { crm: "metissuite", delivered, failed, invoicesCreated, ...emailResult };
}
