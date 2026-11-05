"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mounts a MetisSuite hosted form inside this container.
 *
 * Why the script is appended by hand rather than with `next/script` or a plain
 * JSX <script>: both React 19 and next/script hoist script tags into <head>,
 * which breaks any embed that positions its iframe relative to
 * `document.currentScript`. Appending the node to our own container guarantees
 * the form renders where we put it.
 *
 * Note for anyone adding a new embed: the form's origin
 * (https://app.metissuiteai.app) must be present in `script-src`, `connect-src`
 * and `frame-src` in the CSP in next.config.ts, or the browser blocks the
 * script and the panel renders blank.
 */

const EMBED_SRC = "https://app.metissuiteai.app/form-embed/v1.js";
const LOAD_TIMEOUT_MS = 8000;

export interface MetisFormEmbedProps {
  /** The form's public slug, e.g. "DrCO". */
  formId: string;
  /** Reserved height so the page doesn't jump while the embed loads. */
  minHeight?: number;
  /** Subject line for the mailto fallback. */
  fallbackSubject: string;
  /** What to call the form in the fallback copy, e.g. "request form". */
  fallbackLabel?: string;
}

export function MetisFormEmbed({
  formId,
  minHeight = 520,
  fallbackSubject,
  fallbackLabel = "form",
}: MetisFormEmbedProps) {
  const slotRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  const directUrl = `https://app.metissuiteai.app/f/${formId}`;
  const mailto = `mailto:info@glycodepot.com?subject=${encodeURIComponent(
    fallbackSubject,
  )}`;

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot || slot.childElementCount > 0) return;

    const script = document.createElement("script");
    script.src = EMBED_SRC;
    script.async = true;
    script.dataset.formId = formId;
    script.dataset.transparent = "1";
    script.addEventListener("error", () => setFailed(true));
    slot.appendChild(script);

    // If the embed never paints anything, show the direct link instead of a
    // blank panel.
    const timer = window.setTimeout(() => {
      if (slot.querySelector("iframe, form") === null) setFailed(true);
    }, LOAD_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [formId]);

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-md)] sm:p-7">
      <div ref={slotRef} style={{ minHeight }} />

      {failed ? (
        <p className="text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
          The {fallbackLabel} could not load.{" "}
          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-brand)] underline"
          >
            Open it in a new tab
          </a>{" "}
          or email{" "}
          <a href={mailto} className="text-[var(--color-brand)] underline">
            info@glycodepot.com
          </a>
          .
        </p>
      ) : null}

      <noscript>
        <p className="text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
          This form needs JavaScript. You can{" "}
          <a href={directUrl} className="text-[var(--color-brand)] underline">
            open it directly
          </a>{" "}
          or email{" "}
          <a href={mailto} className="text-[var(--color-brand)] underline">
            info@glycodepot.com
          </a>
          .
        </p>
      </noscript>
    </div>
  );
}
