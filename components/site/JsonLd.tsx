import { site, faqs } from "@/lib/content";
import { SITE_URL } from "@/lib/site-url";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/Glycodepot_Logo.jpeg`,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.contact.address.line1} ${site.contact.address.line2}`,
      addressLocality: site.contact.address.city,
      addressRegion: site.contact.address.state,
      postalCode: site.contact.address.postal,
      addressCountry: site.contact.address.country,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.contact.phone,
        email: site.contact.email,
        contactType: "customer service",
        areaServed: "Worldwide",
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
