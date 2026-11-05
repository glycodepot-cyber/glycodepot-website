import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/primitives";
import { PageHero } from "@/components/site/PageHero";
import { MetisFormEmbed } from "@/components/site/forms/MetisFormEmbed";

export const metadata: Metadata = {
  title: "Unsubscribe",
  description:
    "Remove your email address from GlycoDepot mailings, or stop all contact.",
  alternates: { canonical: "/unsubscribe" },
  // Reachable from every marketing email and from the footer, but there is no
  // reason for it to compete in search results.
  robots: { index: false, follow: true },
};

export default function UnsubscribePage() {
  return (
    <>
      <PageHero
        title="Unsubscribe"
        breadcrumbs={[{ label: "Unsubscribe" }]}
        description="Tell us the address to stop contacting and we'll action it immediately — no sign-in, no questions."
      />

      <Section spacing="default">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="type-h3 text-[var(--color-foreground)]">
                  What happens when you submit
                </h2>
                <ul className="ml-5 list-disc space-y-2 text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
                  <li>
                    Your address is suppressed straight away — no marketing
                    email can be sent to it after that.
                  </li>
                  <li>
                    Any follow-up sequence you were part of stops where it is.
                  </li>
                  <li>
                    We send one confirmation so you know it worked, and then
                    nothing further.
                  </li>
                  <li>
                    If you chose to stop all contact, that covers phone and text
                    as well as email.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h2 className="type-h3 text-[var(--color-foreground)]">
                  Suppression or erasure?
                </h2>
                <p className="text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
                  Unsubscribing works by keeping a record of your address
                  precisely so that we don&rsquo;t contact it again. If you
                  would rather we erase your personal data altogether, reply to
                  the confirmation email, or write to{" "}
                  <a
                    href="mailto:info@glycodepot.com?subject=Data%20erasure%20request"
                    className="text-[var(--color-brand)] underline"
                  >
                    info@glycodepot.com
                  </a>
                  , and we will do that instead.
                </p>
                <p className="text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
                  Our{" "}
                  <Link
                    href="/legal/privacy"
                    className="text-[var(--color-brand)] underline"
                  >
                    privacy notice
                  </Link>{" "}
                  sets out your other rights, including access, correction and
                  portability.
                </p>
              </div>

              <p className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4 text-[14px] leading-relaxed text-[var(--color-muted-foreground)]">
                Transactional messages about an order or a quote you have with
                us are not marketing, and we may still reply to those. If you
                want those stopped too, choose &ldquo;all contact&rdquo; in the
                form and we will close the thread.
              </p>
            </div>

            <MetisFormEmbed
              formId="dTiZ"
              minHeight={460}
              fallbackSubject="Unsubscribe request"
              fallbackLabel="unsubscribe form"
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
