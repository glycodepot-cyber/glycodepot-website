"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QtyStepperProps {
  value: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
  className?: string;
}

export function QtyStepper({
  value,
  onChange,
  size = "md",
  className,
}: QtyStepperProps) {
  const dim = size === "sm" ? "size-8" : "size-10";
  const field = size === "sm" ? "w-10 text-[13px]" : "w-12 text-sm";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--color-border)] bg-white",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(0, value - 1))}
        className={cn(
          "grid place-items-center rounded-l-full text-[var(--color-foreground)] hover:bg-[var(--color-surface)]",
          dim,
        )}
      >
        <Minus className="size-3.5" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        aria-label="Quantity"
        className={cn(
          "bg-transparent text-center font-semibold focus:outline-none",
          field,
        )}
      />
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className={cn(
          "grid place-items-center rounded-r-full text-[var(--color-foreground)] hover:bg-[var(--color-surface)]",
          dim,
        )}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
