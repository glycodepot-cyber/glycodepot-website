"use client";

import { useSyncExternalStore } from "react";
import type { Product, ProductVariant } from "./types";
import { trackAddToCart } from "@/lib/analytics/dataLayer";
import { scopedStorageKey, SCOPE_EVENT } from "@/lib/commerce/scope";

/**
 * Local cart store — localStorage-backed, hydration-safe.
 *
 * This gives the front end a fully working cart for demos before the real
 * cart API key lands. When it does, swap the persistence calls here (and in
 * lib/cart/client.ts) for the live endpoints; component code stays the same.
 */

const STORAGE_KEY = "gd_cart_v2";
const EVENT_NAME = "gd:cart-changed";

export interface CartItemLocal {
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  unitPrice: number | null;
  quantity: number;
  image?: { src: string; alt: string };
  href: string;
  requiresDryIce?: boolean;
}

/* ----------------- persistence ----------------- */

function readFromStorage(): CartItemLocal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(scopedStorageKey(STORAGE_KEY));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItemLocal[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeToStorage(items: CartItemLocal[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(scopedStorageKey(STORAGE_KEY), JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    // quota / private mode — ignore
  }
}

/* ----------------- reactive items ----------------- */

const EMPTY_CART: CartItemLocal[] = [];

const itemListeners = new Set<() => void>();
let itemCache: CartItemLocal[] = readFromStorage();

if (typeof window !== "undefined") {
  const refresh = () => {
    itemCache = readFromStorage();
    for (const l of itemListeners) l();
  };
  window.addEventListener(EVENT_NAME, refresh);
  window.addEventListener("storage", refresh);
  window.addEventListener(SCOPE_EVENT, refresh);
}

function subscribeItems(listener: () => void) {
  itemListeners.add(listener);
  return () => itemListeners.delete(listener);
}

export function useCart(): CartItemLocal[] {
  return useSyncExternalStore(
    subscribeItems,
    () => itemCache,
    () => EMPTY_CART,
  );
}

export function getCartCount(items: CartItemLocal[]): number {
  return items.reduce((n, i) => n + i.quantity, 0);
}

export function getCartSubtotal(items: CartItemLocal[]): number {
  return items.reduce(
    (sum, i) => sum + (i.unitPrice ?? 0) * i.quantity,
    0,
  );
}

/* ----------------- mutations ----------------- */

const CATEGORY_SLUGS: Record<string, string> = {
  cat_sugar_nuc: "sugar-nucleotides",
  cat_glycoenzymes: "glycoenzymes",
  cat_oligos: "oligosaccharides",
  cat_arrays: "arrays",
  cat_hmos: "hmos",
  cat_cyclodextrins: "cyclodextrins",
};

function hrefFor(product: Product): string {
  const cat = product.primaryCategoryId ?? product.categories[0];
  return `/products/${CATEGORY_SLUGS[cat ?? ""] ?? "all"}/${product.slug}`;
}

export function addCartItem(
  product: Product,
  variant?: ProductVariant,
  quantity = 1,
): CartItemLocal[] {
  const items = readFromStorage();
  const variantId = variant?.id;
  const idx = items.findIndex(
    (i) => i.productId === product.id && i.variantId === variantId,
  );
  if (idx >= 0) {
    items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
  } else {
    items.push({
      productId: product.id,
      variantId,
      name: product.name,
      variantName: variant?.name,
      unitPrice: (variant?.price ?? product.price)?.amount ?? null,
      quantity,
      image: product.images[0],
      href: hrefFor(product),
      requiresDryIce: product.requiresDryIce,
    });
  }
  writeToStorage(items);
  trackAddToCart({
    productId: product.id,
    productName: product.name,
    variantName: variant?.name,
    value: (variant?.price ?? product.price)?.amount ?? undefined,
  });
  return items;
}

export function updateCartQty(
  productId: string,
  variantId: string | undefined,
  quantity: number,
): CartItemLocal[] {
  let items = readFromStorage();
  if (quantity <= 0) {
    items = items.filter(
      (i) => !(i.productId === productId && i.variantId === variantId),
    );
  } else {
    items = items.map((i) =>
      i.productId === productId && i.variantId === variantId
        ? { ...i, quantity }
        : i,
    );
  }
  writeToStorage(items);
  return items;
}

export function removeCartItem(
  productId: string,
  variantId: string | undefined,
): CartItemLocal[] {
  const items = readFromStorage().filter(
    (i) => !(i.productId === productId && i.variantId === variantId),
  );
  writeToStorage(items);
  return items;
}

export function clearCart(): CartItemLocal[] {
  writeToStorage([]);
  return [];
}

/* ----------------- drawer open state ----------------- */

const drawerListeners = new Set<() => void>();
let drawerOpen = false;

function emitDrawer() {
  for (const l of drawerListeners) l();
}

function subscribeDrawer(listener: () => void) {
  drawerListeners.add(listener);
  return () => drawerListeners.delete(listener);
}

export function useCartDrawerOpen(): boolean {
  return useSyncExternalStore(
    subscribeDrawer,
    () => drawerOpen,
    () => false,
  );
}

export function setCartOpen(open: boolean) {
  drawerOpen = open;
  emitDrawer();
}

export function openCart() {
  setCartOpen(true);
}

export function closeCart() {
  setCartOpen(false);
}
