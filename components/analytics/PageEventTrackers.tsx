"use client";

import { useEffect } from "react";
import {
  trackQuotePageView,
  trackHighIntentVisit,
} from "@/lib/analytics/dataLayer";

/** §4.1 Quote_Page_View — fires once when /quote-request mounts. Renders nothing. */
export function QuotePageViewTracker() {
  useEffect(() => {
    trackQuotePageView();
  }, []);
  return null;
}

/**
 * §4.1 High_Intent_Visit — fires once after 60s of continuous time on a
 * product page (GA4 audience signal). The timer is cleared on unmount so a
 * quick bounce never counts; per-product identity avoids double-firing when
 * navigating between products.
 */
export function ProductDwellTracker({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      trackHighIntentVisit({ productId, productName });
    }, 60_000);
    return () => clearTimeout(timer);
  }, [productId, productName]);
  return null;
}
