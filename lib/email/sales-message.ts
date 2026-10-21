import type { SalesPayload } from "../crm/client";

export function salesMessage(payload: SalesPayload, payment: boolean) {
  const label = payment ? "Payment received" : payload.kind === "quote" ? "New quote request" : "New order";
  return {
    subject: `GlycoDepot — ${label} — ${payload.reference}`,
    replyTo: payload.email,
    text: `${label}\n\nReference: ${payload.reference}\nCustomer: ${payload.name}\nEmail: ${payload.email}\nCompany: ${payload.company ?? "—"}\nPhone: ${payload.phone || "—"}\n` +
      (payload.value === undefined ? "" : `Order total: USD ${payload.value.toFixed(2)}\n`) +
      `\nProducts:\n${payload.productDetails}\n\n${payload.notes ?? ""}\n\nView in GlycoDepot admin: https://www.glycodepot.com/admin/${payload.kind === "quote" ? "quotes" : "orders"}/${encodeURIComponent(payload.reference)}\nCatalog: https://www.glycodepot.com/products\nOpen GHL to review the matching Website Sales opportunity.`,
  };
}
