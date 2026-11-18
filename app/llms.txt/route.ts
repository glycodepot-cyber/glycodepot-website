import { SITE_URL } from "@/lib/site-url";
import { site } from "@/lib/content/site";
import { blogPosts } from "@/lib/content/blog";

/**
 * /llms.txt — a plain-text map of the site for AI assistants.
 * Convention: https://llmstxt.org. Facts only, and keep the counts in sync with
 * the catalogue. Not a standard yet, but it is cheap and assistants read it.
 */
export const dynamic = "force-static";

export function GET() {
  const posts = [...blogPosts]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map((p) => `- ${p.title}. ${SITE_URL}/blog/${p.slug}`)
    .join("\n");

  const body = `# GlycoDepot

> ${site.legalName} is a glycoscience supplier based in ${site.contact.address.city}, ${site.contact.address.state}, USA, founded by glycoscientist Shukkoor M Kondengaden, PhD. It sells sugar nucleotides online (in stock, priced per pack size) and supplies a catalogue of about 3,500 glycochemistry, glycobiology and glycoanalysis products by quote. It also runs enzymatic glycosylation and custom glycan synthesis services. All products and services are for laboratory research use only.

## Products
- Sugar nucleotides (89): UDP, GDP and CMP sugar nucleotides, natural and azide/alkyne-modified, e.g. CMP-Neu5Ac, GDP-L-fucose, UDP-galactose, UDP-GlcNAc, UDP-GalNAz. In stock; order online. ${SITE_URL}/products/sugar-nucleotides
- Glycochemistry (about 2,300): carbohydrate building blocks, monosaccharides, disaccharides, ADC linkers, sulfated oligomers, pharmaceutical raw materials such as cyclodextrins. Quote on request. ${SITE_URL}/products?group=glycochemistry
- Glycobiology (about 730): N-glycans including bulk supply, glycoenzymes, glycosyltransferases, glycosidases, blood group glycans, human milk oligosaccharides, lectins. Quote on request. ${SITE_URL}/products?group=glycobiology
- Glycoanalysis (about 420): enzyme substrates for diagnostics, glycoanalysis standards and reference materials. Quote on request. ${SITE_URL}/products?group=glycoanalysis

## Services
- Enzymatic glycosylation of small molecules: screening against a library of 380 plant UDP-glycosyltransferases (plus 145 di-glycosyltransferases), then scale-up of the winning reaction from milligrams to grams. UHPLC-MS/MS analytics. ${SITE_URL}/services/enzymatic-glycosylation
- Custom glycan synthesis: glycans and oligosaccharides made to a target structure and quantity. ${SITE_URL}/services/custom-glycan-synthesis

## Ordering
- In-stock sugar nucleotides: add to cart and check out online.
- All other products, bulk quantities and custom synthesis: request a quote at ${SITE_URL}/quote-request
- Lot-specific Certificates of Analysis are available on request.

## Contact
- Address: ${site.contact.address.full}, ${site.contact.address.country}
- Phone: ${site.contact.phone}
- Email: ${site.contact.email} (general), ${site.contact.salesEmail} (sales)
- Replies within one business day.

## Key pages
- Products: ${SITE_URL}/products
- Services: ${SITE_URL}/services
- Blog: ${SITE_URL}/blog
- About: ${SITE_URL}/about
- Contact: ${SITE_URL}/contact

## Blog
${posts}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
