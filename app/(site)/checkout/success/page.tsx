import Link from "next/link";
import { Check } from "lucide-react";
import { CheckoutSuccessClient } from "@/components/site/cart/CheckoutSuccessClient";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id: orderId } = await searchParams;
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <CheckoutSuccessClient />
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-success)] bg-white p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--color-success)] text-white">
          <Check className="size-6" aria-hidden />
        </span>
        <h1 className="mt-5 type-h2">Payment received</h1>
        {orderId ? <p className="mt-2 font-semibold">Order #{orderId}</p> : null}
        <p className="mt-3 text-[var(--color-muted-foreground)]">
          Thank you. A confirmation and order details will be sent to your email.
        </p>
        <Link className="mt-7 inline-flex text-[var(--color-brand)] underline" href="/products">
          Continue browsing
        </Link>
      </div>
    </main>
  );
}
