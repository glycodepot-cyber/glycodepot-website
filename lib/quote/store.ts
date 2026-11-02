"use client";

import { useSyncExternalStore } from "react";
import type { Product, ProductVariant } from "@/lib/cart";
import { trackAddToCart } from "@/lib/analytics/dataLayer";
import { scopedStorageKey, SCOPE_EVENT } from "@/lib/commerce/scope";

const STORAGE_KEY = "gd_quote_list_v2";
const EVENT_NAME = "gd:quote-changed";

export interface QuoteListItem {
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  quantity: number;
  image?: { src: string; alt: string };
  price: number | null;
  href: string;
}

type Listener = () => void;
const listeners = new Set<Listener>();

function readFromStorage(): QuoteListItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(scopedStorageKey(STORAGE_KEY));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QuoteListItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeToStorage(items: QuoteListItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(scopedStorageKey(STORAGE_KEY), JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    // quota / private-mode — ignore
  }
}

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  const onChange = () => listener();
  if (typeof window !== "undefined") {
    window.addEventListener(EVENT_NAME, onChange);
    window.addEventListener("storage", onChange);
    window.addEventListener(SCOPE_EVENT, onChange);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener(EVENT_NAME, onChange);
      window.removeEventListener("storage", onChange);
      window.removeEventListener(SCOPE_EVENT, onChange);
    }
  };
}

function getSnapshot(): QuoteListItem[] {
  return cache;
}
const EMPTY_QUOTE: QuoteListItem[] = [];

function getServerSnapshot(): QuoteListItem[] {
  return EMPTY_QUOTE;
}

// Module-level cache so getSnapshot returns the same reference until storage changes.
let cache: QuoteListItem[] = readFromStorage();
if (typeof window !== "undefined") {
  window.addEventListener(EVENT_NAME, () => {
    cache = readFromStorage();
    emit();
  });
  window.addEventListener("storage", () => {
    cache = readFromStorage();
    emit();
  });
  window.addEventListener(SCOPE_EVENT, () => {
    cache = readFromStorage();
    emit();
  });
}

export function useQuoteList(): QuoteListItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function getQuoteCount(items: QuoteListItem[]): number {
  return items.reduce((n, i) => n + i.quantity, 0);
}

export function addToQuote(
  product: Product,
  variant?: ProductVariant,
  quantity = 1,
): QuoteListItem[] {
  const items = readFromStorage();
  const variantId = variant?.id;
  const idx = items.findIndex(
    (i) => i.productId === product.id && i.variantId === variantId,
  );
  if (idx >= 0) {
    items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
  } else {
    const primaryCat = product.primaryCategoryId
      ? product.categories.find((c) => c === product.primaryCategoryId)
      : product.categories[0];
    items.push({
      productId: product.id,
      variantId,
      name: product.name,
      variantName: variant?.name,
      quantity,
      image: product.images[0],
      price: (variant?.price ?? product.price)?.amount ?? null,
      href: `/products/${slugForCategory(primaryCat)}/${product.slug}`,
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

export function updateQuoteQuantity(
  productId: string,
  variantId: string | undefined,
  quantity: number,
): QuoteListItem[] {
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

export function removeFromQuote(
  productId: string,
  variantId: string | undefined,
): QuoteListItem[] {
  const items = readFromStorage().filter(
    (i) => !(i.productId === productId && i.variantId === variantId),
  );
  writeToStorage(items);
  return items;
}

export function clearQuote(): QuoteListItem[] {
  writeToStorage([]);
  return [];
}

/**
 * Map a category id to its slug. We keep this local to avoid an async dep
 * inside a synchronous store action. Update if cat ids ever drift from slugs.
 */
function slugForCategory(catId: string | undefined): string {
  if (!catId) return "all";
  return (
    {
      cat_sugar_nuc: "sugar-nucleotides",
      cat_glycoenzymes: "glycoenzymes",
      cat_oligos: "oligosaccharides",
      cat_arrays: "arrays",
      cat_hmos: "hmos",
      cat_cyclodextrins: "cyclodextrins",
    }[catId] ?? "all"
  );
}
