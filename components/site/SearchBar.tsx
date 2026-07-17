"use client";

import { useState, useRef, useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { popularSearches, searchPlaceholder } from "@/lib/content";

interface SearchBarProps {
  variant?: "header" | "mobile";
  className?: string;
}

export function SearchBar({ variant = "header", className }: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setFocused(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function submit(term: string) {
    const q = term.trim();
    if (!q) return;
    router.push(`/products?search=${encodeURIComponent(q)}`);
    setFocused(false);
    setValue("");
  }

  return (
    <div
      ref={wrapperRef}
      className={cn("relative w-full", className)}
      data-variant={variant}
    >
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
        className="relative"
      >
        <label htmlFor={`${listboxId}-input`} className="sr-only">
          Search products
        </label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted)]"
          aria-hidden
        />
        <input
          id={`${listboxId}-input`}
          type="search"
          inputMode="search"
          autoComplete="off"
          placeholder={searchPlaceholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          aria-expanded={focused}
          aria-controls={`${listboxId}-list`}
          className={cn(
            "h-11 w-full rounded-full border border-[var(--color-border)] bg-white pl-11 pr-12 text-sm",
            "placeholder:text-[var(--color-muted)]",
            "transition-colors hover:border-[var(--color-border-strong)]",
            "focus:border-[var(--color-brand)] focus:outline-none focus:ring-0",
          )}
        />
        {value ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setValue("")}
            className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </form>

      {focused ? (
        <div
          id={`${listboxId}-list`}
          role="listbox"
          aria-label="Popular searches"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-[var(--z-dropdown)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-md)]"
        >
          <div className="px-4 pt-3 pb-1.5">
            <span className="type-overline text-[var(--color-muted)]">
              Popular searches
            </span>
          </div>
          <ul className="flex flex-wrap gap-2 px-4 pb-4">
            {popularSearches.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  role="option"
                  aria-selected="false"
                  onMouseDown={(e) => {
                    // mousedown beats blur on the input
                    e.preventDefault();
                    submit(tag);
                  }}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-foreground)] transition-colors hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-soft)] hover:text-[var(--color-brand)]"
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
