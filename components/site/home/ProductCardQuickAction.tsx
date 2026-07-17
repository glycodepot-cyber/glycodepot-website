"use client";

import { useState, useTransition } from "react";
import { ShoppingCart, ListPlus, Check } from "lucide-react";
import type { Product } from "@/lib/cart";
import { addCartItem, openCart } from "@/lib/cart/store";
import { addToQuote } from "@/lib/quote/store";
import { emitAdded } from "@/lib/notification";
import { cn } from "@/lib/utils";

interface ProductCardQuickActionProps {
  product: Product;
}

/**
 * Top-right pill on product cards. Adds the product (first in-stock variant,
 * or the first variant if none in stock) to either the cart or the quote
 * list — whichever fits the product's price state.
 *
 * Sits absolutely-positioned over the card. The whole card is also a link;
 * this button stops propagation so clicking the pill doesn't navigate.
 */
export function ProductCardQuickAction({ product }: ProductCardQuickActionProps) {
  const isQuote = product.price === null;
  const variant =
    product.variants.find((v) => v.inStock) ?? product.variants[0];
  const [added, setAdded] = useState(false);
  const [loading, startTransition] = useTransition();

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (loading || added) return;
    startTransition(() => {
      if (isQuote) {
        addToQuote(product, variant);
        emitAdded({
          type: "quote",
          name: product.name,
          variantName: variant?.name,
          image: product.images[0],
        });
      } else {
        addCartItem(product, variant);
        openCart();
        emitAdded({
          type: "cart",
          name: product.name,
          variantName: variant?.name,
          image: product.images[0],
        });
      }
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1800);
    });
  }

  const label = added ? "Added" : isQuote ? "Quote" : "Cart";
  const Icon = added
    ? Check
    : isQuote
      ? ListPlus
      : ShoppingCart;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      aria-label={
        added
          ? `${product.name} added`
          : isQuote
            ? `Add ${product.name} to quote list`
            : `Add ${product.name} to cart`
      }
      className={cn(
        "absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-semibold shadow-[var(--shadow-sm)] backdrop-blur-sm transition-colors",
        added
          ? "bg-[var(--color-success)] text-white"
          : "bg-white/90 text-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-white",
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {label}
    </button>
  );
}
