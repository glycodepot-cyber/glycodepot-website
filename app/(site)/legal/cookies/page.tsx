import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How GlycoDepot uses cookies and similar technologies.",
  alternates: { canonical: "/legal/cookies" },
};

export default function CookiesPage() {
  return (
    <article className="space-y-8 text-[var(--color-foreground)]">
      <header className="space-y-2">
        <h1 className="type-h1">Cookie Policy</h1>
        <p className="text-[14px] text-[var(--color-muted)]">
          Last updated: 2026-06-18
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="type-h3">What are cookies?</h2>
        <p>
          Cookies are small text files stored by your browser. The Site also
          uses similar technologies (localStorage, sessionStorage) to remember
          your preferences and the items in your cart between visits.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">Categories we use</h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-semibold">Strictly necessary</dt>
            <dd className="text-[var(--color-muted-foreground)]">
              Required for the cart, quote list, checkout, and login. You
              cannot disable these without breaking core functionality.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Analytics</dt>
            <dd className="text-[var(--color-muted-foreground)]">
              Aggregated page-view and performance data (via Vercel Analytics).
              We do not link this data to individual users.
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Marketing (only when enabled)</dt>
            <dd className="text-[var(--color-muted-foreground)]">
              If we later add advertising or marketing integrations, those
              cookies will only be set with your explicit consent.
            </dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">Managing cookies</h2>
        <p>
          You can clear or block cookies through your browser settings. Doing so
          may sign you out and clear your cart between sessions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="type-h3">Contact</h2>
        <p>
          Questions about cookies? Email{" "}
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
