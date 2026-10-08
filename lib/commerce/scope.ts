"use client";

const SCOPE_KEY = "gd_active_commerce_scope";
export const SCOPE_EVENT = "gd:commerce-scope-changed";

export function commerceScope(): string {
  if (typeof window === "undefined") return "guest";
  return window.localStorage.getItem(SCOPE_KEY) || "guest";
}

export function scopedStorageKey(base: string): string {
  return `${base}:${commerceScope()}`;
}

export function setCommerceScope(userId: string | null | undefined) {
  if (typeof window === "undefined") return;
  const next = userId ? `user:${userId}` : "guest";
  if (commerceScope() === next) return;
  window.localStorage.setItem(SCOPE_KEY, next);
  window.dispatchEvent(new CustomEvent(SCOPE_EVENT));
}
