import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/cart";
import { cn } from "@/lib/utils";

interface CategoryRailProps {
  categories: Category[];
  activeSlug?: string;
}

export function CategoryRail({ categories, activeSlug }: CategoryRailProps) {
  return (
    <nav aria-label="Browse by category" className="overflow-x-auto">
      <ul className="flex flex-nowrap gap-2 pb-2 sm:flex-wrap sm:pb-0">
        <li className="shrink-0">
          <Link
            href="/products"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              !activeSlug
                ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
                : "border-[var(--color-border)] bg-white text-[var(--color-foreground)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]",
            )}
          >
            All products
          </Link>
        </li>
        {categories.map((c) => {
          const active = c.slug === activeSlug;
          return (
            <li key={c.id} className="shrink-0">
              <Link
                href={`/products/${c.slug}`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
                    : "border-[var(--color-border)] bg-white text-[var(--color-foreground)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]",
                )}
              >
                {c.name}
                {typeof c.productCount === "number" ? (
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[11px] font-semibold",
                      active
                        ? "bg-white/20 text-white"
                        : "bg-[var(--color-surface)] text-[var(--color-muted)]",
                    )}
                  >
                    {c.productCount}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((c) => (
        <li key={c.id}>
          <Link
            href={`/products/${c.slug}`}
            className="group flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-md)]"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="type-h4 text-[var(--color-foreground)] group-hover:text-[var(--color-brand)]">
                {c.name}
              </h3>
              {typeof c.productCount === "number" ? (
                <span className="shrink-0 rounded-full bg-[var(--color-surface)] px-2 py-1 text-[12px] font-semibold text-[var(--color-muted)]">
                  {c.productCount}
                </span>
              ) : null}
            </div>
            {c.description ? (
              <p className="text-[14px] leading-relaxed text-[var(--color-muted-foreground)]">
                {c.description}
              </p>
            ) : null}
            <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)]">
              Browse {c.name}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
