"use client";

import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart, getCartCount, openCart } from "@/lib/cart/store";

interface CartButtonProps {
  className?: string;
}

/**
 * Header cart icon — opens the cart drawer and shows a live item count.
 * Count comes from the local cart store until the real cart API is wired.
 */
export function CartButton({ className }: CartButtonProps) {
  const items = useCart();
  const count = getCartCount(items);

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open cart${count ? ` — ${count} items` : ""}`}
      className={cn(
        "relative inline-flex size-10 items-center justify-center rounded-full text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-brand)]",
        className,
      )}
    >
      <ShoppingCart className="size-5" aria-hidden />
      {count > 0 ? (
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 grid min-w-[18px] place-items-center rounded-full bg-[var(--color-accent)] px-1 text-[11px] font-semibold leading-none text-white"
          style={{ height: 18 }}
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  );
}
