"use client";

import { useEffect } from "react";
import { clearCart } from "@/lib/cart/store";

export function CheckoutSuccessClient() {
  useEffect(() => {
    clearCart();
  }, []);
  return null;
}
