import type { NavLink } from "./nav";

export const footerContent = {
  brandBlurb:
    "GlycoDepot serves all your needs in glycoscience — products, services, networking, and announcements. Get the best glycoscience products and services to support your research. Shop now and explore cutting-edge solutions in glycochemistry, glycobiology, and glycoanalysis.",
  quickLinks: {
    heading: "Quick Links",
    items: [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/products" },
      { label: "Services", href: "/services" },
      { label: "Blog", href: "/blog" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Sitemap", href: "/sitemap.xml" },
    ] satisfies NavLink[],
  },
  contactHeading: "Contact us",
  newsletter: {
    heading: "Stay in the loop",
    body: "Get product launches, papers we like, and the occasional discount in your inbox.",
    placeholder: "you@lab.edu",
    submitLabel: "Subscribe",
  },
  legal: {
    items: [
      { label: "Terms and Conditions", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Cookie Policy", href: "/legal/cookies" },
    ] satisfies NavLink[],
  },
};
