import "server-only";

import { getDb, isDatabaseConfigured } from "@/lib/db";
import { getStripe, isStripeConfigured } from "./stripe";

type Customer = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  address1: string;
  postal_code?: string;
  country?: string;
};

type CheckoutItem = { productId: string; variantId?: string; quantity: number };

type PriceRow = {
  product_id: string;
  variant_id: string | null;
  name: string;
  sku: string | null;
  unit_price_cents: number | null;
  stock_quantity: number;
  is_rfq: boolean;
};

export function isInternalCheckoutEnabled(): boolean {
  return process.env.CHECKOUT_PROVIDER === "stripe";
}

export async function prepareInternalPayment(
  customer: Customer,
  items: CheckoutItem[],
  idempotencyKey: string,
): Promise<{ orderId: string; clientSecret: string; subtotal: number; total: number }> {
  if (!isDatabaseConfigured() || !isStripeConfigured()) {
    throw new Error("Internal checkout is not fully configured.");
  }
  if (!items.length) throw new Error("Your cart is empty.");

  const sql = getDb();
  const priced: Array<PriceRow & { quantity: number }> = [];

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
      throw new Error("Invalid item quantity.");
    }

    const rows = item.variantId
      ? await sql`SELECT p.id AS product_id, v.id AS variant_id,
                         concat(p.name, CASE WHEN v.name IS NULL THEN '' ELSE ' — ' || v.name END) AS name,
                         coalesce(v.sku, p.sku) AS sku,
                         v.price_cents AS unit_price_cents,
                         v.stock_quantity, p.is_rfq
                  FROM products p
                  JOIN product_variants v ON v.product_id = p.id
                  WHERE p.id = ${item.productId} AND v.id = ${item.variantId}
                    AND p.is_active = true AND v.is_active = true`
      : await sql`SELECT p.id AS product_id, NULL::text AS variant_id,
                         p.name, p.sku, p.price_cents AS unit_price_cents,
                         p.stock_quantity, p.is_rfq
                  FROM products p
                  WHERE p.id = ${item.productId} AND p.is_active = true`;
    const row = (rows as unknown as PriceRow[])[0];
    if (!row) throw new Error("A product in your cart is no longer available.");
    if (row.unit_price_cents === null) {
      throw new Error(`${row.name} requires a quotation and cannot be checked out.`);
    }
    if (row.stock_quantity < item.quantity) {
      throw new Error(`${row.name} does not have enough stock.`);
    }
    priced.push({ ...row, quantity: item.quantity });
  }

  const subtotalCents = priced.reduce(
    (sum, item) => sum + item.unit_price_cents! * item.quantity,
    0,
  );
  const orders = await sql`INSERT INTO orders
    (customer_email, customer_name, status, subtotal_cents, total_cents, currency, shipping_address)
    VALUES (${customer.email.trim().toLowerCase()}, ${customer.name.trim()}, 'pending_payment',
      ${subtotalCents}, ${subtotalCents}, 'USD', ${JSON.stringify({
        line1: customer.address1,
        postalCode: customer.postal_code ?? "",
        country: customer.country ?? "US",
        phone: customer.phone,
        company: customer.company ?? "",
      })}::jsonb)
    RETURNING id`;
  const orderId = String((orders as unknown as Array<{ id: string }>)[0].id);

  for (const item of priced) {
    await sql`INSERT INTO order_items
      (order_id, product_id, variant_id, sku, name, quantity, unit_price_cents, line_total_cents)
      VALUES (${orderId}::uuid, ${item.product_id}, ${item.variant_id}, ${item.sku}, ${item.name},
        ${item.quantity}, ${item.unit_price_cents!}, ${item.unit_price_cents! * item.quantity})`;
  }

  try {
    const intent = await getStripe().paymentIntents.create(
      {
        amount: subtotalCents,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        receipt_email: customer.email.trim().toLowerCase(),
        description: `GlycoDepot order ${orderId}`,
        metadata: { orderId },
      },
      { idempotencyKey },
    );
    if (!intent.client_secret) throw new Error("Stripe did not return a payment secret.");
    await sql`UPDATE orders SET stripe_payment_intent_id = ${intent.id}, updated_at = now()
              WHERE id = ${orderId}::uuid`;
    return {
      orderId,
      clientSecret: intent.client_secret,
      subtotal: subtotalCents / 100,
      total: subtotalCents / 100,
    };
  } catch (error) {
    await sql`UPDATE orders SET status = 'checkout_failed', updated_at = now()
              WHERE id = ${orderId}::uuid`;
    throw error;
  }
}

