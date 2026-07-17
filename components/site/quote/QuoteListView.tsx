"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Trash2,
  ClipboardList,
  AlertCircle,
  Check,
  Send,
} from "lucide-react";
import { BrandButton } from "@/components/primitives";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { QtyStepper } from "@/components/site/cart/QtyStepper";
import { formatUSD } from "@/lib/format";
import { submitQuote } from "@/lib/cart/actions";
import type { QuoteLine } from "@/lib/cart";
import {
  useQuoteList,
  updateQuoteQuantity,
  removeFromQuote,
  clearQuote,
  getQuoteCount,
} from "@/lib/quote/store";
import { quoteCopy } from "@/lib/content";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CustomerState {
  name: string;
  email: string;
  company: string;
  phone: string;
  notes: string;
}

export function QuoteListView() {
  const items = useQuoteList();
  const count = getQuoteCount(items);

  const [customer, setCustomer] = useState<CustomerState>({
    name: "",
    email: "",
    company: "",
    phone: "",
    notes: "",
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  function update<K extends keyof CustomerState>(k: K, v: CustomerState[K]) {
    setCustomer((c) => ({ ...c, [k]: v }));
    if (k in errors) setErrors((e) => ({ ...e, [k]: undefined }));
  }

  function validate(): boolean {
    const next: typeof errors = {};
    if (!customer.name.trim()) next.name = "Please tell us your name.";
    if (!emailRegex.test(customer.email)) next.email = "Enter a valid email.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    const lines: QuoteLine[] = items.map((i) => ({
      productId: i.productId,
      variantId: i.variantId,
      name: `${i.name}${i.variantName ? ` · ${i.variantName}` : ""}`,
      quantity: i.quantity,
      image: i.image,
    }));
    try {
      await submitQuote({
        lines,
        customer: {
          name: customer.name.trim(),
          email: customer.email.trim(),
          company: customer.company.trim() || undefined,
          phone: customer.phone.trim() || undefined,
          notes: customer.notes.trim() || undefined,
        },
      });
      clearQuote();
      setStatus("done");
      toast.success("Quote submitted! We'll be in touch shortly.");
    } catch {
      setStatus("idle");
      toast.error("Couldn't send your request. Please try again.");
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
            {quoteCopy.successTitle}
          </h2>
          <p className="text-[15px] text-[var(--color-muted-foreground)]">
            {quoteCopy.successBody}
          </p>
        </div>
        <BrandButton href="/products">Continue browsing</BrandButton>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center gap-6 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-strong)] bg-white p-10 text-center lg:p-14">
          <div className="grid size-16 place-items-center rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
            <ClipboardList className="size-7" aria-hidden />
          </div>
          <div className="space-y-2">
            <h2 className="type-h3 text-[var(--color-foreground)]">
              {quoteCopy.empty.title}
            </h2>
            <p className="max-w-md text-pretty text-[15px] text-[var(--color-muted-foreground)]">
              {quoteCopy.empty.body}
            </p>
          </div>
          <BrandButton href={quoteCopy.empty.cta.href} size="lg">
            {quoteCopy.empty.cta.label}
          </BrandButton>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
      {/* List */}
      <div>
        <div className="flex items-center justify-between">
          <p className="text-[14px] text-[var(--color-muted-foreground)]">
            {count} {count === 1 ? "item" : "items"} in your list
          </p>
          <button
            type="button"
            onClick={clearQuote}
            className="text-[13px] font-medium text-[var(--color-muted)] hover:text-[var(--color-accent)]"
          >
            Clear list
          </button>
        </div>

        <ul className="mt-4 divide-y divide-[var(--color-border)] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white">
          {items.map((item) => {
            const key = `${item.productId}:${item.variantId ?? ""}`;
            return (
              <li key={key} className="flex gap-4 p-4 sm:p-5">
                <Link
                  href={item.href}
                  className="relative size-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]"
                >
                  {item.image ? (
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : null}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={item.href}
                        className="text-[15px] font-semibold text-[var(--color-foreground)] hover:text-[var(--color-brand)]"
                      >
                        {item.name}
                      </Link>
                      {item.variantName ? (
                        <p className="text-[13px] text-[var(--color-muted)]">
                          {item.variantName}
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() =>
                        removeFromQuote(item.productId, item.variantId)
                      }
                      className="grid size-8 shrink-0 place-items-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)]"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <QtyStepper
                    value={item.quantity}
                    size="sm"
                    onChange={(q) =>
                      updateQuoteQuantity(item.productId, item.variantId, q)
                    }
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Form */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <form
          noValidate
          onSubmit={onSubmit}
          className="space-y-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 lg:p-7"
        >
          <h2 className="type-h3 text-[var(--color-foreground)]">
            Your details
          </h2>
          <p className="text-[13px] text-[var(--color-muted-foreground)]">
            We&rsquo;ll reply with pricing, lead times, and bulk options.
          </p>

          <Field id="q-name" label="Name *" error={errors.name}>
            <Input
              id="q-name"
              autoComplete="name"
              value={customer.name}
              onChange={(e) => update("name", e.target.value)}
              aria-invalid={!!errors.name}
            />
          </Field>
          <Field id="q-email" label="Work email *" error={errors.email}>
            <Input
              id="q-email"
              type="email"
              autoComplete="email"
              value={customer.email}
              onChange={(e) => update("email", e.target.value)}
              aria-invalid={!!errors.email}
            />
          </Field>
          <Field id="q-company" label="Organization">
            <Input
              id="q-company"
              autoComplete="organization"
              value={customer.company}
              onChange={(e) => update("company", e.target.value)}
            />
          </Field>
          <Field id="q-phone" label="Phone (optional)">
            <Input
              id="q-phone"
              type="tel"
              autoComplete="tel"
              value={customer.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </Field>
          <Field id="q-notes" label="Notes (optional)">
            <textarea
              id="q-notes"
              rows={3}
              value={customer.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Target purity, timeline, shipping country…"
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-3 text-sm leading-relaxed outline-none placeholder:text-[var(--color-muted)] hover:border-[var(--color-border-strong)] focus:border-[var(--color-brand)]"
            />
          </Field>

          <BrandButton
            type="submit"
            size="lg"
            disabled={status === "loading"}
            className="w-full"
          >
            <Send className="size-4" />
            {status === "loading" ? "Sending…" : quoteCopy.submitLabel}
          </BrandButton>
        </form>
      </aside>
    </div>
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
