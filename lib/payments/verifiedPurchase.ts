export type PurchaseMeasurement = { orderId: string; value: number; currency: string; itemCount: number };

type PaymentEvidence = {
  status: string;
  livemode: boolean;
  client_secret: string | null;
  amount: number;
  amount_received: number;
  currency: string;
  metadata: Record<string, string>;
};

/** Only the successful, live Stripe payment matching this return may count. */
export function verifiedPurchase(intent: PaymentEvidence, orderId: string, clientSecret: string): PurchaseMeasurement | null {
  if (!clientSecret || intent.client_secret !== clientSecret || intent.status !== "succeeded" ||
    !intent.livemode || intent.metadata.orderId !== orderId || !orderId ||
    !Number.isSafeInteger(intent.amount_received) || intent.amount_received <= 0 ||
    intent.amount_received !== intent.amount || intent.currency !== "usd") return null;
  return { orderId, value: intent.amount_received / 100, currency: "USD", itemCount: 0 };
}