export async function createInternalCheckout(
  customer: Customer,
  items: CheckoutItem[],
  idempotencyKey: string,
): Promise<{ orderId: string; paymentLink: string; subtotal: number; total: number }> {
  if (!isDatabaseConfigured() || !isStripeConfigured()) {
    throw new Error("Internal checkout is not fully configured.");
  }
  if (!items.length) throw new Error("Your cart is empty.");

  const sql = getDb();
  const priced: Array<PriceRow & { quantity: number }> = [];

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
      throw new Error("Invalid item quantity.");
    }

    const rows = item.variantId
      ? await sql`SELECT p.id AS product_id, v.id AS variant_id,
                         concat(p.name, CASE WHEN v.name IS NULL THEN '' ELSE ' — ' || v.name END) AS name,
                         coalesce(v.sku, p.sku) AS sku,
                         v.price_cents AS unit_price_cents,
                         v.stock_quantity, p.is_rfq
                  FROM products p
                  JOIN product_variants v ON v.product_id = p.id
                  WHERE p.id = ${item.productId} AND v.id = ${item.variantId}
                    AND p.is_active = true AND v.is_active = true`
      : await sql`SELECT p.id AS product_id, NULL::text AS variant_id,
                         p.name, p.sku, p.price_cents AS unit_price_cents,
                         p.stock_quantity, p.is_rfq
                  FROM products p
                  WHERE p.id = ${item.productId} AND p.is_active = true`;
    const row = (rows as unknown as PriceRow[])[0];
    if (!row) throw new Error("A product in your cart is no longer available.");
    // Checkout eligibility is determined by the selected item's price. Imported
    // products can retain a stale product-level RFQ flag after variants are priced.
    if (row.unit_price_cents === null) {
      throw new Error(`${row.name} requires a quotation and cannot be checked out.`);
    }
    if (row.stock_quantity < item.quantity) {
      throw new Error(`${row.name} does not have enough stock.`);
    }
    priced.push({ ...row, quantity: item.quantity });
  }

  const subtotalCents = priced.reduce(
    (sum, item) => sum + item.unit_price_cents! * item.quantity,
    0,
  );
  const orders = await sql`INSERT INTO orders
    (customer_email, customer_name, status, subtotal_cents, total_cents, currency, shipping_address)
    VALUES (${customer.email.trim().toLowerCase()}, ${customer.name.trim()}, 'pending_payment',
      ${subtotalCents}, ${subtotalCents}, 'USD', ${JSON.stringify({
        line1: customer.address1,
        postalCode: customer.postal_code ?? "",
        country: customer.country ?? "US",
        phone: customer.phone,
      })}::jsonb)
    RETURNING id`;
  const orderId = String((orders as unknown as Array<{ id: string }>)[0].id);

  for (const item of priced) {
    await sql`INSERT INTO order_items
      (order_id, product_id, variant_id, sku, name, quantity, unit_price_cents, line_total_cents)
      VALUES (${orderId}::uuid, ${item.product_id}, ${item.variant_id}, ${item.sku}, ${item.name},
        ${item.quantity}, ${item.unit_price_cents!}, ${item.unit_price_cents! * item.quantity})`;
  }

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  try {
    const session = await getStripe().checkout.sessions.create(
      {
        mode: "payment",
        customer_email: customer.email.trim().toLowerCase(),
        client_reference_id: orderId,
        metadata: { orderId },
        line_items: priced.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "usd",
            unit_amount: item.unit_price_cents!,
            product_data: { name: item.name, metadata: { productId: item.product_id } },
          },
        })),
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout`,
        billing_address_collection: "required",
        phone_number_collection: { enabled: true },
      },
      { idempotencyKey },
    );
    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    await sql`UPDATE orders SET stripe_checkout_session_id = ${session.id}, updated_at = now()
              WHERE id = ${orderId}::uuid`;
    return {
      orderId,
      paymentLink: session.url,
      subtotal: subtotalCents / 100,
      total: subtotalCents / 100,
    };
  } catch (error) {
    await sql`UPDATE orders SET status = 'checkout_failed', updated_at = now()
              WHERE id = ${orderId}::uuid`;
    throw error;
  }
}
