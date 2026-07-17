"use client";

import { useState } from "react";
import { AlertCircle, PackageSearch, Check } from "lucide-react";
import { BrandButton } from "@/components/primitives";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { orderTrackingCopy } from "@/lib/content";
import { findOrder, type LocalOrder } from "@/lib/orders/store";
import { formatUSD } from "@/lib/format";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function OrderTrackingForm() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "found" | "not-found"
  >("idle");
  const [order, setOrder] = useState<LocalOrder | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId.trim() || !emailRegex.test(email)) return;
    const result = findOrder(orderId.trim(), email.trim());
    if (result) {
      setOrder(result);
      setStatus("found");
    } else {
      setOrder(null);
      setStatus("not-found");
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="order-id" className="text-[14px] font-medium">
              {orderTrackingCopy.orderIdLabel}
            </Label>
            <Input
              id="order-id"
              name="orderId"
              required
              placeholder="e.g. 1211"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="billing-email" className="text-[14px] font-medium">
              {orderTrackingCopy.emailLabel}
            </Label>
            <Input
              id="billing-email"
              name="billingEmail"
              type="email"
              autoComplete="email"
              required
              placeholder="you@lab.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <BrandButton type="submit">
          <PackageSearch className="size-4" />
          {orderTrackingCopy.submitLabel}
        </BrandButton>
        <p className="text-[12px] text-[var(--color-muted)]">
          Order tracking matches orders placed from this browser. For older
          orders or those placed elsewhere, contact us.
        </p>
      </form>

      {status === "not-found" ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
        >
          <AlertCircle
            className="mt-0.5 size-4 shrink-0 text-[var(--color-danger)]"
            aria-hidden
          />
          <div>
            <p className="font-semibold text-[var(--color-foreground)]">
              {orderTrackingCopy.notFoundTitle}
            </p>
            <p className="text-[14px] text-[var(--color-muted-foreground)]">
              {orderTrackingCopy.notFoundBody}
            </p>
          </div>
        </div>
      ) : null}

      {status === "found" && order ? (
        <div className="space-y-4 rounded-[var(--radius-md)] border border-[var(--color-success)] bg-[var(--color-success)]/5 p-5">
          <div className="flex items-center gap-2">
            <Check className="size-5 text-[var(--color-success)]" aria-hidden />
            <p className="font-semibold text-[var(--color-foreground)]">
              Order #{order.orderId}
            </p>
          </div>
          <dl className="grid gap-2 text-[14px] sm:grid-cols-2">
            <div>
              <dt className="text-[var(--color-muted)]">Placed</dt>
              <dd className="font-medium text-[var(--color-foreground)]">
                {new Date(order.placedAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted)]">Total</dt>
              <dd className="font-medium text-[var(--color-foreground)]">
                {formatUSD(order.subtotal)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[var(--color-muted)]">Customer</dt>
              <dd className="font-medium text-[var(--color-foreground)]">
                {order.customerName} · {order.customerEmail}
              </dd>
            </div>
          </dl>
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Items
            </p>
            <ul className="space-y-1.5 text-[14px]">
              {order.lines.map((line) => (
                <li
                  key={`${line.productId}:${line.variantId ?? ""}`}
                  className="flex items-baseline justify-between"
                >
                  <span className="text-[var(--color-foreground)]">
                    {line.quantity}× {line.name}
                    {line.variantName ? (
                      <span className="text-[var(--color-muted)]">
                        {" "}
                        · {line.variantName}
                      </span>
                    ) : null}
                  </span>
                  <span className="font-medium text-[var(--color-foreground)]">
                    {formatUSD((line.unitPrice ?? 0) * line.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[12px] text-[var(--color-muted)]">
            Shipping confirmation, tracking number, and invoice are emailed to{" "}
            {order.customerEmail}.
          </p>
        </div>
      ) : null}
    </div>
  );
}
