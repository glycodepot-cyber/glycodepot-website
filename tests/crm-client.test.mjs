import test from "node:test";
import assert from "node:assert/strict";
import { GhlSalesClient } from "../lib/crm/client.ts";
import { syncAuthorized } from "../lib/crm/auth.ts";

const quote = { reference: "request-1", kind: "quote", paid: false, name: "CRM test", email: "crm@example.invalid", productDetails: "2 × Test product [SKU-1]" };
const config = { token: "test-token", locationId: "test-location", pipelineName: "Website Sales" };
const pipeline = { id: "pipeline", name: "Website Sales", stages: [
  { id: "new", name: "New Quote Request" }, { id: "pending", name: "Awaiting Payment" }, { id: "paid", name: "Paid & Won" },
] };

function fixture({ existing = [], notes = [], fail = null, pipelines = [pipeline], contactSource = null } = {}) {
  const calls = [];
  const transport = async (url, init) => {
    const path = new URL(url).pathname;
    const body = init.body ? JSON.parse(init.body) : undefined;
    calls.push({ url, path, method: init.method, headers: init.headers, body });
    if (path === fail) return new Response("private provider details test-token", { status: 503 });
    let result;
    if (path === "/opportunities/pipelines") result = { pipelines };
    else if (path === "/contacts/upsert") result = { contact: { id: "contact" } };
    else if (path === "/contacts/contact" && init.method === "GET") result = { contact: { id: "contact", source: contactSource } };
    else if (path === "/contacts/contact" && init.method === "PUT") {
      contactSource = body.source; result = { contact: { id: "contact", source: contactSource } };
    }
    else if (path === "/opportunities/search") result = { opportunities: existing };
    else if (path === "/opportunities/" && init.method === "POST") {
      const opportunity = { id: "opp", name: body.name, status: body.status };
      existing.push(opportunity);
      result = { opportunity };
    } else if (path === "/opportunities/opp" && init.method === "PUT") {
      existing[0].status = body.status;
      result = { opportunity: existing[0] };
    } else if (path === "/contacts/contact/notes" && init.method === "GET") result = { notes };
    else if (path === "/contacts/contact/notes" && init.method === "POST") {
      notes.push({ body: body.body }); result = { note: { id: "note" } };
    } else throw new Error(`Unexpected request ${path}`);
    return Response.json(result);
  };
  return { client: new GhlSalesClient(config, transport), calls, existing, notes };
}

test("sync fails closed for missing secret or incorrect authorization", () => {
  for (const secret of [undefined, "", " "]) assert.equal(syncAuthorized("Bearer undefined", secret), false);
  for (const header of [null, "", "secret", "Bearer wrong", "bearer secret"]) assert.equal(syncAuthorized(header, "secret"), false);
  assert.equal(syncAuthorized("Bearer secret", "secret"), true);
});

test("missing credential prevents any provider request", () => {
  assert.throws(() => new GhlSalesClient({ ...config, token: "" }), /incomplete/);
});

test("quote creates contact, open opportunity, and product note without replacing tags or consent", async () => {
  const f = fixture(); await f.client.sync(quote);
  const contact = f.calls.find((c) => c.path === "/contacts/upsert");
  assert.equal(contact.body.email, quote.email);
  assert.equal("tags" in contact.body, false); assert.equal("dnd" in contact.body, false);
  const create = f.calls.find((c) => c.path === "/opportunities/");
  assert.equal(create.body.pipelineStageId, "new"); assert.equal(create.body.status, "open");
  assert.match(f.notes[0].body, /2 × Test product \[SKU-1\]/);
  assert.match(f.notes[0].body, /Catalog: https:\/\/glycodepot.com\/products/);
  assert.ok(f.calls.every((c) => c.headers.Authorization === "Bearer test-token" && c.headers.Version === "v3"));
});

test("retry reuses the exact opportunity and note instead of creating duplicates", async () => {
  const f = fixture(); await f.client.sync(quote); await f.client.sync(quote);
  assert.equal(f.calls.filter((c) => c.path === "/opportunities/" && c.method === "POST").length, 1);
  assert.equal(f.notes.length, 1);
});

