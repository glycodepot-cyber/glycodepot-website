import Link from "next/link";
import { Check } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-success)] bg-white p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--color-success)] text-white">
          <Check className="size-6" aria-hidden />
        </span>
        <h1 className="mt-5 type-h2">Payment received</h1>
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

