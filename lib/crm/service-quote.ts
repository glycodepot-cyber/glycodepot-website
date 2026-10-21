import type { QuoteRequest } from "../cart/types";

/** Only this named service can bypass catalog lookup; it never supplies a price. */
export function serviceQuoteItem(request: QuoteRequest) {
  if (!request.service) return null;
  if (request.service !== "custom-glycan-synthesis") throw new Error("Unknown service.");
  if (!Array.isArray(request.lines) || request.lines.length !== 0) throw new Error("Service requests cannot include catalog items.");
  const customer = request.customer;
  if (typeof customer.notes !== "string" || customer.notes.trim().length < 20 || customer.notes.length > 10000) {
    throw new Error("Please describe the target structure, quantity, and project requirements.");
  }
  for (const field of ["company", "address1", "city", "state", "postal", "country"] as const) {
    if (typeof customer[field] !== "string" || !customer[field].trim()) throw new Error("Please complete your organization and shipping address.");
  }
  if (customer.billingAddress) {
    for (const field of ["firstName", "lastName", "company", "address1", "city", "state", "postal", "country"] as const) {
      if (!customer.billingAddress[field]?.trim()) throw new Error("Please complete your billing address.");
    }
  }
  return {
    productId: "custom-glycan-synthesis",
    name: "Custom glycan synthesis — manual price approval",
    quantity: 1,
    unitPriceCents: null,
    requiresDryIce: false,
    url: "https://www.glycodepot.com/services/custom-glycan-synthesis",
  };
}
