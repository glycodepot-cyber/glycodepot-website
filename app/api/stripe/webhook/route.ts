import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { getStripe, isStripeConfigured } from "@/lib/payments/stripe";
import { sendSalesNotification } from "@/lib/email/notifications";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !isStripeConfigured() || !isDatabaseConfigured()) {
    return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.expired") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId ?? session.client_reference_id;
    if (orderId) {
      const status = event.type === "checkout.session.completed" ? "paid" : "expired";
      const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : null;
      const sql = getDb();
      await sql`UPDATE orders SET status = ${status}, stripe_payment_intent_id = ${paymentIntent},
                updated_at = now() WHERE id = ${orderId}::uuid`;
    }
  }

  if (event.type === "payment_intent.succeeded" || event.type === "payment_intent.payment_failed") {
    const intent = event.data.object;
    const orderId = intent.metadata?.orderId;
    if (orderId) {
      const status = event.type === "payment_intent.succeeded" ? "paid" : "payment_failed";
      const sql = getDb();
      await sql`UPDATE orders SET status = ${status}, stripe_payment_intent_id = ${intent.id},
                updated_at = now() WHERE id = ${orderId}::uuid`;
      if (event.type === "payment_intent.succeeded") {
        const orders = await sql`SELECT customer_name, customer_email FROM orders WHERE id = ${orderId}::uuid`;
        const order = (orders as unknown as Array<{ customer_name: string; customer_email: string }>)[0];
        const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
          .format(intent.amount_received / 100);
        await sendSalesNotification({
          subject: `Paid GlycoDepot order #${orderId}`,
          replyTo: order?.customer_email,
          text:
            `A customer completed payment.\n\n` +
            `Order: ${orderId}\n` +
            `Customer: ${order?.customer_name ?? "—"}\n` +
            `Email: ${order?.customer_email ?? intent.receipt_email ?? "—"}\n` +
            `Amount paid: ${amount}\n` +
            `Stripe payment intent: ${intent.id}`,
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
