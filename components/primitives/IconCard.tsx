import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface IconCardProps {
  icon?: ReactNode;
  title: string;
  body: string;
  className?: string;
  tone?: "default" | "outline" | "soft";
}

const toneMap = {
  default: "bg-white border border-[var(--color-border)] shadow-[var(--shadow-xs)]",
  outline: "bg-white border border-[var(--color-border)]",
  soft: "bg-[var(--color-brand-soft)] border border-transparent",
} as const;

export function IconCard({ icon, title, body, className, tone = "default" }: IconCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-[var(--radius-lg)] p-6 lg:p-7",
        toneMap[tone],
        className,
      )}
    >
      {icon ? (
        <div className="grid size-11 place-items-center rounded-[var(--radius-md)] bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
          {icon}
        </div>
      ) : null}
      <div className="space-y-2">
        <h3 className="type-h4 text-[var(--color-foreground)]">{title}</h3>
        <p className="type-body-sm text-[var(--color-muted-foreground)]">{body}</p>
      </div>
    </div>
  );
}
