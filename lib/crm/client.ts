export type SalesPayload = {
  reference: string;
  kind: "quote" | "order";
  paid: boolean;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  productDetails: string;
  notes?: string;
  value?: number;
};

type Pipeline = { id: string; name: string; stages: Array<{ id: string; name: string }> };
type Opportunity = { id: string; name: string; status: string };

// This module is imported only by the server-only sales service. It has no
// environment reads so it can be tested with an injected transport.
export class GhlSalesClient {
  constructor(
    private readonly config: { token: string; locationId: string; pipelineName: string; version?: string },
    private readonly transport: typeof fetch = fetch,
  ) {
    if (!config.token || !config.locationId || !config.pipelineName) {
      throw new Error("GHL configuration is incomplete");
    }
  }

  private async request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
    const response = await this.transport(`https://services.leadconnectorhq.com${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        Version: this.config.version ?? "v3",
        "Content-Type": "application/json",
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
    // Provider response bodies can contain tokens or customer data. Never log
    // or return them to the browser, even when an API call fails.
    if (!response.ok) throw new Error(`GHL HTTP ${response.status}`);
    return response.json() as Promise<T>;
  }

  async sync(payload: SalesPayload): Promise<{ contactId: string; opportunityId: string }> {
    const query = new URLSearchParams({ locationId: this.config.locationId });
    const { pipelines } = await this.request<{ pipelines: Pipeline[] }>(`/opportunities/pipelines?${query}`);
    const pipeline = pipelines.find((p) => p.name === this.config.pipelineName);
    if (!pipeline) throw new Error("GHL website sales pipeline is missing");
    const stageName = payload.paid ? "Paid & Won" : payload.kind === "quote" ? "New Quote Request" : "Awaiting Payment";
    const stage = pipeline.stages.find((s) => s.name === stageName);
    if (!stage) throw new Error("GHL website sales stage is missing");

    const { contact } = await this.request<{ contact: { id: string } }>("/contacts/upsert", "POST", {
      locationId: this.config.locationId,
      name: payload.name,
      email: payload.email,
      ...(payload.phone ? { phone: payload.phone } : {}),
      ...(payload.company ? { companyName: payload.company } : {}),
      // Do not send tags here: upsert replaces existing tags.
    });
    if (!contact?.id) throw new Error("GHL did not return a contact ID");

    const name = `Website ${payload.kind === "quote" ? "RFQ" : "Order"} ${payload.reference}`;
    const legacy = this.config.version !== undefined && this.config.version !== "v3";
    const search = new URLSearchParams({
      [legacy ? "location_id" : "locationId"]: this.config.locationId,
      [legacy ? "pipeline_id" : "pipelineId"]: pipeline.id,
      [legacy ? "contact_id" : "contactId"]: contact.id,
      q: name,
      limit: "100",
    });
    const found = await this.request<{ opportunities: Opportunity[] }>(`/opportunities/search?${search}`);
    let opportunity = found.opportunities.find((o) => o.name === name);
    if (!opportunity) {
      const created = await this.request<{ opportunity: Opportunity }>("/opportunities/", "POST", {
        locationId: this.config.locationId,
        pipelineId: pipeline.id,
        pipelineStageId: stage.id,
        contactId: contact.id,
        name,
        status: payload.paid ? "won" : "open",
        ...(payload.value === undefined ? {} : { monetaryValue: payload.value }),
      });
      opportunity = created.opportunity;
    } else if (payload.paid && opportunity.status !== "won") {
      await this.request(`/opportunities/${encodeURIComponent(opportunity.id)}`, "PUT", {
        pipelineStageId: stage.id,
        status: "won",
        ...(payload.value === undefined ? {} : { monetaryValue: payload.value }),
      });
    }
    // A retried "new" event must not reset a sales rep's manually advanced
    // opportunity, or downgrade an already-paid order.
    if (!opportunity?.id) throw new Error("GHL did not return an opportunity ID");

    const marker = `[Website ${payload.reference}]`;
    const existingNotes = await this.request<{ notes: Array<{ body: string }> }>(`/contacts/${encodeURIComponent(contact.id)}/notes`);
    if (!existingNotes.notes.some((n) => n.body.includes(marker))) {
      await this.request(`/contacts/${encodeURIComponent(contact.id)}/notes`, "POST", {
        body: `${marker}\n${payload.kind === "quote" ? "Quote request" : "Order"}\nCompany: ${payload.company ?? "—"}\nProducts:\n${payload.productDetails}\n${payload.notes ?? ""}\nCatalog: https://glycodepot.com/products`,
      });
    }
    return { contactId: contact.id, opportunityId: opportunity.id };
  }
}
