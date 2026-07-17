"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowRight, Lock } from "lucide-react";
import { BrandButton } from "@/components/primitives";
import { QtyStepper } from "./QtyStepper";
import { formatUSD } from "@/lib/format";
import {
  useCart,
  updateCartQty,
  removeCartItem,
  clearCart,
  getCartSubtotal,
  getCartCount,
} from "@/lib/cart/store";

export function CartView() {
  const items = useCart();
  const subtotal = getCartSubtotal(items);
  const count = getCartCount(items);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-strong)] bg-white p-12 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-[var(--color-surface)] text-[var(--color-muted)]">
          <ShoppingBag className="size-7" aria-hidden />
        </div>
        <div className="space-y-2">
          <h2 className="type-h3 text-[var(--color-foreground)]">
            Your cart is empty
          </h2>
          <p className="max-w-md text-[15px] text-[var(--color-muted-foreground)]">
            Browse the catalog and add products — they&rsquo;ll show up here.
          </p>
        </div>
        <BrandButton href="/products" size="lg">
          Browse products
        </BrandButton>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
      {/* Line items */}
      <div>
        <div className="flex items-center justify-between">
          <p className="text-[14px] text-[var(--color-muted-foreground)]">
            {count} {count === 1 ? "item" : "items"}
          </p>
          <button
            type="button"
            onClick={clearCart}
            className="text-[13px] font-medium text-[var(--color-muted)] hover:text-[var(--color-accent)]"
          >
            Clear cart
          </button>
        </div>

        <ul className="mt-4 divide-y divide-[var(--color-border)] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white">
          {items.map((item) => {
            const key = `${item.productId}:${item.variantId ?? ""}`;
            const lineTotal = (item.unitPrice ?? 0) * item.quantity;
            return (
              <li key={key} className="flex gap-4 p-4 sm:p-5">
                <Link
                  href={item.href}
                  className="relative size-20 shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]"
                >
                  {item.image ? (
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="80px"
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
                      <p className="mt-1 text-[13px] text-[var(--color-muted-foreground)]">
                        {item.unitPrice !== null
                          ? `${formatUSD(item.unitPrice)} each`
                          : "Quote item"}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() =>
                        removeCartItem(item.productId, item.variantId)
                      }
                      className="grid size-8 shrink-0 place-items-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)]"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <QtyStepper
                      value={item.quantity}
                      onChange={(q) =>
                        updateCartQty(item.productId, item.variantId, q)
                      }
                    />
                    <span className="text-[16px] font-bold text-[var(--color-foreground)]">
                      {formatUSD(lineTotal)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <Link
          href="/products"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]"
        >
          ← Continue shopping
        </Link>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 lg:p-7">
          <h2 className="type-h3 text-[var(--color-foreground)]">
            Order summary
          </h2>
          <dl className="mt-5 space-y-3 text-[15px]">
            <div className="flex items-center justify-between">
              <dt className="text-[var(--color-muted-foreground)]">Subtotal</dt>
              <dd className="font-semibold text-[var(--color-foreground)]">
                {formatUSD(subtotal)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[var(--color-muted-foreground)]">Shipping</dt>
              <dd className="text-[var(--color-muted)]">
                Calculated at checkout
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[var(--color-muted-foreground)]">Tax</dt>
              <dd className="text-[var(--color-muted)]">
                Calculated at checkout
              </dd>
            </div>
          </dl>
          <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-5">
            <span className="font-semibold text-[var(--color-foreground)]">
              Estimated total
            </span>
            <span className="text-[20px] font-bold text-[var(--color-foreground)]">
              {formatUSD(subtotal)}
            </span>
          </div>
          <BrandButton href="/checkout" size="lg" className="mt-6 w-full">
            Proceed to checkout
            <ArrowRight className="size-4" aria-hidden />
          </BrandButton>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-[var(--color-muted)]">
            <Lock className="size-3" aria-hidden />
            Secure checkout
          </p>
        </div>
      </aside>
    </div>
  );
}
