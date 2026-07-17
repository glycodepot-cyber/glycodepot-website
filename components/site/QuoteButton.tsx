"use client";

import Link from "next/link";
import { ListPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuoteList, getQuoteCount } from "@/lib/quote/store";

interface QuoteButtonProps {
  className?: string;
}

export function QuoteButton({ className }: QuoteButtonProps) {
  const items = useQuoteList();
  const count = getQuoteCount(items);

  return (
    <Link
      href="/quote-request"
      aria-label={`View quote list${count ? ` — ${count} items` : ""}`}
      className={cn(
        "relative inline-flex size-10 items-center justify-center rounded-full text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-brand)]",
        className,
      )}
    >
      <ListPlus className="size-5" aria-hidden />
      {count > 0 ? (
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 grid min-w-[18px] place-items-center rounded-full bg-[var(--color-brand)] px-1 text-[11px] font-semibold leading-none text-white"
          style={{ height: 18 }}
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
