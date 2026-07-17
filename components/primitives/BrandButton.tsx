import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

const brandButton = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full",
    "relative overflow-hidden font-medium leading-none",
    "transition-all duration-150 ease-out",
    "hover:scale-[1.03] active:scale-[0.97]",
    "before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full before:skew-x-[-20deg]",
    "before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent",
    "before:transition-transform before:duration-500",
    "hover:before:translate-x-[200%]",
    "outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:relative [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      tone: {
        brand:
          "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)] active:bg-[var(--color-brand-hover)]",
        accent:
          "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]",
        outline:
          "border border-[var(--color-border-strong)] bg-transparent text-[var(--color-foreground)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]",
        ghost:
          "bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-surface)]",
        light:
          "bg-white text-[var(--color-brand)] hover:bg-[var(--color-brand-soft)]",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      tone: "brand",
      size: "md",
    },
  },
);

type BrandButtonBase = VariantProps<typeof brandButton> & {
  children?: ReactNode;
  className?: string;
};

type AsButton = BrandButtonBase &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type AsLink = BrandButtonBase &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & {
    href: string;
    external?: boolean;
  };

export type BrandButtonProps = AsButton | AsLink;

export function BrandButton(props: BrandButtonProps) {
  const { tone, size, className, children } = props;
  const classes = cn(brandButton({ tone, size }), className);

  if ("href" in props && props.href) {
    const { href, external, tone: _t, size: _s, className: _c, children: _ch, ...rest } = props;
    if (external || /^https?:/.test(href) || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return (
        <a
          href={href}
          className={classes}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { tone: _t, size: _s, className: _c, children: _ch, ...rest } = props as AsButton;
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
