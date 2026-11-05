"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { footerContent } from "@/lib/content";
import { NEWSLETTER_CONSENT_TEXT } from "@/lib/content/consent";
import { subscribeNewsletter } from "@/lib/cart/actions";

export function NewsletterForm() {
  const consentId = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    if (!consent) {
      setError("Please tick the consent box so we know you want these emails.");
      return;
    }
    setStatus("loading");
    setError(null);
    const result = await subscribeNewsletter(email, consent);
    if (result.ok) {
      setStatus("done");
    } else {
      setStatus("error");
      setError(result.error);
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="space-y-2">
        <p className="flex items-center gap-2 text-sm font-medium text-white">
          <span className="grid size-5 place-items-center rounded-full bg-[var(--color-success)]">
            <Check className="size-3" aria-hidden />
          </span>
          Check your inbox
        </p>
        <p className="text-xs leading-relaxed text-white/70">
          We&rsquo;ve emailed <span className="text-white/90">{email}</span> a
          confirmation link. Click it to finish subscribing — we won&rsquo;t
          send anything until you do.
        </p>
      </div>
    );
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
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label={footerContent.newsletter.submitLabel}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-brand)] transition-colors hover:bg-[var(--color-brand-soft)] disabled:opacity-60"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>

      <div className="flex gap-2.5">
        <input
          id={consentId}
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            if (e.target.checked) setError(null);
          }}
          className="mt-0.5 size-3.5 shrink-0 accent-[var(--color-brand-soft)]"
          aria-describedby={`${consentId}-note`}
        />
        <label
          htmlFor={consentId}
          className="text-[11px] leading-relaxed text-white/70"
        >
          {NEWSLETTER_CONSENT_TEXT}
        </label>
      </div>

      <p id={`${consentId}-note`} className="text-[11px] text-white/50">
        We use your address only to send these updates. See our{" "}
        <Link
          href="/legal/privacy"
          className="underline underline-offset-2 hover:text-white/80"
        >
          privacy notice
        </Link>{" "}
        or{" "}
        <Link
          href="/unsubscribe"
          className="underline underline-offset-2 hover:text-white/80"
        >
          unsubscribe
        </Link>
        .
      </p>

      {error ? (
        <p role="alert" className="text-[11px] text-[var(--color-danger)]">
          {error}
        </p>
      ) : null}
    </form>
  );
}
