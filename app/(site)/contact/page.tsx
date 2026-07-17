import type { Metadata } from "next";
import { Mail, MapPin, Phone, Smartphone } from "lucide-react";
import {
  Container,
  Section,
} from "@/components/primitives";
import { PageHero } from "@/components/site/PageHero";
import { ContactForm } from "@/components/site/forms/ContactForm";
import { LinkedInIcon, YouTubeIcon } from "@/components/site/SocialIcons";
import { contactPage, site } from "@/lib/content";

export const metadata: Metadata = {
  title: contactPage.metaTitle,
  description:
    "Questions, bulk quotes, custom synthesis, or technical support — get in touch with the GlycoDepot team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPageRoute() {
  return (
    <>
      <PageHero
        title={contactPage.heading}
        description={contactPage.intro}
        breadcrumbs={[{ label: "Contact" }]}
      />

      <Section spacing="default">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
            {/* Left — contact details (shown below form on mobile, left on desktop) */}
            <aside aria-label="Contact details" className="order-2 space-y-7 lg:order-none">
              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-7">
                <ContactBlock
                  icon={<MapPin className="size-4" aria-hidden />}
                  title="Address"
                  lines={[
                    `${site.contact.address.line1}`,
                    `${site.contact.address.line2}, ${site.contact.address.city} ${site.contact.address.state} ${site.contact.address.postal}`,
                  ]}
                />
                <hr className="my-5 border-[var(--color-border)]" />
                <ContactBlock
                  icon={<Phone className="size-4" aria-hidden />}
                  title="Phone"
                  links={[{ label: site.contact.phone, href: site.contact.phoneHref }]}
                />
                <hr className="my-5 border-[var(--color-border)]" />
                <ContactBlock
                  icon={<Smartphone className="size-4" aria-hidden />}
                  title="Mobile"
                  links={[{ label: site.contact.mobile, href: site.contact.mobileHref }]}
                />
                <hr className="my-5 border-[var(--color-border)]" />
                <ContactBlock
                  icon={<Mail className="size-4" aria-hidden />}
                  title="Email"
                  links={[
                    { label: site.contact.email, href: site.contact.emailHref },
                    {
                      label: site.contact.salesEmail,
                      href: site.contact.salesEmailHref,
                    },
                  ]}
                />
              </div>

              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
                <h2 className="type-h4 text-[var(--color-foreground)]">
                  Follow us
                </h2>
                <div className="mt-4 flex items-center gap-2">
                  <a
                    href={site.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="grid size-10 place-items-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-muted-foreground)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
                  >
                    <LinkedInIcon className="size-4" />
                  </a>
                  <a
                    href={site.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="grid size-10 place-items-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-muted-foreground)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
                  >
                    <YouTubeIcon className="size-4" />
                  </a>
                </div>
              </div>
            </aside>

            {/* Right — form (shown first on mobile, right on desktop) */}
            <div className="order-1 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-7 lg:order-none lg:p-9">
              <ContactForm />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function ContactBlock({
  icon,
  title,
  lines,
  links,
}: {
  icon: React.ReactNode;
  title: string;
  lines?: string[];
  links?: { label: string; href: string }[];
}) {
  return (
    <div className="flex gap-4">
      <div className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
          {title}
        </h3>
        <div className="text-[15px] leading-relaxed text-[var(--color-foreground)]">
          {lines?.map((l) => <div key={l}>{l}</div>)}
          {links?.map((l) => (
            <div key={l.href}>
              <a
                href={l.href}
                className="transition-colors hover:text-[var(--color-brand)]"
              >
                {l.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
