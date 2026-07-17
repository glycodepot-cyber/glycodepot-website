import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

interface EyebrowProps extends ComponentPropsWithoutRef<"span"> {
  tone?: "brand" | "accent" | "muted";
}

const toneMap = {
  brand: "text-[var(--color-brand)]",
  accent: "text-[var(--color-accent)]",
  muted: "text-[var(--color-muted)]",
} as const;

export function Eyebrow({ tone = "brand", className, ...rest }: EyebrowProps) {
  return (
    <span
      className={cn("type-overline inline-block", toneMap[tone], className)}
      {...rest}
    />
  );
}
