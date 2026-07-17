import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/primitives";
import { NewsletterForm } from "./NewsletterForm";
import { LinkedInIcon, YouTubeIcon } from "./SocialIcons";
import { footerContent, site } from "@/lib/content";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#101317] text-white/80">
      <Container>
        <div className="grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-12 lg:py-20">
          {/* Brand + blurb + socials */}
          <div className="lg:col-span-4">
            <Link href="/" aria-label="GlycoDepot home" className="inline-block">
              <div className="inline-block overflow-hidden rounded-lg bg-white px-3 py-1.5">
                <Image
                  src="/Glycodepot_Logo.jpeg"
                  alt="GlycoDepot"
                  width={1600}
                  height={610}
                  className="h-10 w-auto"
                  sizes="180px"
                />
              </div>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/65">
              {footerContent.brandBlurb}
            </p>
            <div className="mt-6 flex items-center gap-2">
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="grid size-9 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:bg-white/5 hover:text-white"
              >
                <LinkedInIcon className="size-4" />
              </a>
              <a
                href={site.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="grid size-9 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:bg-white/5 hover:text-white"
              >
                <YouTubeIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
              {footerContent.quickLinks.heading}
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {footerContent.quickLinks.items.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
              {footerContent.contactHeading}
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-white/50"
                  aria-hidden
                />
                <span className="text-white/70">{site.contact.address.full}</span>
              </li>
              <li className="flex gap-3">
                <Phone
                  className="mt-0.5 size-4 shrink-0 text-white/50"
                  aria-hidden
                />
                <a
                  href={site.contact.phoneHref}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail
                  className="mt-0.5 size-4 shrink-0 text-white/50"
                  aria-hidden
                />
                <a
                  href={site.contact.emailHref}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  {site.contact.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
              {footerContent.newsletter.heading}
            </h3>
            <p className="mt-5 text-sm text-white/65">
              {footerContent.newsletter.body}
            </p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Legal bar */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 py-6 text-xs text-white/55 md:flex-row md:items-center">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerContent.legal.items.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
