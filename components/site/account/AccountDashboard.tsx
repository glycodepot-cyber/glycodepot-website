"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, ClipboardList } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { BrandButton } from "@/components/primitives";
import { useQuoteList, getQuoteCount } from "@/lib/quote/store";
import { useLocalOrders } from "@/lib/orders/store";
import { formatUSD } from "@/lib/format";

type TabKey = "orders" | "quotes";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "orders", label: "Orders", icon: <Package className="size-4" /> },
  { key: "quotes", label: "Quote requests", icon: <ClipboardList className="size-4" /> },
];

export function AccountDashboard() {
  const [tab, setTab] = useState<TabKey>("orders");
  const { user, isLoaded } = useUser();
  const quoteItems = useQuoteList();
  const quoteCount = getQuoteCount(quoteItems);
  const orders = useLocalOrders();

  const displayName = isLoaded && user
    ? (user.firstName ?? user.emailAddresses[0]?.emailAddress ?? "")
    : "";

  return (
    <div className="space-y-6">
      {displayName ? (
        <p className="text-[15px] text-[var(--color-muted-foreground)]">
          Welcome back,{" "}
          <span className="font-semibold text-[var(--color-foreground)]">
            {displayName}
          </span>
        </p>
      ) : null}
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside>
        <nav
          aria-label="Account sections"
          className="flex gap-2 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-2 lg:flex-col lg:overflow-visible"
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              aria-current={tab === t.key ? "page" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-2.5 rounded-[var(--radius-md)] px-3.5 py-2.5 text-left text-sm font-medium transition-colors",
                tab === t.key
                  ? "bg-[var(--color-brand-soft)] text-[var(--color-brand)]"
                  : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]",
              )}
            >
              {t.icon}
              {t.label}
              {t.key === "quotes" && quoteCount > 0 ? (
                <span className="ml-auto rounded-full bg-[var(--color-accent)] px-1.5 text-[11px] font-semibold text-white">
                  {quoteCount}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
      </aside>

      {/* Panel */}
      <section className="min-h-[280px]">
        {tab === "orders" ? (
            orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((o) => (
                  <article
                    key={o.orderId}
                    className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5"
                  >
                    <header className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <h3 className="type-h4 text-[var(--color-foreground)]">
                          Order #{o.orderId}
                        </h3>
                        <p className="text-[13px] text-[var(--color-muted)]">
                          {new Date(o.placedAt).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-[18px] font-bold text-[var(--color-foreground)]">
                        {formatUSD(o.subtotal)}
                      </p>
                    </header>
                    <ul className="mt-3 space-y-1 text-[13px] text-[var(--color-muted-foreground)]">
                      {o.lines.slice(0, 4).map((l) => (
                        <li key={`${l.productId}:${l.variantId ?? ""}`}>
                          {l.quantity}× {l.name}
                          {l.variantName ? ` · ${l.variantName}` : ""}
                        </li>
                      ))}
                      {o.lines.length > 4 ? (
                        <li className="text-[var(--color-muted)]">
                          + {o.lines.length - 4} more
                        </li>
                      ) : null}
                    </ul>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyPanel
                icon={<Package className="size-7" />}
                title="No orders yet"
                body="When you place an order it'll appear here with item details and totals."
                ctaLabel="Browse products"
                ctaHref="/products"
              />
            )
          ) : null}

          {tab === "quotes" ? (
            quoteItems.length > 0 ? (
              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="type-h3 text-[var(--color-foreground)]">
                    Current quote list
                  </h2>
                  <span className="text-[13px] text-[var(--color-muted)]">
                    {quoteCount} items
                  </span>
                </div>
                <ul className="mt-4 divide-y divide-[var(--color-border)]">
                  {quoteItems.map((i) => (
                    <li
                      key={`${i.productId}:${i.variantId ?? ""}`}
                      className="flex items-center justify-between gap-3 py-3 text-sm"
                    >
                      <Link
                        href={i.href}
                        className="font-medium text-[var(--color-foreground)] hover:text-[var(--color-brand)]"
                      >
                        {i.name}
                        {i.variantName ? (
                          <span className="text-[var(--color-muted)]"> · {i.variantName}</span>
                        ) : null}
                      </Link>
                      <span className="shrink-0 text-[var(--color-muted-foreground)]">
                        ×{i.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
                <BrandButton href="/quote-request" className="mt-5">
                  Review & submit
                </BrandButton>
              </div>
            ) : (
              <EmptyPanel
                icon={<ClipboardList className="size-7" />}
                title="No quote requests"
                body="Add products to your quote list and they'll show up here."
                ctaLabel="Browse products"
                ctaHref="/products"
              />
            )
          ) : null}

      </section>
    </div>
    </div>
  );
}

function EmptyPanel({
  icon,
  title,
  body,
  ctaLabel,
  ctaHref,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-strong)] bg-white p-12 text-center">
      <div className="grid size-16 place-items-center rounded-full bg-[var(--color-surface)] text-[var(--color-muted)]">
        {icon}
      </div>
      <div className="space-y-2">
        <h2 className="type-h3 text-[var(--color-foreground)]">{title}</h2>
        <p className="max-w-md text-[15px] text-[var(--color-muted-foreground)]">
          {body}
        </p>
      </div>
      {ctaLabel && ctaHref ? (
        <BrandButton href={ctaHref}>{ctaLabel}</BrandButton>
      ) : null}
    </div>
  );
}
