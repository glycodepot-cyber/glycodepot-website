import type { Metadata } from "next";
import { Container, Section } from "@/components/primitives";
import { PageHero } from "@/components/site/PageHero";
import { CheckoutView } from "@/components/site/cart/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your GlycoDepot order.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        title="Checkout"
        breadcrumbs={[
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />
      <Section spacing="default">
        <Container>
          <CheckoutView />
        </Container>
      </Section>
    </>
  );
}
