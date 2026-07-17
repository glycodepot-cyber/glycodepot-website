"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Sticky wrapper around the header. Adds a subtle elevation + tighter padding
 * once the user has scrolled past the top — without causing layout shift.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--z-sticky)] bg-white transition-shadow duration-200",
        scrolled
          ? "shadow-[0_1px_0_var(--color-border),0_8px_24px_-12px_rgb(33_37_41_/_0.12)]"
          : "shadow-[0_1px_0_var(--color-border)]",
      )}
    >
      {children}
    </header>
  );
}
