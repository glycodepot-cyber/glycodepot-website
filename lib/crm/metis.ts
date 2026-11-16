import type { SalesPayload } from "./client";

// MetisSuite (Votel) CRM + billing client for website sales.
// This module has no environment reads so it can be tested with an injected
// transport. Provider response bodies may contain customer data or keys and
// are never logged or returned.

export type MetisConfig = {
  apiKey: string;
  baseUrl?: string;
  pipelineId: string;
  stageNewId: string; // quote requests
  stagePendingId: string; // orders awaiting payment
  stageWonId: string; // paid orders
  logoUrl?: string;
  accentColor?: string;
};

export type MetisSyncState = {
  leadId?: string | null;
  invoiceId?: string | null;
  paymentRecorded?: boolean;
};

export type MetisSyncResult = { leadId: string; invoiceId: string | null; paymentRecorded: boolean };

type Lead = { id: string; column_id?: string | null; pipeline_id?: string | null };

function pickId(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const v = value as Record<string, unknown>;
  for (const key of ["id", "lead_id", "invoice_id"]) {
    if (typeof v[key] === "string" && v[key]) return v[key] as string;
  }
  for (const key of ["data", "lead", "invoice", "result"]) {
    const nested = pickId(v[key]);
    if (nested) return nested;
  }
  return undefined;
}

export class MetisSalesClient {
  private readonly baseUrl: string;

  constructor(private readonly config: MetisConfig, private readonly transport: typeof fetch = fetch) {
    if (!config.apiKey || !config.pipelineId || !config.stageNewId || !config.stagePendingId || !config.stageWonId) {
      throw new Error("MetisSuite configuration is incomplete");
    }
    this.baseUrl = (config.baseUrl ?? "https://app.metissuiteai.app").replace(/\/$/, "");
  }

