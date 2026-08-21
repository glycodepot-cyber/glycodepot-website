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
import { attributionForWebhook } from "@/lib/analytics/utm";
import { trackRfqSubmit } from "@/lib/analytics/dataLayer";
import { findGroupForCategory } from "@/lib/content/category-groups";
import {
  useQuoteList,
  updateQuoteQuantity,
  removeFromQuote,
  clearQuote,
  getQuoteCount,
} from "@/lib/quote/store";
import { quoteCopy } from "@/lib/content";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ISO 3166-1 alpha-2 — matches BysonHub's accepted country codes.
const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "AF", label: "Afghanistan" },
  { value: "AL", label: "Albania" },
  { value: "DZ", label: "Algeria" },
  { value: "AR", label: "Argentina" },
  { value: "AM", label: "Armenia" },
  { value: "AU", label: "Australia" },
  { value: "AT", label: "Austria" },
  { value: "AZ", label: "Azerbaijan" },
  { value: "BH", label: "Bahrain" },
  { value: "BD", label: "Bangladesh" },
  { value: "BE", label: "Belgium" },
  { value: "BR", label: "Brazil" },
  { value: "BG", label: "Bulgaria" },
  { value: "CA", label: "Canada" },
  { value: "CL", label: "Chile" },
  { value: "CN", label: "China" },
  { value: "CO", label: "Colombia" },
  { value: "HR", label: "Croatia" },
  { value: "CY", label: "Cyprus" },
  { value: "CZ", label: "Czech Republic" },
  { value: "DK", label: "Denmark" },
  { value: "EG", label: "Egypt" },
  { value: "EE", label: "Estonia" },
  { value: "ET", label: "Ethiopia" },
  { value: "FI", label: "Finland" },
  { value: "FR", label: "France" },
  { value: "GE", label: "Georgia" },
  { value: "DE", label: "Germany" },
  { value: "GH", label: "Ghana" },
  { value: "GR", label: "Greece" },
  { value: "HK", label: "Hong Kong" },
  { value: "HU", label: "Hungary" },
  { value: "IS", label: "Iceland" },
  { value: "IN", label: "India" },
  { value: "ID", label: "Indonesia" },
  { value: "IR", label: "Iran" },
  { value: "IQ", label: "Iraq" },
  { value: "IE", label: "Ireland" },
  { value: "IL", label: "Israel" },
  { value: "IT", label: "Italy" },
  { value: "JP", label: "Japan" },
  { value: "JO", label: "Jordan" },
  { value: "KZ", label: "Kazakhstan" },
  { value: "KE", label: "Kenya" },
  { value: "KW", label: "Kuwait" },
  { value: "LV", label: "Latvia" },
  { value: "LB", label: "Lebanon" },
  { value: "LT", label: "Lithuania" },
  { value: "LU", label: "Luxembourg" },
  { value: "MY", label: "Malaysia" },
  { value: "MX", label: "Mexico" },
  { value: "MA", label: "Morocco" },
  { value: "NL", label: "Netherlands" },
  { value: "NZ", label: "New Zealand" },
  { value: "NG", label: "Nigeria" },
  { value: "NO", label: "Norway" },
  { value: "OM", label: "Oman" },
  { value: "PK", label: "Pakistan" },
  { value: "PE", label: "Peru" },
  { value: "PH", label: "Philippines" },
  { value: "PL", label: "Poland" },
  { value: "PT", label: "Portugal" },
  { value: "QA", label: "Qatar" },
  { value: "RO", label: "Romania" },
  { value: "RU", label: "Russia" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "SG", label: "Singapore" },
  { value: "SK", label: "Slovakia" },
  { value: "SI", label: "Slovenia" },
  { value: "ZA", label: "South Africa" },
  { value: "KR", label: "South Korea" },
  { value: "ES", label: "Spain" },
  { value: "LK", label: "Sri Lanka" },
  { value: "SE", label: "Sweden" },
  { value: "CH", label: "Switzerland" },
  { value: "TW", label: "Taiwan" },
  { value: "TZ", label: "Tanzania" },
  { value: "TH", label: "Thailand" },
  { value: "TR", label: "Turkey" },
  { value: "UA", label: "Ukraine" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "GB", label: "United Kingdom" },
  { value: "UG", label: "Uganda" },
  { value: "VN", label: "Vietnam" },
];

interface CustomerState {
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
  notes: string;
}

