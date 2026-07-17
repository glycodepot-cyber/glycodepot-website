"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav } from "@/lib/content";
import type { Category } from "@/lib/cart";
import { useQuoteList, getQuoteCount } from "@/lib/quote/store";
import { groupCategories } from "@/lib/content/category-groups";

interface MainNavProps {
  categories: Category[];
}

const MEGA_KEY = "/products";

export function MainNav({ categories }: MainNavProps) {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const quoteCount = getQuoteCount(useQuoteList());

  const clearTimer = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = useCallback(() => {
    clearTimer();
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 140);
  }, []);

  const openMega = () => {
    clearTimer();
    setMegaOpen(true);
  };

  // Close on Escape, close on outside click, close on route change
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMegaOpen(false);
    }
    function onDocClick(e: MouseEvent) {
      if (!navRef.current?.contains(e.target as Node)) setMegaOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDocClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDocClick);
    };
  }, []);

  useEffect(() => {
    setMegaOpen(false);
  }, [pathname]);

  return (
    <nav ref={navRef} aria-label="Primary" className="relative">
      <ul className="flex items-center gap-1">
        {mainNav.map((item) => {
          const isProducts = item.href === MEGA_KEY;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          if (isProducts) {
            return (
              <li
                key={item.href}
                onMouseEnter={openMega}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={megaOpen}
                  onClick={() => setMegaOpen((v) => !v)}
                  onFocus={openMega}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    isActive || megaOpen
                      ? "text-[var(--color-brand)]"
                      : "text-[var(--color-foreground)] hover:text-[var(--color-brand)]",
                  )}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-transform",
                      megaOpen && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
              </li>
            );
          }

          const isQuote = item.href === "/quote-request";
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-[var(--color-brand)]"
                    : "text-[var(--color-foreground)] hover:text-[var(--color-brand)]",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
                {isQuote && quoteCount > 0 ? (
                  <span
                    aria-label={`${quoteCount} items in quote list`}
                    className="grid min-w-[18px] place-items-center rounded-full bg-[var(--color-accent)] px-1 text-[11px] font-semibold leading-none text-white"
                    style={{ height: 18 }}
                  >
                    {quoteCount > 99 ? "99+" : quoteCount}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Mega panel — three-column hierarchy */}
      <div
        onMouseEnter={openMega}
        onMouseLeave={scheduleClose}
        className={cn(
          "absolute left-1/2 top-[calc(100%+12px)] w-screen max-w-[min(1280px,calc(100vw-2rem))] -translate-x-1/2",
          "z-[var(--z-dropdown)] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-lg)]",
          "origin-top transition-all duration-150",
          megaOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
        role="region"
        aria-label="Products mega menu"
        aria-hidden={!megaOpen}
      >
        <MegaPanel categories={categories} />
      </div>
    </nav>
  );
}

function MegaPanel({ categories }: { categories: Category[] }) {
  const groups = groupCategories(categories);

  // Show first 8 sub-categories per group, link to "View all" for the rest.
  const PER_GROUP = 10;

  return (
    <div className="p-6 lg:p-7">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr_0.8fr]">
        {groups.map(({ group, categories: groupCats }) => {
          const head = groupCats.slice(0, PER_GROUP);
          const totalCount = groupCats.reduce(
            (n, c) => n + (c.productCount ?? 0),
            0,
          );
          return (
            <div key={group.slug} className="min-w-0">
              <div className="mb-3 border-b border-[var(--color-border)] pb-2">
                <h3 className="type-h4 text-[var(--color-foreground)]">
                  {group.name}
                </h3>
                <p className="mt-1 text-[12px] text-[var(--color-muted)]">
                  {totalCount.toLocaleString()} products
                </p>
              </div>
              <ul className="flex flex-col gap-0.5">
                {head.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/products/${c.slug}`}
                      className="group flex items-baseline justify-between gap-3 rounded-[var(--radius-sm)] px-2 py-1.5 text-[13px] transition-colors hover:bg-[var(--color-surface)]"
                    >
                      <span className="line-clamp-1 font-medium text-[var(--color-foreground)] group-hover:text-[var(--color-brand)]">
                        {c.name}
                      </span>
                      {typeof c.productCount === "number" ? (
                        <span className="shrink-0 text-[11px] text-[var(--color-muted)]">
                          {c.productCount}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
              {groupCats.length > PER_GROUP ? (
                <Link
                  href={`/products?group=${group.slug}`}
                  className="mt-2 inline-flex items-center gap-1.5 px-2 text-[12px] font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]"
                >
                  + {groupCats.length - PER_GROUP} more
                  <ArrowUpRight className="size-3" aria-hidden />
                </Link>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-4">
        <p className="text-[13px] text-[var(--color-muted-foreground)]">
          {categories.length} categories · {categories.reduce((n, c) => n + (c.productCount ?? 0), 0).toLocaleString()} products
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]"
        >
          Browse all products
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
