import type { Metadata } from "next";
import { Container, Section } from "@/components/primitives";
import { PageHero } from "@/components/site/PageHero";
import { OrderTrackingForm } from "@/components/site/forms/OrderTrackingForm";
import { orderTrackingCopy } from "@/lib/content";

export const metadata: Metadata = {
  title: orderTrackingCopy.metaTitle,
  description:
    "Track your GlycoDepot order — enter the Order ID and billing email to see shipping status.",
  alternates: { canonical: "/order-tracking" },
  robots: { index: false, follow: true },
};

export default function OrderTrackingPage() {
  return (
    <>
      <PageHero
        title={orderTrackingCopy.heading}
        description={orderTrackingCopy.body}
        breadcrumbs={[{ label: "Order Tracking" }]}
      />

      <Section spacing="default">
        <Container width="narrow">
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-7 lg:p-9">
            <OrderTrackingForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