export function QuoteListView() {
  const items = useQuoteList();
  const count = getQuoteCount(items);

  const [customer, setCustomer] = useState<CustomerState>({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    address1: "",
    city: "",
    state: "",
    postal: "",
    country: "US",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  function update<K extends keyof CustomerState>(k: K, v: CustomerState[K]) {
    setCustomer((c) => ({ ...c, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!emailRegex.test(customer.email)) next.email = "Valid email required.";
    if (!customer.firstName.trim()) next.firstName = "Required.";
    if (!customer.lastName.trim()) next.lastName = "Required.";
    if (!customer.company.trim()) next.company = "Required.";
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

    // Map each cart item to its top-level category group (Glycochemistry /
    // Glycobiology / Glyco-analysis) via the category slug embedded in its href
    // (/products/{categorySlug}/{slug}), for SOW §3.2 "Product category interest".
    const categoryNames = [
      ...new Set(
        items
          .map((i) => i.href.split("/")[2])
          .map((slug) => findGroupForCategory(slug)?.name)
          .filter((n): n is string => Boolean(n)),
      ),
    ];

    const attribution = attributionForWebhook();

    try {
      const res = await submitQuote({
        lines,
        customer: {
          name: `${customer.firstName} ${customer.lastName}`.trim(),
          email: customer.email.trim(),
          company: customer.company.trim(),
          phone: customer.phone.trim(),
          address1: customer.address1.trim(),
          city: customer.city.trim(),
          state: customer.state.trim(),
          postal: customer.postal.trim(),
          country: customer.country,
          notes: customer.notes.trim() || undefined,
        },
        meta: {
          productCategories: categoryNames,
          leadSource: attribution.leadSource,
          googleAdsCampaign: attribution.googleAdsCampaign,
          googleAdsAdGroup: attribution.googleAdsAdGroup,
          landingPageUrl: attribution.landingPageUrl,
          gclid: attribution.gclid,
        },
      });
      trackRfqSubmit({
        itemCount: items.length,
        categories: categoryNames,
        bhQuoteId: res.bhQuotationId,
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

          <Field id="q-email" label="Email *" error={errors.email}>
            <Input
              id="q-email"
              type="email"
              autoComplete="email"
              value={customer.email}
              onChange={(e) => update("email", e.target.value)}
              aria-invalid={!!errors.email}
            />
          </Field>
          <Field id="q-phone" label="Phone" error={errors.phone}>
            <Input
              id="q-phone"
              type="tel"
              autoComplete="tel"
              value={customer.phone}
              onChange={(e) => update("phone", e.target.value)}
              aria-invalid={!!errors.phone}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="q-first" label="First name *" error={errors.firstName}>
              <Input
                id="q-first"
                autoComplete="given-name"
                value={customer.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                aria-invalid={!!errors.firstName}
              />
            </Field>
            <Field id="q-last" label="Last name *" error={errors.lastName}>
              <Input
                id="q-last"
                autoComplete="family-name"
                value={customer.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                aria-invalid={!!errors.lastName}
              />
            </Field>
          </div>
          <Field id="q-company" label="Organization *" error={errors.company}>
            <Input
              id="q-company"
              autoComplete="organization"
              value={customer.company}
              onChange={(e) => update("company", e.target.value)}
              aria-invalid={!!errors.company}
            />
          </Field>
          <Field id="q-address" label="Address" error={errors.address1}>
            <Input
              id="q-address"
              autoComplete="address-line1"
              value={customer.address1}
              onChange={(e) => update("address1", e.target.value)}
              aria-invalid={!!errors.address1}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="q-city" label="City" error={errors.city}>
              <Input
                id="q-city"
                autoComplete="address-level2"
                value={customer.city}
                onChange={(e) => update("city", e.target.value)}
                aria-invalid={!!errors.city}
              />
            </Field>
            <Field id="q-state" label="State / Region" error={errors.state}>
              <Input
                id="q-state"
                autoComplete="address-level1"
                value={customer.state}
                onChange={(e) => update("state", e.target.value)}
                aria-invalid={!!errors.state}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="q-postal" label="Postal code" error={errors.postal}>
              <Input
                id="q-postal"
                autoComplete="postal-code"
                value={customer.postal}
                onChange={(e) => update("postal", e.target.value)}
                aria-invalid={!!errors.postal}
              />
            </Field>
            <Field id="q-country" label="Country">
              <select
                id="q-country"
                value={customer.country}
                onChange={(e) => update("country", e.target.value)}
                className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 text-sm focus:border-[var(--color-brand)] focus:outline-none"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
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
