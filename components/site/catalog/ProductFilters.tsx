"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useId } from "react";
import { Search, X, ArrowUpDown } from "lucide-react";

interface ProductFiltersProps {
  resultCount: number;
  totalCount: number;
}

const SORT_OPTIONS = [
  { value: "popular", label: "Popular first" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price — low to high" },
  { value: "price-desc", label: "Price — high to low" },
];

export function ProductFilters({ resultCount, totalCount }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const labelId = useId();

  const initialSearch = params.get("search") ?? "";
  const currentSort = params.get("sort") ?? "popular";

  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value && value.length) next.set(key, value);
    else next.delete(key);
    next.delete("page"); // reset to first page on any filter change
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setParam("search", search.trim() || null);
  }

  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={onSearchSubmit} role="search" className="relative flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted)]"
          />
          <input
            type="search"
            autoComplete="off"
            placeholder="Search this catalog…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-full border border-[var(--color-border)] bg-white pl-10 pr-10 text-sm placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand)] focus:outline-none"
          />
          {search ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setSearch("");
                setParam("search", null);
              }}
              className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </form>

        <div className="flex items-center gap-2">
          <label
            id={labelId}
            htmlFor="sort-select"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-muted-foreground)]"
          >
            <ArrowUpDown className="size-3.5" aria-hidden />
            Sort
          </label>
          <select
            id="sort-select"
            aria-labelledby={labelId}
            value={currentSort}
            onChange={(e) => setParam("sort", e.target.value)}
            className="h-10 rounded-full border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-foreground)] focus:border-[var(--color-brand)] focus:outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-[13px] text-[var(--color-muted)] sm:shrink-0">
        Showing <strong className="font-semibold text-[var(--color-foreground)]">{resultCount}</strong> of{" "}
        <strong className="font-semibold text-[var(--color-foreground)]">{totalCount}</strong>
      </p>
    </div>
  );
}
