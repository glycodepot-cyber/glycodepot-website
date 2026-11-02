import "server-only";
import { getStripe, isStripeConfigured } from "./stripe";
import { verifiedPurchase } from "./verifiedPurchase";

export async function purchaseFromReturn(orderId?: string, intentId?: string, clientSecret?: string) {
  if (!isStripeConfigured() || !orderId || !intentId || !clientSecret ||
    !/^pi_[a-zA-Z0-9]+$/.test(intentId) || !clientSecret.startsWith(`${intentId}_secret_`)) return null;
  try {
    const intent = await getStripe().paymentIntents.retrieve(intentId);
    return verifiedPurchase(intent, orderId, clientSecret);
  } catch {
    // Never log Stripe return parameters, which contain a client secret.
    return null;
  }
}
