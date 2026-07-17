import type { Metadata } from "next";
import { Container, Section } from "@/components/primitives";
import { PageHero } from "@/components/site/PageHero";
import { CartView } from "@/components/site/cart/CartView";

export const metadata: Metadata = {
  title: "Shopping cart",
  description: "Review the items in your GlycoDepot cart and proceed to checkout.",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <PageHero
        title="Your cart"
        breadcrumbs={[{ label: "Cart" }]}
      />
      <Section spacing="default">
        <Container>
          <CartView />
        </Container>
      </Section>
    </>
  );
}
