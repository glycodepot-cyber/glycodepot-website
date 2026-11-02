"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { BrandButton } from "@/components/primitives";
import type { BrandButtonProps } from "@/components/primitives";
import type { Product, ProductVariant } from "@/lib/cart";
import { addCartItem, openCart } from "@/lib/cart/store";
import { emitAdded } from "@/lib/notification";

type Tone = NonNullable<BrandButtonProps["tone"]>;
type Size = NonNullable<BrandButtonProps["size"]>;

interface AddToCartButtonProps {
  product: Product;
  variant?: ProductVariant;
  quantity?: number;
  tone?: Tone;
  size?: Size;
  label?: string;
  className?: string;
  checkoutOnAdd?: boolean;
}

export function AddToCartButton({
  product,
  variant,
  quantity = 1,
  tone = "brand",
  size = "md",
  label = "Add to cart",
  className,
  checkoutOnAdd = false,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [loading, startTransition] = useTransition();

  function onClick() {
    startTransition(() => {
      addCartItem(product, variant, quantity);
      setAdded(true);
      emitAdded({
        type: "cart",
        name: product.name,
        variantName: variant?.name,
        image: product.images[0],
      });

      if (checkoutOnAdd) {
        router.push("/checkout");
        return;
      }

      openCart();
      window.setTimeout(() => setAdded(false), 1800);
    });
  }

  return (
    <BrandButton
      type="button"
      tone={tone}
      size={size}
      onClick={onClick}
      disabled={loading}
      className={className}
    >
      {added ? (
        <>
          <Check className="size-4" />
          Added
        </>
      ) : (
        <>
          <ShoppingCart className="size-4" />
          {label}
        </>
      )}
    </BrandButton>
  );
}
