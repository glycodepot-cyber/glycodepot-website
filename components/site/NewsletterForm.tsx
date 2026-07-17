"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { footerContent } from "@/lib/content";
import { subscribeNewsletter } from "@/lib/cart/actions";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    const result = await subscribeNewsletter(email);
    setStatus(result.ok ? "done" : "error");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1 focus-within:border-white/40">
        <input
          id="newsletter-email"
          type="email"
          required
          inputMode="email"
          autoComplete="email"
          placeholder={footerContent.newsletter.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "done"}
          className={cn(
            "min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none",
            status === "done" && "opacity-60",
          )}
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "done"}
          aria-label={footerContent.newsletter.submitLabel}
          className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
            status === "done"
              ? "bg-[var(--color-success)] text-white"
              : "bg-white text-[var(--color-brand)] hover:bg-[var(--color-brand-soft)]",
          )}
        >
          {status === "done" ? (
            <Check className="size-4" />
          ) : (
            <ArrowRight className="size-4" />
          )}
        </button>
      </div>
      {status === "done" ? (
        <p className="text-xs text-white/70">
          Thanks — you&rsquo;re on the list.
        </p>
      ) : null}
    </form>
  );
}
