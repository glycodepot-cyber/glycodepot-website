import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How GlycoDepot collects, uses, and protects your information.",
  alternates: { canonical: "/legal/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="space-y-8 text-[var(--color-foreground)]">
      <header className="space-y-2">
        <h1 className="type-h1">Privacy Policy</h1>
        <p className="text-[14px] text-[var(--color-muted)]">
          Last updated: 2026-06-18
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="type-h3">1. What we collect</h2>
        <p>
          We collect information you give us — name, email, organization,
          shipping address, phone — when you create a quote, place an order, or
          contact us. We also collect technical data automatically: IP address,
          browser type, pages visited.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">2. How we use it</h2>
        <ul className="ml-5 list-disc space-y-2">
          <li>To process and ship orders</li>
          <li>To respond to quote requests and support inquiries</li>
          <li>To send transactional emails (order confirmations, shipping)</li>
          <li>
            To send marketing emails only when you opt in, and you can
            unsubscribe at any time
          </li>
          <li>
            To improve the Site through analytics (page views, performance
            metrics)
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">3. Who we share it with</h2>
        <p>
          We share data only with vendors we use to operate the Site (payment
          processor, shipping carrier, CRM, analytics). We do not sell your
          personal information.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">4. Your rights</h2>
        <p>
          You can request access to, correction of, or deletion of your personal
          data by emailing{" "}
          <a
            href="mailto:info@glycodepot.com"
            className="text-[var(--color-brand)] underline"
          >
            info@glycodepot.com
          </a>
          . If you are in the EU or California, you have additional rights under
          GDPR and CCPA respectively.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">5. Data retention</h2>
        <p>
          We retain customer and order data for as long as necessary to fulfill
          orders, support warranty claims, and comply with tax and accounting
          obligations.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">6. Security</h2>
        <p>
          We use HTTPS everywhere, encrypted storage for sensitive fields, and
          minimum-necessary access for our team. No system is perfectly secure;
          please use a unique password for your account.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">7. Children</h2>
        <p>
          The Site is intended for professional and research use; it is not
          directed at children under 13.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">8. Updates</h2>
        <p>
          We may update this policy from time to time. The &ldquo;Last
          updated&rdquo; date at the top reflects the latest revision.
        </p>
      </section>
    </article>
  );
}
