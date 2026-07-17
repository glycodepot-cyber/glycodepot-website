"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/analytics/utm";

/**
 * Runs once on first client render to snapshot first-touch UTM/gclid
 * attribution into localStorage (see lib/analytics/utm.ts). Renders nothing.
 * Mounted globally in the root layout so it fires on whatever page the
 * visitor lands on — which is exactly where the campaign params live.
 */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
