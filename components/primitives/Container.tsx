import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type ContainerWidth = "default" | "narrow" | "prose" | "wide";

interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  width?: ContainerWidth;
}

const widthMap: Record<ContainerWidth, string> = {
  default: "max-w-[var(--container-max)]",
  narrow: "max-w-[var(--container-narrow)]",
  prose: "max-w-[var(--container-prose)]",
  wide: "max-w-[1440px]",
};

export function Container({
  width = "default",
  className,
  ...rest
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-5 sm:px-8 lg:px-10", widthMap[width], className)}
      {...rest}
    />
  );
}
