"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Lock, Check, ShoppingBag } from "lucide-react";
import { BrandButton } from "@/components/primitives";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatUSD } from "@/lib/format";
import { submitOrder } from "@/lib/cart/actions";
import {
  useCart,
  getCartSubtotal,
  getCartCount,
  clearCart,
} from "@/lib/cart/store";
import { appendOrder } from "@/lib/orders/store";
import { trackPurchase } from "@/lib/analytics/dataLayer";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  address1: string;
  city: string;
  state: string;
  postal: string;
  country: string;
}

const COUNTRIES = ["United States", "Canada", "United Kingdom", "Germany", "Other"];

export function CheckoutView() {
  const items = useCart();
  const subtotal = getCartSubtotal(items);
  const count = getCartCount(items);

  const [form, setForm] = useState<FormState>({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    address1: "",
    city: "",
    state: "",
    postal: "",
    country: "United States",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [orderId, setOrderId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!emailRegex.test(form.email)) next.email = "Valid email required.";
    if (!form.firstName.trim()) next.firstName = "Required.";
    if (!form.lastName.trim()) next.lastName = "Required.";
    if (!form.phone.trim()) next.phone = "Required.";
    if (!form.address1.trim()) next.address1 = "Required.";
    if (!form.city.trim()) next.city = "Required.";
    if (!form.postal.trim()) next.postal = "Required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setSubmitError(null);

    const fullAddress = [
      form.address1,
      form.city,
      form.state,
      form.country,
    ]
      .filter(Boolean)
      .join(", ");

    const result = await submitOrder({
      customer: {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        address1: fullAddress,
        postal_code: form.postal || undefined,
        country: form.country,
      },
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      })),
    });

    if (result.ok) {
      // Persist a copy locally so /order-tracking + /my-account/dashboard
      // can show this order without depending on a GET /orders endpoint.
      appendOrder({
        orderId: result.orderId,
        placedAt: new Date().toISOString(),
        customerEmail: form.email,
        customerName: `${form.firstName} ${form.lastName}`.trim(),
        subtotal,
        lines: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          name: i.name,
          variantName: i.variantName,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          image: i.image,
          href: i.href,
        })),
      });
      clearCart();
      if (result.paymentLink) {
        // Send the customer straight to Stripe Checkout to pay. Payment
        // completes off our domain, so the Purchase conversion for these
        // orders is attributed server-side via the SOW §4.3 offline
        // conversion import, not this client-side pixel.
        window.location.href = result.paymentLink;
        return;
      }
      // On-site order confirmation (no external redirect) → fire the §4.1
      // Purchase conversion here. `items`/`subtotal` are the pre-clear values
      // captured at render, so they're still valid after clearCart().
      trackPurchase({
        orderId: result.orderId,
        value: subtotal,
        itemCount: count,
      });
      setOrderId(result.orderId);
      setStatus("done");
    } else {
      setSubmitError(result.error);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 rounded-[var(--radius-xl)] border border-[var(--color-success)] bg-[var(--color-success)]/5 p-10 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-[var(--color-success)] text-white">
          <Check className="size-6" />
        </span>
        <div className="space-y-2">
          <h2 className="type-h2 text-[var(--color-foreground)]">
            Order placed{orderId ? ` — #${orderId}` : ""}.
          </h2>
          <p className="text-[15px] text-[var(--color-muted-foreground)]">
            We&apos;ve received your order and will follow up by email with
            shipping confirmation and an invoice.
          </p>
        </div>
        <BrandButton href="/products">Continue browsing</BrandButton>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-strong)] bg-white p-12 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-[var(--color-surface)] text-[var(--color-muted)]">
          <ShoppingBag className="size-7" aria-hidden />
        </div>
        <div className="space-y-2">
          <h2 className="type-h3 text-[var(--color-foreground)]">
            Nothing to check out
          </h2>
          <p className="text-[15px] text-[var(--color-muted-foreground)]">
            Your cart is empty. Add a few products first.
          </p>
        </div>
        <BrandButton href="/products" size="lg">
          Browse products
        </BrandButton>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12"
    >
      {/* Details */}
      <div className="space-y-8">
        <fieldset className="space-y-4">
          <legend className="type-h3 text-[var(--color-foreground)]">
            Contact
          </legend>
          <Field id="co-email" label="Email *" error={errors.email}>
            <Input
              id="co-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              aria-invalid={!!errors.email}
            />
          </Field>
          <Field id="co-phone" label="Phone *" error={errors.phone}>
            <Input
              id="co-phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              aria-invalid={!!errors.phone}
            />
          </Field>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="type-h3 text-[var(--color-foreground)]">
            Shipping address
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="co-first" label="First name *" error={errors.firstName}>
              <Input
                id="co-first"
                autoComplete="given-name"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                aria-invalid={!!errors.firstName}
              />
            </Field>
            <Field id="co-last" label="Last name *" error={errors.lastName}>
              <Input
                id="co-last"
                autoComplete="family-name"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                aria-invalid={!!errors.lastName}
              />
            </Field>
          </div>
          <Field id="co-company" label="Organization (optional)">
            <Input
              id="co-company"
              autoComplete="organization"
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
            />
          </Field>
          <Field id="co-address" label="Address *" error={errors.address1}>
            <Input
              id="co-address"
              autoComplete="address-line1"
              value={form.address1}
              onChange={(e) => update("address1", e.target.value)}
              aria-invalid={!!errors.address1}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="co-city" label="City *" error={errors.city}>
              <Input
                id="co-city"
                autoComplete="address-level2"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                aria-invalid={!!errors.city}
              />
            </Field>
            <Field id="co-state" label="State / Region">
              <Input
                id="co-state"
                autoComplete="address-level1"
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="co-postal" label="Postal code *" error={errors.postal}>
              <Input
                id="co-postal"
                autoComplete="postal-code"
                value={form.postal}
                onChange={(e) => update("postal", e.target.value)}
                aria-invalid={!!errors.postal}
              />
            </Field>
            <Field id="co-country" label="Country">
              <select
                id="co-country"
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 text-sm focus:border-[var(--color-brand)] focus:outline-none"
              >
                {COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>
        </fieldset>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 lg:p-7">
          <h2 className="type-h3 text-[var(--color-foreground)]">
            Order summary
          </h2>
          <ul className="mt-5 space-y-3">
            {items.map((i) => {
              const key = `${i.productId}:${i.variantId ?? ""}`;
              return (
                <li key={key} className="flex items-start justify-between gap-3 text-[14px]">
                  <span className="min-w-0 text-[var(--color-muted-foreground)]">
                    <span className="font-medium text-[var(--color-foreground)]">
                      {i.quantity}×
                    </span>{" "}
                    {i.name}
                    {i.variantName ? (
                      <span className="text-[var(--color-muted)]"> · {i.variantName}</span>
                    ) : null}
                  </span>
                  <span className="shrink-0 font-semibold text-[var(--color-foreground)]">
                    {formatUSD((i.unitPrice ?? 0) * i.quantity)}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-5">
            <span className="font-semibold text-[var(--color-foreground)]">
              Subtotal
            </span>
            <span className="text-[20px] font-bold text-[var(--color-foreground)]">
              {formatUSD(subtotal)}
            </span>
          </div>
          <p className="mt-1 text-[12px] text-[var(--color-muted)]">
            Shipping & tax calculated at the payment step.
          </p>

          <BrandButton
            type="submit"
            size="lg"
            disabled={status === "loading"}
            className="mt-6 w-full"
          >
            <Lock className="size-4" />
            {status === "loading" ? "Placing order…" : "Place order"}
          </BrandButton>
          {submitError ? (
            <p
              role="alert"
              className="mt-3 flex items-start gap-2 rounded-[var(--radius-md)] bg-[var(--color-danger)]/10 p-3 text-[13px] text-[var(--color-danger)]"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{submitError}</span>
            </p>
          ) : null}
          <p className="mt-3 text-center text-[12px] text-[var(--color-muted)]">
            By continuing you agree to our{" "}
            <Link href="/legal/terms" className="underline">
              terms
            </Link>
            .
          </p>
        </div>
      </aside>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[14px] font-medium">
        {label}
      </Label>
      {children}
      {error ? (
        <p
          role="alert"
          className="flex items-center gap-1.5 text-[13px] text-[var(--color-danger)]"
        >
          <AlertCircle className="size-3.5" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
}