  private async request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
    const response = await this.transport(`${this.baseUrl}${path}`, {
      method,
      headers: {
        "X-API-Key": this.config.apiKey,
        Accept: "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`MetisSuite HTTP ${response.status} on ${method} ${path.split("?")[0]}`);
    const text = await response.text();
    return (text ? JSON.parse(text) : {}) as T;
  }

  private stageFor(payload: SalesPayload): string {
    if (payload.kind === "quote") return this.config.stageNewId;
    return payload.paid ? this.config.stageWonId : this.config.stagePendingId;
  }

  /** Find the contact by exact email, or create it. Moves it forward in the pipeline, never backwards. */
  async upsertLead(payload: SalesPayload, knownLeadId?: string | null): Promise<string> {
    const stage = this.stageFor(payload);
    let lead: Lead | undefined;
    if (knownLeadId) lead = { id: knownLeadId };
    if (!lead) {
      const query = new URLSearchParams({ email: payload.email.trim().toLowerCase(), limit: "5" });
      const found = await this.request<{ data?: Lead[] }>(`/api/leads?${query}`);
      lead = found.data?.[0];
    }
    const source = payload.kind === "quote" ? "glycodepot.com — Request a Quote" : "glycodepot.com — Order";
    if (!lead) {
      const created = await this.request<unknown>("/api/leads", "POST", {
        name: payload.name,
        email: payload.email.trim().toLowerCase(),
        ...(payload.phone ? { phone: payload.phone } : {}),
        ...(payload.company ? { company: payload.company } : {}),
        lead_source: source,
        lifecycle_stage: payload.paid ? "customer" : payload.kind === "quote" ? "lead" : "opportunity",
        tags: [payload.kind === "quote" ? "website-rfq" : "website-order"],
        ...(payload.value === undefined ? {} : { value: payload.value }),
        pipeline_id: this.config.pipelineId,
        column_id: stage,
      });
      const id = pickId(created);
      if (!id) throw new Error("MetisSuite did not return a contact ID");
      return id;
    }
    // Existing contact: only advance the stage. A rep's manual move, or a
    // paid order, must never be downgraded by a later or retried event.
    const current = await this.request<Lead>(`/api/leads/${encodeURIComponent(lead.id)}`);
    const rank = (id?: string | null) =>
      id === this.config.stageWonId ? 3 : id === this.config.stagePendingId ? 2 : id === this.config.stageNewId ? 1 : 0;
    const inPipeline = current.pipeline_id === this.config.pipelineId;
    const update: Record<string, unknown> = {};
    if (!inPipeline || rank(stage) > rank(current.column_id)) {
      update.pipeline_id = this.config.pipelineId;
      update.column_id = stage;
    }
    if (payload.paid) update.lifecycle_stage = "customer";
    if (payload.value !== undefined && payload.kind === "order") update.value = payload.value;
    if (payload.company) update.company = payload.company;
    if (Object.keys(update).length) await this.request(`/api/leads/${encodeURIComponent(current.id ?? lead.id)}`, "PUT", update);
    return current.id ?? lead.id;
  }

  async createInvoice(leadId: string, payload: SalesPayload): Promise<string> {
    const order = payload.orderDetails;
    if (!order) throw new Error("Order details are missing");
    const line_items = order.items.map((item) => ({
      description: `${item.name}${item.sku ? ` [${item.sku}]` : ""}`,
      quantity: item.quantity,
      unit_amount: item.unitPriceCents,
      product_type: "one_time",
    }));
    if (order.shippingCents > 0) line_items.push({ description: "Shipping & handling", quantity: 1, unit_amount: order.shippingCents, product_type: "one_time" });
    if (order.taxCents > 0) line_items.push({ description: "Tax", quantity: 1, unit_amount: order.taxCents, product_type: "one_time" });
    const b = order.billing;
    const created = await this.request<unknown>("/api/billing/invoices", "POST", {
      customer_id: leadId,
      customer_name: payload.name,
      customer_email: payload.email,
      ...(payload.company ? { company_name: payload.company } : {}),
      billing_address: {
        name: b.name, company: b.company, line1: b.address1, line2: b.address2, city: b.city,
        state: b.state, postal_code: b.postal, country: b.country,
      },
      line_items,
      currency: order.currency.toUpperCase(),
      payment_terms: "due_on_receipt",
      notes: `Website order #${order.orderNumber}. ${payload.notes ?? ""}`.trim(),
      ...(this.config.logoUrl ? { logo_url: this.config.logoUrl } : {}),
      ...(this.config.accentColor ? { accent_color: this.config.accentColor } : {}),
      status: "open",
    });
    const id = pickId(created);
    if (!id) throw new Error("MetisSuite did not return an invoice ID");
    return id;
  }

  async recordPayment(invoiceId: string, payload: SalesPayload): Promise<void> {
    const order = payload.orderDetails;
    if (!order) throw new Error("Order details are missing");
    await this.request(`/api/billing/invoices/${encodeURIComponent(invoiceId)}/record-payment`, "POST", {
      payment_mode: "other",
      amount_paid: order.totalCents,
      notes: `Paid by card on glycodepot.com (Stripe${order.paymentReference ? ` ${order.paymentReference}` : ""}) — website order #${order.orderNumber}`,
      ...(order.paidAt ? { payment_date: order.paidAt } : {}),
    });
  }

  /**
   * Contact for every request; for paid orders also an invoice (the order
   * record in MetisSuite Payments) with the card payment recorded against it.
   * Idempotent across retries through the state stored by the caller.
   */
  async sync(payload: SalesPayload, state: MetisSyncState = {}): Promise<MetisSyncResult> {
    const leadId = await this.upsertLead(payload, state.leadId);
    let invoiceId = state.invoiceId ?? null;
    let paymentRecorded = Boolean(state.paymentRecorded);
    try {
      if (payload.kind === "order" && payload.paid && payload.orderDetails) {
        if (!invoiceId) invoiceId = await this.createInvoice(leadId, payload);
        if (!paymentRecorded) {
          await this.recordPayment(invoiceId, payload);
          paymentRecorded = true;
        }
      }
    } catch (error) {
      // Hand back what already exists so a retry never creates a second invoice.
      throw Object.assign(error instanceof Error ? error : new Error("MetisSuite sync failed"), {
        partial: { leadId, invoiceId, paymentRecorded } satisfies MetisSyncResult,
      });
    }
    return { leadId, invoiceId, paymentRecorded };
  }
}
