export const site = {
  name: "GlycoDepot",
  legalName: "Escientificsolutions LLC",
  tagline: "Your Trusted Source for Glycoscience Solutions",
  description:
    "Glycodepot serve all your needs in glycoscience from products, services, networking and announcements. Get the best glycoscience products and services to support your research.",
  contact: {
    phone: "+1 956 695 3603",
    phoneHref: "tel:+19566953603",
    mobile: "+1 404 468 3219",
    mobileHref: "tel:+14044683219",
    email: "info@glycodepot.com",
    emailHref: "mailto:info@glycodepot.com",
    salesEmail: "sales@glycodepot.com",
    salesEmailHref: "mailto:sales@glycodepot.com",
    address: {
      line1: "1445 Woodmont Ln NW",
      line2: "Suite 183",
      city: "Atlanta",
      state: "GA",
      postal: "30318",
      country: "USA",
      full: "1445 Woodmont Ln NW Suite 183, Atlanta GA 30318",
    },
  },
  social: {
    linkedin: "https://www.linkedin.com/company/glycodepot",
    youtube: "https://www.youtube.com/@glycodepot",
  },
  // Copyright year is rendered dynamically in SiteFooter via new Date().getFullYear().
} as const;

export type Site = typeof site;
