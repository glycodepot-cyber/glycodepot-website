import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/primitives";
import { PageHero } from "@/components/site/PageHero";
import { CartAddFromUrl } from "@/components/site/cart/CartAddFromUrl";
import { getProductByFeedId } from "@/lib/cart/client";
import { pricedVariant } from "@/lib/cart/price-policy";

/**
 * Cart link target for Google Merchant Center.
 *
 * Merchant Center substitutes a feed item's `g:id` and a quantity into a cart
 * link template and expects the result to put that item in the cart. The
 * account was still configured with the old WordPress store's WooCommerce
 * pattern — /checkout/?add-to-cart={id}&quantity=1 — which this site has never
 * served, which is why checkout failed approval. Both the WooCommerce
 * parameter name and a plain `id` are accepted so the historical template
 * keeps working via the redirect in next.config.
 */

export const metadata: Metadata = {
  title: "Adding to your cart",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{
  "add-to-cart"?: string | string[];
  id?: string | string[];
  variant?: string | string[];
  quantity?: string | string[];
}>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseQuantity(raw: string | undefined): number {
  const parsed = Number.parseInt(raw ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.min(parsed, 999);
}

export default async function CartAddPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const feedId = first(params["add-to-cart"]) ?? first(params.id) ?? "";
  const quantity = parseQuantity(first(params.quantity));
  const product = feedId ? await getProductByFeedId(feedId) : null;

  if (!product) {
    return (
      <>
        <PageHero
          title="We couldn't find that product"
          breadcrumbs={[{ label: "Cart" }, { label: "Add" }]}
        />
        <Section spacing="default">
          <Container>
            <p className="max-w-prose text-base text-muted-foreground">
              That link points to an item we no longer list under that
              catalogue number. Browse the catalogue to find what you need, or
              send us the catalogue number and we will locate it for you.
            </p>
            <p className="mt-6 flex gap-4">
              <Link href="/products" className="font-medium underline">
                Browse the catalogue
              </Link>
              <Link href="/contact" className="font-medium underline">
                Contact us
              </Link>
            </p>
          </Container>
        </Section>
      </>
    );
  }

  const requestedVariant = first(params.variant);
  const variant =
    (requestedVariant
      ? product.variants.find((v) => v.id === requestedVariant)
      : undefined) ?? pricedVariant(product.variants);

  return (
    <>
      <CartAddFromUrl
        product={product}
        variant={variant}
        quantity={quantity}
      />
      <PageHero
        title="Adding to your cart"
        breadcrumbs={[{ label: "Cart" }, { label: "Add" }]}
      />
      <Section spacing="default">
        <Container>
          {/* Rendered for anyone without JavaScript, and for crawlers, so the
              page is never blank while the client-side add runs. */}
          <p className="max-w-prose text-base text-muted-foreground">
            Adding {quantity} &times; {product.name}
            {variant?.name ? ` (${variant.name})` : ""} to your cart.
          </p>
          <p className="mt-6 flex gap-4">
            <Link href="/cart" className="font-medium underline">
              Go to your cart
            </Link>
            <Link href={`/products`} className="font-medium underline">
              Keep browsing
            </Link>
          </p>
        </Container>
      </Section>
    </>
  );
}
