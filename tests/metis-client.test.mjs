import test from "node:test";
import assert from "node:assert/strict";
import { MetisSalesClient } from "../lib/crm/metis.ts";

const config = { apiKey: "sk_test", pipelineId: "pipe", stageNewId: "new", stagePendingId: "pending", stageWonId: "won", logoUrl: "https://example.invalid/logo.jpg" };
const address = { name: "Ada Buyer", company: "Lab U", address1: "1 Main St", city: "Montreal", state: "QC", postal: "H1H 1H1", country: "CA" };
const paidOrder = {
  reference: "order-1", kind: "order", paid: true, name: "Ada Buyer", email: "Ada@Example.invalid", company: "Lab U",
  productDetails: "1 × Thing [SKU-1]", value: 610,
  orderDetails: { orderNumber: "10008", currency: "usd", items: [{ name: "Thing", sku: "SKU-1", quantity: 1, unitPriceCents: 52000 }],
    shippingCents: 9000, taxCents: 0, totalCents: 61000, billing: address, shipping: address, paymentReference: "pi_123", paidAt: "2026-11-13T14:00:00.000Z" },
};

function fixture({ existing = null, failOn = null } = {}) {
  const calls = [];
  const transport = async (url, init) => {
    const u = new URL(url);
    const body = init.body ? JSON.parse(init.body) : undefined;
    calls.push({ path: u.pathname, search: u.search, method: init.method, headers: init.headers, body });
    if (failOn && u.pathname.endsWith(failOn)) return new Response("secret provider body sk_test", { status: 500 });
    if (u.pathname === "/api/leads" && init.method === "GET") return Response.json({ data: existing ? [existing] : [] });
    if (u.pathname === "/api/leads" && init.method === "POST") return Response.json({ success: true, data: { id: "lead-new" } });
    if (u.pathname.startsWith("/api/leads/") && init.method === "GET") return Response.json(existing);
    if (u.pathname.startsWith("/api/leads/") && init.method === "PUT") return Response.json({ success: true });
    if (u.pathname === "/api/billing/invoices" && init.method === "POST") return Response.json({ id: "inv-1", invoice_number: "INV-1" }, { status: 201 });
    if (u.pathname === "/api/billing/invoices/inv-1/record-payment") return Response.json({ success: true });
    throw new Error(`Unexpected ${init.method} ${u.pathname}`);
  };
  return { client: new MetisSalesClient(config, transport), calls };
}

test("paid order creates contact in Won, an invoice with line items, and records the payment", async () => {
  const { client, calls } = fixture();
  const result = await client.sync(paidOrder);
  assert.deepEqual(result, { leadId: "lead-new", invoiceId: "inv-1", paymentRecorded: true });
  assert.equal(calls[0].headers["X-API-Key"], "sk_test");
  assert.match(calls[0].search, /email=ada%40example\.invalid/);
  const lead = calls.find((c) => c.path === "/api/leads" && c.method === "POST").body;
  assert.equal(lead.column_id, "won");
  assert.equal(lead.lifecycle_stage, "customer");
  const invoice = calls.find((c) => c.path === "/api/billing/invoices").body;
  assert.equal(invoice.customer_id, "lead-new");
  assert.equal(invoice.status, "open");
  assert.deepEqual(invoice.line_items.map((l) => [l.description, l.quantity, l.unit_amount]),
    [["Thing [SKU-1]", 1, 52000], ["Shipping & handling", 1, 9000]]);
  const payment = calls.find((c) => c.path.endsWith("/record-payment")).body;
  assert.equal(payment.amount_paid, 61000);
  assert.match(payment.notes, /pi_123/);
});

test("unpaid order only files the contact at the pending stage, no invoice", async () => {
  const { client, calls } = fixture();
  const result = await client.sync({ ...paidOrder, paid: false });
  assert.equal(result.invoiceId, null);
  assert.equal(calls.find((c) => c.method === "POST" && c.path === "/api/leads").body.column_id, "pending");
  assert.ok(!calls.some((c) => c.path.startsWith("/api/billing")));
});

test("existing contact is advanced, never moved backwards", async () => {
  const won = fixture({ existing: { id: "lead-old", pipeline_id: "pipe", column_id: "won" } });
  await won.client.sync({ ...paidOrder, kind: "quote", paid: false, orderDetails: undefined });
  const put = won.calls.find((c) => c.method === "PUT");
  assert.ok(!put || put.body.column_id === undefined);

  const fresh = fixture({ existing: { id: "lead-old", pipeline_id: "pipe", column_id: "new" } });
  const result = await fresh.client.sync(paidOrder);
  assert.equal(result.leadId, "lead-old");
  assert.equal(fresh.calls.find((c) => c.method === "PUT").body.column_id, "won");
});

test("retry after a failed payment record reuses the invoice instead of creating another", async () => {
  const first = fixture({ failOn: "/record-payment" });
  const error = await first.client.sync(paidOrder).catch((e) => e);
  assert.deepEqual(error.partial, { leadId: "lead-new", invoiceId: "inv-1", paymentRecorded: false });
  assert.ok(!String(error.message).includes("sk_test"));

  const retry = fixture({ existing: { id: "lead-new", pipeline_id: "pipe", column_id: "won" } });
  await retry.client.sync(paidOrder, error.partial);
  assert.ok(!retry.calls.some((c) => c.path === "/api/billing/invoices"));
  assert.ok(retry.calls.some((c) => c.path.endsWith("/record-payment")));
});

test("a fully synced paid order makes no billing calls on redelivery", async () => {
  const { client, calls } = fixture({ existing: { id: "lead-new", pipeline_id: "pipe", column_id: "won" } });
  await client.sync(paidOrder, { leadId: "lead-new", invoiceId: "inv-1", paymentRecorded: true });
  assert.ok(!calls.some((c) => c.path.startsWith("/api/billing")));
});
