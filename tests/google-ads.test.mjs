import test from "node:test";
import assert from "node:assert/strict";
import { verifiedPurchase } from "../lib/payments/verifiedPurchase.ts";
import { safeMeasurementUrl, trackAdsConversion, QUOTE_CONVERSION, PURCHASE_CONVERSION } from "../lib/analytics/googleAds.ts";

const intent = { status: "succeeded", livemode: true, client_secret: "test-secret", amount: 12345, amount_received: 12345, currency: "usd", metadata: { orderId: "order-123" } };

test("only a confirmed live payment with the matching return counts as a purchase", () => {
  assert.deepEqual(verifiedPurchase(intent, "order-123", "test-secret"), { orderId: "order-123", value: 123.45, currency: "USD", itemCount: 0 });
  for (const change of [{ status: "processing" }, { status: "requires_payment_method" }, { livemode: false }, { amount_received: 0 }, { amount_received: 12344 }, { currency: "eur" }, { metadata: { orderId: "another-order" } }]) {
    assert.equal(verifiedPurchase({ ...intent, ...change }, "order-123", "test-secret"), null);
  }
  assert.equal(verifiedPurchase(intent, "order-123", "wrong-secret"), null);
  assert.equal(verifiedPurchase(intent, "order-123", ""), null);
});

test("measurement excludes secrets, customer queries, and fragments", () => {
  assert.equal(safeMeasurementUrl("https://www.glycodepot.com/checkout/success?payment_intent_client_secret=private&email=private@example.invalid#private"), "https://www.glycodepot.com/checkout/success");
});

test("quote and purchase route to distinct existing actions with stable IDs and no PII", () => {
  globalThis.window = { location: new URL("https://www.glycodepot.com/checkout/success?payment_intent_client_secret=private"), dataLayer: [] };
  globalThis.document = { referrer: "https://www.glycodepot.com/checkout?email=private@example.invalid" };
  try {
    trackAdsConversion(QUOTE_CONVERSION, "quote-123", 0);
    trackAdsConversion(PURCHASE_CONVERSION, "order-123", 123.45);
    const events = window.dataLayer.map(args => Array.from(args));
    assert.equal(events.length, 2);
    assert.equal(events[0][2].value, 0);
    assert.equal(events[0][2].transaction_id, "quote-123");
    assert.equal(events[1][2].transaction_id, "order-123");
    assert.equal(events[1][2].value, 123.45);
    assert.notEqual(events[0][2].send_to, events[1][2].send_to);
    assert.doesNotMatch(JSON.stringify(events), /private|email=|client_secret/);
    window.location = new URL("https://preview.example.invalid");
    trackAdsConversion(PURCHASE_CONVERSION, "preview-order", 123);
    assert.equal(window.dataLayer.length, 2);
  } finally { delete globalThis.window; delete globalThis.document; }
});
