import { site, faqs } from "@/lib/content";
import { SITE_URL } from "@/lib/site-url";

/**
 * Organization markup for the homepage.
 * The `description` is the sentence assistants most often quote about the
 * company, so it lives in lib/content/site.ts and is kept factual and explicit
 * about what we sell. Founder and email were missing from the earlier block.
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/Glycodepot_Logo.jpeg`,
    description: site.description,
    founder: {
      "@type": "Person",
      name: site.founder.name,
      honorificSuffix: site.founder.honorificSuffix,
      jobTitle: site.founder.jobTitle,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.contact.address.line1} ${site.contact.address.line2}`,
      addressLocality: site.contact.address.city,
      addressRegion: site.contact.address.state,
      postalCode: site.contact.address.postal,
      addressCountry: site.contact.address.country,
    },
    telephone: site.contact.phone,
    email: site.contact.email,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.contact.phone,
        email: site.contact.email,
        contactType: "customer service",
        areaServed: "Worldwide",
        availableLanguage: "English",
      },
    ],
    sameAs: [site.social.linkedin, site.social.youtube],
  };
  return (
    <script
      type="application/ld+json"
      // safe: data we control
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
