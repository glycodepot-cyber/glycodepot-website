"use client";

import { useSyncExternalStore } from "react";

/**
 * Local order history — stored in the browser so customers can look up
 * orders they've placed even before we have a real GET /orders endpoint.
 * On checkout success we append an entry; the Order Tracking page and
 * My Account dashboard read from this store.
 */

const STORAGE_KEY = "gd_orders_v1";
const EVENT_NAME = "gd:orders-changed";

export interface LocalOrderLine {
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  quantity: number;
  unitPrice: number | null;
  image?: { src: string; alt: string };
  href: string;
}

export interface LocalOrder {
  orderId: string;
  placedAt: string;
  customerEmail: string;
  customerName: string;
  subtotal: number;
  lines: LocalOrderLine[];
}

function readFromStorage(): LocalOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeToStorage(orders: LocalOrder[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    // ignore (quota, private mode)
  }
}

const EMPTY: LocalOrder[] = [];

const listeners = new Set<() => void>();
let cache: LocalOrder[] = readFromStorage();

if (typeof window !== "undefined") {
  const refresh = () => {
    cache = readFromStorage();
    for (const l of listeners) l();
  };
  window.addEventListener(EVENT_NAME, refresh);
  window.addEventListener("storage", refresh);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useLocalOrders(): LocalOrder[] {
  return useSyncExternalStore(
    subscribe,
    () => cache,
    () => EMPTY,
  );
}

export function appendOrder(order: LocalOrder): LocalOrder[] {
  const orders = readFromStorage();
  orders.unshift(order);
  // Keep last 50.
  if (orders.length > 50) orders.length = 50;
  writeToStorage(orders);
  return orders;
}

export function findOrder(
  orderId: string,
  email: string,
): LocalOrder | null {
  const orders = readFromStorage();
  const norm = (s: string) => s.trim().toLowerCase();
  return (
    orders.find(
      (o) =>
        o.orderId === orderId.trim() &&
        norm(o.customerEmail) === norm(email),
    ) ?? null
  );
}
