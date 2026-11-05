"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Embeds the MetisSuite form "GlycoDepot - Glycosylation Brochure Request"
 * (form id DrCO). Submissions land as contacts in the GlycoDepot sub-account,
 * where the brochure is then emailed out manually.
 *
 * Why this is mounted by hand rather than with `next/script` or a plain JSX
 * <script>: both React 19 and next/script hoist script tags into <head>, which
 * breaks any embed that positions its iframe relative to `document.currentScript`.
 * Appending the node to our own container guarantees the form renders here.
 */

const EMBED_SRC = "https://app.metissuiteai.app/form-embed/v1.js";
const FORM_ID = "DrCO";
const FALLBACK_URL = `https://app.metissuiteai.app/f/${FORM_ID}`;
const LOAD_TIMEOUT_MS = 8000;

export function BrochureRequestForm() {
  const slotRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot || slot.childElementCount > 0) return;

    const script = document.createElement("script");
    script.src = EMBED_SRC;
    script.async = true;
    script.dataset.formId = FORM_ID;
    script.dataset.transparent = "1";
    script.addEventListener("error", () => setFailed(true));
    slot.appendChild(script);

    // If the embed never paints anything, show the direct link instead of a
    // blank panel.
    const timer = window.setTimeout(() => {
      if (slot.querySelector("iframe, form") === null) setFailed(true);
    }, LOAD_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-md)] sm:p-7">
      <div ref={slotRef} className="min-h-[520px]" />

      {failed ? (
        <p className="text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
          The request form could not load.{" "}
          <a
            href={FALLBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-brand)] underline"
          >
            Open it in a new tab
          </a>{" "}
          or email{" "}
          <a
            href="mailto:info@glycodepot.com?subject=Enzymatic%20glycosylation%20brochure"
            className="text-[var(--color-brand)] underline"
          >
            info@glycodepot.com
          </a>
          .
        </p>
      ) : null}

      <noscript>
        <p className="text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
          This form needs JavaScript. You can{" "}
          <a href={FALLBACK_URL} className="text-[var(--color-brand)] underline">
            open it directly
          </a>{" "}
          or email{" "}
          <a
            href="mailto:info@glycodepot.com?subject=Enzymatic%20glycosylation%20brochure"
            className="text-[var(--color-brand)] underline"
          >
            info@glycodepot.com
          </a>
          .
        </p>
      </noscript>
    </div>
  );
}
