"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "gd_recent_v1";
const EVENT_NAME = "gd:recent-changed";
const MAX = 12;

export interface RecentItem {
  id: string;
  slug: string;
  name: string;
  href: string;
  image?: { src: string; alt: string };
  priceLabel: string | null;
}

function read(): RecentItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: RecentItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    // ignore
  }
}

const EMPTY: RecentItem[] = [];
const listeners = new Set<() => void>();
let cache: RecentItem[] = read();

if (typeof window !== "undefined") {
  const refresh = () => {
    cache = read();
    for (const l of listeners) l();
  };
  window.addEventListener(EVENT_NAME, refresh);
  window.addEventListener("storage", refresh);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useRecentlyViewed(): RecentItem[] {
  return useSyncExternalStore(
    subscribe,
    () => cache,
    () => EMPTY,
  );
}

export function trackView(item: RecentItem) {
  const items = read().filter((i) => i.id !== item.id);
  items.unshift(item);
  if (items.length > MAX) items.length = MAX;
  write(items);
}
