import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type SectionTone = "default" | "surface" | "surface-2" | "brand-soft" | "brand";
type SectionSpacing = "default" | "tight" | "loose" | "none";

interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  tone?: SectionTone;
  spacing?: SectionSpacing;
}

const toneMap: Record<SectionTone, string> = {
  default: "bg-[var(--color-background)] text-[var(--color-foreground)]",
  surface: "bg-[var(--color-surface)] text-[var(--color-foreground)]",
  "surface-2": "bg-[var(--color-surface-2)] text-[var(--color-foreground)]",
  "brand-soft": "bg-[var(--color-brand-soft)] text-[var(--color-foreground)]",
  brand: "bg-[var(--color-brand)] text-white",
};

const spacingMap: Record<SectionSpacing, string> = {
  default: "py-8 sm:py-14 lg:py-18",
  tight: "py-6 sm:py-10 lg:py-12",
  loose: "py-12 sm:py-20 lg:py-24",
  none: "",
};

export function Section({
  tone = "default",
  spacing = "default",
  className,
  ...rest
}: SectionProps) {
  return (
    <section className={cn(toneMap[tone], spacingMap[spacing], className)} {...rest} />
  );
}
