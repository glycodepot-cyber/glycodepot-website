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
          Last updated: 2026-11-05
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="type-h3">Who we are</h2>
        <p>
          GlycoDepot LLC, Atlanta, Georgia, USA, is the controller of the
          personal data described in this notice. For anything to do with your
          data — a copy of it, a correction, deletion, or a complaint — write to{" "}
          <a
            href="mailto:info@glycodepot.com"
            className="text-[var(--color-brand)] underline"
          >
            info@glycodepot.com
          </a>
          .
        </p>
      </section>

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
          Wherever you are, you can ask us for a copy of your personal data, ask
          us to correct it, or ask us to delete it. Write to{" "}
          <a
            href="mailto:info@glycodepot.com"
            className="text-[var(--color-brand)] underline"
          >
            info@glycodepot.com
          </a>{" "}
          and we will respond within one month.
        </p>
        <p>
          If you are in the EEA or the UK, the GDPR also gives you the right to:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Withdraw consent</strong> at any time, where we rely on
            consent — for marketing email, use the unsubscribe link in any such
            email or our{" "}
            <a
              href="/unsubscribe"
              className="text-[var(--color-brand)] underline"
            >
              unsubscribe page
            </a>
            . Withdrawing is as easy as giving it, costs you nothing, and
            doesn&rsquo;t affect anything we did lawfully beforehand.
          </li>
          <li>
            <strong>Object</strong> to processing we base on legitimate
            interests, and object to direct marketing at any time — if you
            object to direct marketing we stop, without weighing it up.
          </li>
          <li>
            <strong>Restrict</strong> processing while a dispute about accuracy
            or lawfulness is resolved.
          </li>
          <li>
            <strong>Portability</strong> — receive the data you gave us in a
            structured, machine-readable form, or have us send it to someone
            else.
          </li>
          <li>
            Not be subject to decisions made purely by automated means that have
            a legal or similarly significant effect. We don&rsquo;t make any.
          </li>
        </ul>
        <p>
          If you are in California, the CCPA/CPRA gives you rights to know,
          delete, correct, and opt out of sale or sharing. We do not sell or
          share personal information as those terms are defined, and we do not
          use it for cross-context behavioural advertising.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">4a. Legal bases we rely on (EEA and UK)</h2>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Performance of a contract</strong> — processing quotes,
            orders, shipping and support.
          </li>
          <li>
            <strong>Legitimate interests</strong> — answering an enquiry you
            sent us, keeping records of our dealings, securing and improving the
            Site. You can object to any of these.
          </li>
          <li>
            <strong>Consent</strong> — marketing email, and any non-essential
            cookies. We ask for it separately, never bundled into something
            else, and we act on a withdrawal immediately.
          </li>
          <li>
            <strong>Legal obligation</strong> — tax, accounting and export
            compliance records.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">4b. Where your data goes</h2>
        <p>
          We are based in the United States and our systems — including our
          customer-relationship platform and email sending — process data there.
          If you are in the EEA or the UK, that means your personal data is
          transferred outside your home jurisdiction. We rely on the European
          Commission&rsquo;s Standard Contractual Clauses (and the UK Addendum)
          with the vendors who handle it on our behalf. Ask us and we will tell
          you which vendors those are.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">4c. Marketing email, consent and opt-out</h2>
        <p>
          We only send marketing email to people who asked for it, and we
          confirm every request before the first one goes out: you tick the
          consent box, we email you a confirmation link, and nothing is sent
          until you click it. If you never click it, we never mail you. We keep
          a record of what you agreed to and when.
        </p>
        <p>
          Every marketing email carries an unsubscribe link, and you can also
          use our{" "}
          <a
            href="/unsubscribe"
            className="text-[var(--color-brand)] underline"
          >
            unsubscribe page
          </a>
          . Opting out takes effect immediately and stops any sequence you were
          in. We keep your address on a suppression list afterwards for the sole
          purpose of not contacting you again; if you would rather be erased
          entirely, tell us and we will do that instead.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">4d. Complaints</h2>
        <p>
          If you think we have handled your data badly, please tell us first so
          we can put it right. You also have the right to complain to a data
          protection authority — in the EEA, the supervisory authority where you
          live or work; in the UK, the Information Commissioner&rsquo;s Office.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">5. Data retention</h2>
        <p>
          We keep customer and order data for as long as necessary to fulfill
          orders, support warranty claims, and comply with tax and accounting
          obligations — in practice that means order records are kept for the
          statutory accounting period. Enquiries that don&rsquo;t turn into
          orders are kept while the conversation is live and for a reasonable
          period afterwards. Marketing contacts are kept until you unsubscribe,
          after which only the minimum needed to honour that choice is retained.
          Ask us about a specific record and we will tell you what we hold and
          for how long.
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
