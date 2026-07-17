import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  level?: "h1" | "h2" | "h3";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  level = "h2",
  className,
}: SectionHeadingProps) {
  const Tag = level;
  const typeClass = level === "h1" ? "type-h1" : level === "h3" ? "type-h3" : "type-h2";

  return (
    <header
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Tag className={cn(typeClass, "text-balance text-[var(--color-foreground)]")}>
        {title}
      </Tag>
      {description ? (
        <p
          className={cn(
            "type-body-lg text-pretty text-[var(--color-muted-foreground)]",
            align === "center" ? "max-w-2xl" : "max-w-3xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
