"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Trash2, X, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BrandButton } from "@/components/primitives";
import { QtyStepper } from "./QtyStepper";
import { formatUSD } from "@/lib/format";
import {
  useCart,
  useCartDrawerOpen,
  setCartOpen,
  closeCart,
  updateCartQty,
  removeCartItem,
  getCartSubtotal,
  getCartCount,
} from "@/lib/cart/store";

export function CartDrawer() {
  const open = useCartDrawerOpen();
  const items = useCart();
  const subtotal = getCartSubtotal(items);
  const count = getCartCount(items);

  return (
    <Sheet open={open} onOpenChange={setCartOpen}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-[92vw] max-w-[440px] flex-col gap-0 bg-white p-0 sm:max-w-[440px]"
      >
        <SheetHeader className="flex-row items-center justify-between border-b border-[var(--color-border)] p-5">
          <SheetTitle className="flex items-center gap-2 text-[var(--color-foreground)]">
            <ShoppingBag className="size-4 text-[var(--color-brand)]" aria-hidden />
            Your cart
            {count > 0 ? (
              <span className="rounded-full bg-[var(--color-brand-soft)] px-2 py-0.5 text-[12px] font-semibold text-[var(--color-brand)]">
                {count}
              </span>
            ) : null}
          </SheetTitle>
          <button
            type="button"
            aria-label="Close cart"
            onClick={closeCart}
            className="grid size-8 place-items-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
          >
            <X className="size-4" />
          </button>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 p-8 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-[var(--color-surface)] text-[var(--color-muted)]">
              <ShoppingBag className="size-7" aria-hidden />
            </div>
            <div className="space-y-1">
              <p className="type-h4 text-[var(--color-foreground)]">
                Your cart is empty
              </p>
              <p className="text-[14px] text-[var(--color-muted-foreground)]">
                Add products to get started.
              </p>
            </div>
            <BrandButton href="/products" onClick={closeCart}>
              Browse products
            </BrandButton>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-[var(--color-border)] overflow-y-auto px-5">
              {items.map((item) => {
                const key = `${item.productId}:${item.variantId ?? ""}`;
                const lineTotal = (item.unitPrice ?? 0) * item.quantity;
                return (
                  <li key={key} className="flex gap-3 py-4">
                    <Link
                      href={item.href}
                      onClick={closeCart}
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
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={item.href}
                            onClick={closeCart}
                            className="line-clamp-2 text-[14px] font-semibold text-[var(--color-foreground)] hover:text-[var(--color-brand)]"
                          >
                            {item.name}
                          </Link>
                          {item.variantName ? (
                            <p className="text-[12px] text-[var(--color-muted)]">
                              {item.variantName}
                            </p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${item.name}`}
                          onClick={() =>
                            removeCartItem(item.productId, item.variantId)
                          }
                          className="grid size-7 shrink-0 place-items-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)]"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <QtyStepper
                          value={item.quantity}
                          size="sm"
                          onChange={(q) =>
                            updateCartQty(item.productId, item.variantId, q)
                          }
                        />
                        <span className="text-[14px] font-semibold text-[var(--color-foreground)]">
                          {formatUSD(lineTotal)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-4 border-t border-[var(--color-border)] p-5">
              <div className="flex items-center justify-between text-[15px]">
                <span className="text-[var(--color-muted-foreground)]">
                  Subtotal
                </span>
                <span className="text-[18px] font-bold text-[var(--color-foreground)]">
                  {formatUSD(subtotal)}
                </span>
              </div>
              <p className="text-[12px] text-[var(--color-muted)]">
                Taxes and shipping calculated at checkout.
              </p>
              <div className="grid gap-2">
                <BrandButton href="/checkout" size="lg" onClick={closeCart} className="w-full">
                  Checkout
                  <ArrowRight className="size-4" aria-hidden />
                </BrandButton>
                <BrandButton
                  href="/cart"
                  tone="outline"
                  onClick={closeCart}
                  className="w-full"
                >
                  View full cart
                </BrandButton>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
