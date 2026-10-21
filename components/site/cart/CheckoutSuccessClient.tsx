"use client";

import { useEffect, useRef } from "react";
import { clearCart } from "@/lib/cart/store";
import { trackPurchase } from "@/lib/analytics/dataLayer";
import type { PurchaseMeasurement } from "@/lib/payments/verifiedPurchase";

export function CheckoutSuccessClient({ purchase }: { purchase: PurchaseMeasurement | null }) {
  const tracked = useRef(false);
  useEffect(() => {
    if (!purchase || tracked.current) return;
    tracked.current = true;
    clearCart();
    trackPurchase(purchase);
  }, [purchase]);
  return null;
}
