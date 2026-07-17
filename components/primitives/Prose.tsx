import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Long-form text content. Used for service descriptions, founder's letter, etc.
 * Anything that's mostly paragraphs and lists.
 */
export function Prose({
  className,
  ...rest
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "type-body-lg text-[var(--color-muted-foreground)] [&_p]:mb-5 [&_p:last-child]:mb-0",
        "[&_strong]:text-[var(--color-foreground)] [&_strong]:font-semibold",
        "[&_a]:text-[var(--color-brand)] [&_a]:underline-offset-4 hover:[&_a]:underline",
        "[&_h2]:type-h2 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-[var(--color-foreground)]",
        "[&_h3]:type-h3 [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-[var(--color-foreground)]",
        "[&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2",
        "[&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2",
        className,
      )}
      {...rest}
    />
  );
}
