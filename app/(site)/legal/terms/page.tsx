import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "GlycoDepot terms of service.",
  alternates: { canonical: "/legal/terms" },
};

export default function TermsPage() {
  return (
    <article className="space-y-8 text-[var(--color-foreground)]">
      <header className="space-y-2">
        <h1 className="type-h1">Terms of Service</h1>
        <p className="text-[14px] text-[var(--color-muted)]">
          Last updated: 2026-06-18
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="type-h3">1. Acceptance</h2>
        <p>
          By accessing or using glycodepot.com (&ldquo;the Site&rdquo;) you agree
          to these Terms of Service. If you do not agree, do not use the Site.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">2. Products and orders</h2>
        <p>
          All products listed on the Site are for research use only (RUO) unless
          explicitly labelled otherwise. Product availability, pricing, and
          specifications are subject to change without notice. Orders placed
          through the Site are subject to acceptance and confirmation; we may
          decline or cancel an order at our discretion.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">3. Shipping and returns</h2>
        <p>
          Shipping costs and timelines vary by product, lot, and destination.
          Returns are limited to manufacturing defects and only when reported
          within the warranty window specified for that product. Custom
          synthesis orders are non-refundable once production has started.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">4. Intellectual property</h2>
        <p>
          The Site, including all text, images, code, and branding, is owned by
          GlycoDepot and protected by intellectual property law. No part may be
          reproduced without prior written consent.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">5. Limitation of liability</h2>
        <p>
          GlycoDepot, its suppliers, and partners are not liable for indirect,
          incidental, or consequential damages arising from use of the Site or
          its products. Total liability shall not exceed the amount paid for
          the product in question.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">6. Governing law</h2>
        <p>
          These Terms are governed by the laws of the State of Texas, United
          States, without regard to its conflict-of-law provisions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">7. Contact</h2>
        <p>
          Questions? Email{" "}
          <a
            href="mailto:info@glycodepot.com"
            className="text-[var(--color-brand)] underline"
          >
            info@glycodepot.com
          </a>
          .
        </p>
      </section>
    </article>
  );
}
