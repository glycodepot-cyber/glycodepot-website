"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { QuoteListItem } from "@/lib/quote/store";

const FORM_ID = "kUrj";
const EMBED_ORIGIN = "https://app.metissuiteai.app";
const EMBED_SRC = `${EMBED_ORIGIN}/form-embed/v1.js`;
const READY_TIMEOUT_MS = 10000;

/**
 * How this embed actually communicates.
 *
 * This component previously listened for `endatix:form-loaded`,
 * `endatix:form-complete` and `endatix:form-error` on `window`. The vendor
 * script dispatches none of those: it contains no `dispatchEvent` and no
 * `CustomEvent` call anywhere, and the string "endatix" does not appear in it.
 * It communicates only by postMessage. So all three listeners were dead, which
 * meant the readiness spinner never cleared on the live page, and — far more
 * expensively — the completion callback never ran, so no Google Ads RFQ
 * conversion was ever recorded for a submitted quote request.
 *
 * Readiness is therefore detected by watching for the iframe the script
 * injects, rather than by waiting for an event that never arrives.
 *
 * Completion is best-effort: the script's only submission-shaped message type
 * is "submitted". That has been read out of the bundle but NOT yet observed on
 * a real submission, so treat the client-side conversion as a convenience and
 * keep server-side conversion forwarding from the CRM as the authoritative
 * record — it does not depend on this private protocol, an ad blocker, or the
 * browser staying open.
 */
function readSubmissionId(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;
  const record = data as Record<string, unknown>;
  if (record.type !== "submitted") return null;
  for (const key of ["submissionId", "submission_id", "id"]) {
    const value = record[key];
    if (typeof value === "string" && value) return value;
    if (typeof value === "number") return String(value);
  }
  return `metissuite-${Date.now()}`;
}

export function MetissuiteQuoteForm({
  items,
  onComplete,
}: {
  items: QuoteListItem[];
  onComplete: (submissionId: string) => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const productDetails = useMemo(
    () =>
      items
        .map(
          (item) =>
            `${item.quantity} × ${item.name}${
              item.variantName ? ` — ${item.variantName}` : ""
            }`,
        )
        .join("\n"),
    [items],
  );

  const prefill = useMemo(() => {
    const origin =
      typeof window === "undefined"
        ? "https://www.glycodepot.com"
        : window.location.origin;
    const quoteItems = items.map((item) => ({
      product_id: item.productId,
      variant_id: item.variantId ?? "",
      product_name: item.name,
      variation: item.variantName ?? "",
      quantity: item.quantity,
      product_url: new URL(item.href, origin).href,
    }));

    return new URLSearchParams({
      product_details: productDetails,
      products: productDetails,
      product: productDetails,
      quote_items: JSON.stringify(quoteItems),
      request_type: "RFQ",
      subject: "GlycoDepot quote request",
      source_page: "/quote-request",
      landing_page_url:
        typeof window === "undefined"
          ? "https://www.glycodepot.com/quote-request"
          : window.location.href,
    }).toString();
  }, [items, productDetails]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    setState("loading");
    mount.replaceChildren();

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== EMBED_ORIGIN) return;
      const submissionId = readSubmissionId(event.data);
      if (submissionId) onCompleteRef.current(submissionId);
    };
    window.addEventListener("message", handleMessage);

    const script = document.createElement("script");
    script.src = EMBED_SRC;
    script.async = true;
    script.dataset.formId = FORM_ID;
    script.dataset.transparent = "1";
    script.dataset.heightMode = "auto";
    script.dataset.prefill = prefill;
    script.onerror = () => setState("error");
    mount.appendChild(script);

    // MetisSuiteAI's supplied form-embed script currently omits data-prefill
    // variables from the generated iframe URL. Keep the vendor script (so its
    // resize and completion events still work), then copy the variables onto
    // the iframe URL once the script creates it.
    const applyPrefillToIframe = () => {
      const iframe = mount.querySelector("iframe");
      if (!iframe?.src) return;

      const iframeUrl = new URL(iframe.src);
      const params = new URLSearchParams(prefill);
      params.forEach((value, key) => iframeUrl.searchParams.set(key, value));

      const nextSrc = iframeUrl.toString();
      if (iframe.src !== nextSrc) iframe.src = nextSrc;
    };

    // The script dispatches no readiness event, so treat the appearance of the
    // iframe it injects as "ready" and fall back to the error panel if nothing
    // has rendered in time.
    const syncReadyState = () => {
      if (mount.querySelector("iframe")) setState("ready");
    };

    const observer = new MutationObserver(() => {
      applyPrefillToIframe();
      syncReadyState();
    });
    observer.observe(mount, { childList: true, subtree: true });
    applyPrefillToIframe();
    syncReadyState();

    const readyTimer = window.setTimeout(() => {
      if (!mount.querySelector("iframe")) setState("error");
    }, READY_TIMEOUT_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(readyTimer);
      window.removeEventListener("message", handleMessage);
      mount.replaceChildren();
    };
  }, [prefill]);

  return (
    <div className="space-y-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 lg:p-7">
      <div>
        <h2 className="type-h3 text-[var(--color-foreground)]">
          Billing and contact details
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-muted-foreground)]">
          Your selected products, variations and quantities are attached
          automatically. Complete the form below to submit your RFQ.
        </p>
      </div>

      <div className="rounded-[var(--radius-md)] bg-[var(--color-brand-soft)] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-[var(--color-brand)]">
          <CheckCircle2 className="size-4" aria-hidden />
          Products included with this request
        </p>
        <pre className="mt-2 whitespace-pre-wrap font-sans text-xs leading-relaxed text-[var(--color-muted-foreground)]">
          {productDetails}
        </pre>
      </div>

      {state === "loading" ? (
        <p className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Loading secure request form…
        </p>
      ) : null}

      {state === "error" ? (
        <div
          role="alert"
          className="flex gap-3 rounded-[var(--radius-md)] border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 p-4 text-sm"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-[var(--color-danger)]" />
          <p>
            The request form could not load. Please refresh the page or email{" "}
            <a className="font-semibold underline" href="mailto:info@glycodepot.com">
              info@glycodepot.com
            </a>
            .
          </p>
        </div>
      ) : null}

      <div ref={mountRef} data-metissuite-form={FORM_ID} />
    </div>
  );
}
