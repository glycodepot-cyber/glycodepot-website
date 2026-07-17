"use client";

import { useState } from "react";
import { Minus, Plus, ShieldCheck, Truck, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/format";
import type { Product, ProductVariant } from "@/lib/cart";
import { AddToCartButton } from "./AddToCartButton";
import { AddToQuoteButton } from "./AddToQuoteButton";

interface PurchasePanelProps {
  product: Product;
}

export function ProductPurchasePanel({ product }: PurchasePanelProps) {
  const variants = product.variants;
  const initial = variants.find((v) => v.inStock) ?? variants[0];
  const [variantId, setVariantId] = useState<string | undefined>(initial?.id);
  const [qty, setQty] = useState(1);

  const variant: ProductVariant | undefined = variants.find(
    (v) => v.id === variantId,
  );
  const isQuote = !variant?.price && !product.price;
  const activePrice = variant?.price ?? product.price ?? null;
  // Take the compare-at from whichever record supplied activePrice, so the
  // struck-through figure always describes the size actually selected.
  const activeCompareAt = variant
    ? (variant.compareAtPrice ?? null)
    : (product.compareAtPrice ?? null);

  return (
    <div className="space-y-7">
      {/* Price */}
      <div className="space-y-1">
        <span className="type-overline text-[var(--color-muted)]">
          {isQuote ? "Pricing" : "From"}
        </span>
        <div className="flex items-baseline gap-2.5">
          <div
            className={cn(
              "text-[28px] font-bold leading-none",
              isQuote
                ? "text-[var(--color-brand)]"
                : "text-[var(--color-foreground)]",
            )}
          >
            {formatMoney(activePrice)}
          </div>
          {!isQuote && activeCompareAt ? (
            <s className="text-[17px] font-medium leading-none text-[var(--color-muted)] decoration-[var(--color-muted)]/70">
              {formatMoney(activeCompareAt)}
            </s>
          ) : null}
        </div>
        {!isQuote ? (
          <p className="text-[13px] text-[var(--color-muted)]">
            per {variant?.name ?? "unit"} · exclusive of tax & shipping
          </p>
        ) : null}
      </div>

      {/* Variant picker */}
      {variants.length > 1 ? (
        <div className="space-y-2.5">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Size
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const active = v.id === variantId;
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={!v.inStock}
                  aria-pressed={active}
                  onClick={() => setVariantId(v.id)}
                  className={cn(
                    "inline-flex flex-col items-start gap-0.5 rounded-[var(--radius-md)] border px-3 py-2 text-left text-[13px] font-semibold transition-all",
                    active
                      ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)] text-[var(--color-brand)]"
                      : v.inStock
                        ? "border-[var(--color-border)] bg-white text-[var(--color-foreground)] hover:border-[var(--color-brand)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] line-through",
                  )}
                >
                  <span>{v.name ?? "Default"}</span>
                  {v.price ? (
                    <span
                      className={cn(
                        "text-[12px] font-medium",
                        active
                          ? "text-[var(--color-brand)]"
                          : "text-[var(--color-muted)]",
                      )}
                    >
                      {formatMoney(v.price)}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Quantity */}
      <div className="space-y-2.5">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Quantity
        </p>
        <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-white">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid size-10 place-items-center rounded-l-full text-[var(--color-foreground)] hover:bg-[var(--color-surface)]"
          >
            <Minus className="size-4" />
          </button>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="h-10 w-14 bg-transparent text-center text-sm font-semibold focus:outline-none"
            aria-label="Quantity"
          />
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="grid size-10 place-items-center rounded-r-full text-[var(--color-foreground)] hover:bg-[var(--color-surface)]"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {isQuote ? null : (
          <AddToCartButton
            product={product}
            variant={variant}
            quantity={qty}
            size="lg"
          />
        )}
        <AddToQuoteButton
          product={product}
          variant={variant}
          quantity={qty}
          tone={isQuote ? "brand" : "outline"}
          size="lg"
          label={isQuote ? "Request a quote" : "Add to quote"}
        />
      </div>

      {/* Trust strip */}
      <ul className="grid gap-3 border-t border-[var(--color-border)] pt-6 text-[13px] text-[var(--color-muted-foreground)]">
        <li className="flex items-center gap-3">
          <ShieldCheck className="size-4 text-[var(--color-brand)]" aria-hidden />
          ISO 9001:2015 facilities · CoA + batch tracking with every shipment
        </li>
        <li className="flex items-center gap-3">
          <Truck className="size-4 text-[var(--color-brand)]" aria-hidden />
          Worldwide shipping · dry-ice option for thermolabile reagents
        </li>
        <li className="flex items-center gap-3">
          <FlaskConical className="size-4 text-[var(--color-brand)]" aria-hidden />
          Research Use Only — not for human or veterinary clinical use
        </li>
      </ul>
    </div>
  );
}