test("website RFQs fill a blank source once and attribute the opportunity", async () => {
  const f = fixture({ contactSource: " " });
  await f.client.sync(quote); await f.client.sync(quote);
  const updates = f.calls.filter(c => c.path === "/contacts/contact" && c.method === "PUT");
  assert.deepEqual(updates.map(c => c.body), [{ source: "glycodepot.com — Request a Quote" }]);
  assert.equal(f.calls.find(c => c.path === "/opportunities/").body.source, "glycodepot.com — Request a Quote");
});

test("website intake preserves an existing source and distinguishes orders", async () => {
  const existing = fixture({ contactSource: "Conference referral" }); await existing.client.sync(quote);
  assert.equal(existing.calls.some(c => c.path === "/contacts/contact" && c.method === "PUT"), false);
  const order = fixture(); await order.client.sync({ ...quote, kind: "order" });
  assert.deepEqual(order.calls.find(c => c.path === "/contacts/contact" && c.method === "PUT").body, { source: "glycodepot.com — Order" });
});

test("separate requests from the same customer create separate opportunities", async () => {
  const f = fixture(); await f.client.sync(quote); await f.client.sync({ ...quote, reference: "request-2" });
  assert.equal(f.existing.length, 2);
});

test("verified paid order updates its existing opportunity once; late pending event cannot downgrade it", async () => {
  const f = fixture(); const order = { ...quote, kind: "order", value: 125 };
  await f.client.sync(order); await f.client.sync({ ...order, paid: true });
  await f.client.sync({ ...order, paid: true }); await f.client.sync(order);
  assert.equal(f.existing.length, 1); assert.equal(f.existing[0].status, "won");
  const updates = f.calls.filter((c) => c.path === "/opportunities/opp" && c.method === "PUT");
  assert.equal(updates.length, 1); assert.equal(updates[0].body.pipelineStageId, "paid");
  assert.equal(updates[0].body.monetaryValue, 125);
});

test("a paid event arriving first creates a won opportunity", async () => {
  const f = fixture(); await f.client.sync({ ...quote, kind: "order", paid: true, value: 200 });
  const create = f.calls.find((c) => c.path === "/opportunities/");
  assert.equal(create.body.status, "won"); assert.equal(create.body.pipelineStageId, "paid");
});

test("missing pipeline stops before modifying contacts", async () => {
  const f = fixture({ pipelines: [] }); await assert.rejects(f.client.sync(quote), /pipeline is missing/);
  assert.equal(f.calls.length, 1);
});

test("missing required stage stops before modifying contacts", async () => {
  const f = fixture({ pipelines: [{ ...pipeline, stages: [] }] });
  await assert.rejects(f.client.sync(quote), /stage is missing/);
  assert.equal(f.calls.length, 1);
});

test("legacy API version uses the documented legacy search parameter names", async () => {
  const calls = [];
  const transport = async (url, init) => {
    calls.push({ url, init });
    const path = new URL(url).pathname;
    if (path === "/opportunities/pipelines") return Response.json({ pipelines: [pipeline] });
    if (path === "/contacts/upsert") return Response.json({ contact: { id: "contact" } });
    if (path === "/contacts/contact") return Response.json({ contact: { id: "contact", source: "Existing source" } });
    if (path === "/opportunities/search") return Response.json({ opportunities: [{ id: "opp", name: "Website RFQ request-1", status: "open" }] });
    return Response.json({ notes: [{ body: "[Website request-1]" }] });
  };
  await new GhlSalesClient({ ...config, version: "2021-07-28" }, transport).sync(quote);
  const search = new URL(calls.find((c) => new URL(c.url).pathname === "/opportunities/search").url);
  assert.equal(search.searchParams.get("location_id"), config.locationId);
  assert.equal(search.searchParams.get("pipeline_id"), pipeline.id);
  assert.equal(search.searchParams.has("locationId"), false);
});

test("provider failures do not disclose tokens or provider response contents", async () => {
  const f = fixture({ fail: "/contacts/upsert" });
  await assert.rejects(f.client.sync(quote), (error) => error.message === "GHL HTTP 503");
  assert.equal(f.calls.some((c) => c.path === "/opportunities/"), false);
});
