import type { Money } from "./cart/types";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function formatMoney(value: Money | null | undefined): string {
  if (!value) return "Request a quote";
  return usd.format(value.amount);
}

/** Format a raw USD amount (number) — for computed subtotals/totals. */
export function formatUSD(amount: number): string {
  return usd.format(amount);
}
