import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Returns the href for a given page number. */
  hrefFor: (page: number) => string;
}

function buildPageWindow(page: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const out: (number | "…")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) out.push("…");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < totalPages - 1) out.push("…");
  out.push(totalPages);
  return out;
}

export function Pagination({ page, totalPages, hrefFor }: PaginationProps) {
  if (totalPages <= 1) return null;
  const window = buildPageWindow(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-1.5"
    >
      <PageLink
        href={page > 1 ? hrefFor(page - 1) : undefined}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" aria-hidden />
      </PageLink>

      {window.map((p, i) =>
        p === "…" ? (
          <span
            key={`gap-${i}`}
            aria-hidden
            className="px-1 text-[var(--color-muted)]"
          >
            …
          </span>
        ) : (
          <PageLink
            key={p}
            href={p === page ? undefined : hrefFor(p)}
            active={p === page}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </PageLink>
        ),
      )}

      <PageLink
        href={page < totalPages ? hrefFor(page + 1) : undefined}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" aria-hidden />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  active,
  children,
  ...rest
}: {
  href?: string;
  active?: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const cls = cn(
    "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors",
    active
      ? "bg-[var(--color-brand)] text-white"
      : "text-[var(--color-foreground)] hover:bg-[var(--color-surface)]",
    !href && !active && "pointer-events-none text-[var(--color-muted)] opacity-40",
  );
  if (!href || active) {
    return (
      <span className={cls} {...rest}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}
