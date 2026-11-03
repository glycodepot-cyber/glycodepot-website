"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { QuoteListItem } from "@/lib/quote/store";

const FORM_ID = "kUrj";
const EMBED_SRC = "https://app.metissuiteai.app/form-embed/v1.js";

type EmbedEventDetail = {
  formId?: string;
  submissionId?: string;
  error?: { message?: string };
};

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

    const handleLoaded = (event: Event) => {
      const detail = (event as CustomEvent<EmbedEventDetail>).detail;
      if (detail?.formId === FORM_ID) setState("ready");
    };
    const handleComplete = (event: Event) => {
      const detail = (event as CustomEvent<EmbedEventDetail>).detail;
      if (detail?.formId !== FORM_ID) return;
      onCompleteRef.current(detail.submissionId ?? `metissuite-${Date.now()}`);
    };
    const handleError = (event: Event) => {
      const detail = (event as CustomEvent<EmbedEventDetail>).detail;
      if (detail?.formId === FORM_ID) setState("error");
    };

    window.addEventListener("endatix:form-loaded", handleLoaded);
    window.addEventListener("endatix:form-complete", handleComplete);
    window.addEventListener("endatix:form-error", handleError);

    const script = document.createElement("script");
    script.src = EMBED_SRC;
    script.async = true;
    script.dataset.formId = FORM_ID;
    script.dataset.transparent = "1";
    script.dataset.heightMode = "auto";
    script.dataset.prefill = prefill;
    script.onerror = () => setState("error");
    mount.appendChild(script);

    return () => {
      window.removeEventListener("endatix:form-loaded", handleLoaded);
      window.removeEventListener("endatix:form-complete", handleComplete);
      window.removeEventListener("endatix:form-error", handleError);
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
