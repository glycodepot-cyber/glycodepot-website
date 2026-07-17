"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type Props = Omit<ComponentPropsWithoutRef<typeof Input>, "type"> & {
  showLabel?: string;
  hideLabel?: string;
};

export function PasswordInput({
  showLabel = "Show password",
  hideLabel = "Hide password",
  className,
  ...rest
}: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        {...rest}
        type={visible ? "text" : "password"}
        className={cn("pr-11", className)}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? hideLabel : showLabel}
        aria-pressed={visible}
        className="absolute right-2.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
      >
        {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
      </button>
    </div>
  );
}
