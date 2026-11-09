"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductVariant } from "@/lib/cart";
import { addCartItem } from "@/lib/cart/store";

interface CartAddFromUrlProps {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

/**
 * Adds one line to the cart from URL parameters, then hands the shopper to the
 * cart page.
 *
 * The cart lives in localStorage (lib/cart/store.ts), so there is no way to add
 * to it from the server — the write has to happen in the browser. The guarding
 * ref matters: without it React's development double-invoke, and any re-render
 * before the navigation commits, would each add the line again.
 */
export function CartAddFromUrl({
  product,
  variant,
  quantity,
}: CartAddFromUrlProps) {
  const router = useRouter();
  const added = useRef(false);

  useEffect(() => {
    if (added.current) return;
    added.current = true;
    addCartItem(product, variant, quantity);
    router.replace("/cart");
  }, [product, variant, quantity, router]);

  return null;
}
