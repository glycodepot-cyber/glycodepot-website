"use client";

import { useState, useTransition } from "react";
import { ListPlus, Check } from "lucide-react";
import { BrandButton } from "@/components/primitives";
import type { BrandButtonProps } from "@/components/primitives";
import type { Product, ProductVariant } from "@/lib/cart";
import { addToQuote } from "@/lib/quote/store";
import { emitAdded } from "@/lib/notification";

type Tone = NonNullable<BrandButtonProps["tone"]>;
type Size = NonNullable<BrandButtonProps["size"]>;

interface AddToQuoteButtonProps {
  product: Product;
  variant?: ProductVariant;
  quantity?: number;
  tone?: Tone;
  size?: Size;
  label?: string;
  className?: string;
}

export function AddToQuoteButton({
  product,
  variant,
  quantity = 1,
  tone = "outline",
  size = "md",
  label = "Add to quote",
  className,
}: AddToQuoteButtonProps) {
  const [added, setAdded] = useState(false);
  const [, startTransition] = useTransition();

  function onClick() {
    startTransition(() => {
      addToQuote(product, variant, quantity);
      setAdded(true);
      emitAdded({
        type: "quote",
        name: product.name,
        variantName: variant?.name,
        image: product.images[0],
      });
      window.setTimeout(() => setAdded(false), 1800);
    });
  }

  return (
    <BrandButton
      type="button"
      tone={tone}
      size={size}
      onClick={onClick}
      className={className}
      aria-live="polite"
    >
      {added ? (
        <>
          <Check className="size-4" />
          Added
        </>
      ) : (
        <>
          <ListPlus className="size-4" />
          {label}
        </>
      )}
    </BrandButton>
  );
}
