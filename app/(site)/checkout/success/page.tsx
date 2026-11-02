import Link from "next/link";
import { Check } from "lucide-react";
import { CheckoutSuccessClient } from "@/components/site/cart/CheckoutSuccessClient";
import { purchaseFromReturn } from "@/lib/payments/purchaseReturn";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string; payment_intent?: string; payment_intent_client_secret?: string }>;
}) {
  const params = await searchParams;
  const orderId = params.order_id;
  const purchase = await purchaseFromReturn(orderId, params.payment_intent, params.payment_intent_client_secret);
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <CheckoutSuccessClient purchase={purchase} />
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-success)] bg-white p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--color-success)] text-white">
          <Check className="size-6" aria-hidden />
        </span>
        <h1 className="mt-5 type-h2">{purchase ? "Payment received" : "Check your payment confirmation"}</h1>
        {orderId ? <p className="mt-2 font-semibold">Order #{orderId}</p> : null}
        <p className="mt-3 text-[var(--color-muted-foreground)]">
          {purchase ? "Thank you. A confirmation and order details will be sent to your email." : "Your email confirmation will show the payment status. Contact info@glycodepot.com if you need help."}
        </p>
        <Link className="mt-7 inline-flex text-[var(--color-brand)] underline" href="/products">
          Continue browsing
        </Link>
      </div>
    </main>
  );
}
