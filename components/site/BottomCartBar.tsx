"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingCart, ListPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { onAdded, type AddedNotification } from "@/lib/notification";

export function BottomCartBar() {
  const [note, setNote] = useState<AddedNotification | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    return onAdded((n) => {
      setNote(n);
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), 4000);
    });
  }, []);

  if (!note) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[var(--z-toast)] px-4 pb-4 transition-transform duration-300 ease-out pointer-events-none",
        visible ? "translate-y-0" : "translate-y-[calc(100%+1rem)]",
      )}
    >
      <div className="mx-auto flex max-w-sm items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white px-4 py-3 shadow-[var(--shadow-lg)] pointer-events-auto">
        {/* Thumbnail or icon */}
        {note.image ? (
          <div className="size-10 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <Image
              src={note.image.src}
              alt={note.image.alt}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
            {note.type === "cart" ? (
              <ShoppingCart className="size-4" aria-hidden />
            ) : (
              <ListPlus className="size-4" aria-hidden />
            )}
          </div>
        )}

        {/* Label */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-[var(--color-foreground)]">
            {note.name}
            {note.variantName ? ` · ${note.variantName}` : ""}
          </p>
          <p className="text-[12px] text-[var(--color-muted)]">
            {note.type === "cart" ? "Added to cart" : "Added to quote list"}
          </p>
        </div>

        {/* View CTA — only for quotes; cart auto-opens its own sidebar */}
        {note.type === "quote" && (
          <Link
            href="/quote-request"
            onClick={dismiss}
            className="shrink-0 rounded-full bg-[var(--color-brand)] px-3.5 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[var(--color-brand-hover)]"
          >
            View
          </Link>
        )}

        {/* Dismiss */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss notification"
          className="grid size-7 shrink-0 place-items-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface)]"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
