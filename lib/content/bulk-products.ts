/**
 * Bulk Supply — kilogram-scale ingredients sold by quote.
 *
 * The catalogue rows (products, 1 kg / 10 kg / 25 kg variants, categories)
 * live in the database, created by db/migrations/0004_bulk_supply.sql, because
 * quote requests resolve products and variants from the database. This file
 * holds the long-form page content for those products, keyed by product id,
 * which the product page renders in place of its default About/Specifications
 * block.
 *
 * Rules for this content:
 *  - Chemical identity (CAS, formula, molecular weight, EC) is checked against
 *    public references before it is written here.
 *  - A specification limit is only stated when we have a source for it.
 *    Anything else says "stated on the lot CoA" rather than a guessed number.
 *  - Application text describes how the ingredient is used in formulations.
 *    It makes no health or efficacy claim.
 */

export const BULK_PACK_SIZES = ["1 kg", "10 kg", "25 kg"] as const;

export type BulkRow = { label: string; value: string };

export interface BulkProductContent {
  productId: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  /** One or two sentences under the title. */
  summary: string;
  /** "Basic information" table beside the overview. */
  basicInfo: BulkRow[];
  overview: string[];
  properties: BulkRow[];
  advantages: { title: string; body: string }[];
  specifications: { parameter: string; limit: string; method?: string }[];
  specificationNote: string;
  applications: { industry: string; categorySlug?: string; points: string[] }[];
  packaging: BulkRow[];
  faqs: { question: string; answer: string }[];
}

const DOCUMENTS =
  "Certificate of analysis with every lot; technical data sheet, SDS and pre-shipment samples on request";

export const BULK_PRODUCTS: BulkProductContent[] = [
  {
    productId: "bulk_nag",
    seoTitle: "N-Acetyl-D-Glucosamine (NAG) Bulk Powder, CAS 7512-17-6 | 1–25 kg",
    seoDescription:
      "Bulk N-Acetyl-D-Glucosamine (NAG, GlcNAc), CAS 7512-17-6, ≥98% by HPLC. Cosmetic-grade powder in 1 kg, 10 kg and 25 kg packs with lot CoA. Request a bulk quote.",
    keywords: [
      "N-acetyl-D-glucosamine bulk",
      "NAG powder",
      "GlcNAc bulk supplier",
      "CAS 7512-17-6",
      "N-acetylglucosamine cosmetic grade",
      "N-acetylglucosamine 25 kg",
    ],
    summary:
      "Fermentation-derived N-acetyl-D-glucosamine (NAG, GlcNAc) for cosmetic, nutraceutical and feed formulators. Assay ≥98% by HPLC, supplied in 1 kg, 10 kg and 25 kg packs with a certificate of analysis for every lot.",
    basicInfo: [
      { label: "Product", value: "N-Acetyl-D-Glucosamine (NAG)" },
      { label: "Synonyms", value: "GlcNAc, N-acetylglucosamine, 2-acetamido-2-deoxy-D-glucose" },
      { label: "CAS number", value: "7512-17-6" },
      { label: "EC number", value: "231-368-2" },
      { label: "Molecular formula", value: "C8H15NO6" },
      { label: "Molecular weight", value: "221.21 g/mol" },
      { label: "Grade", value: "Cosmetic grade (other grades on request)" },
      { label: "Assay", value: "≥98% (HPLC)" },
      { label: "Production route", value: "Microbial fermentation" },
      { label: "Pack sizes", value: "1 kg · 10 kg · 25 kg (larger volumes on request)" },
      { label: "Documents", value: DOCUMENTS },
    ],
    overview: [
      "N-acetyl-D-glucosamine is the N-acetylated form of glucosamine and the repeating unit of chitin. In the body it is a building block of hyaluronic acid and other glycosaminoglycans, and it is a normal component of skin, cartilage and the intestinal lining. That biology is why formulators use it as a functional amino sugar rather than a filler.",
      "Our bulk NAG is produced by microbial fermentation and supplied as a white to off-white crystalline powder. It dissolves readily in water to a clear solution, so it is simple to work into serums, creams, powders, tablets, capsules and premixes.",
      "GlycoDepot supplies the same molecule in research pack sizes for glycobiology work. This listing is the kilogram-scale ingredient for manufacturers, with lot documentation suited to formulation and quality-control files.",
    ],
    properties: [
      { label: "Appearance", value: "White to off-white crystalline powder" },
      { label: "Solubility", value: "Freely soluble in water (clear solution); poorly soluble in methanol and ethanol" },
      { label: "Stability", value: "Stable at room temperature when kept dry; slightly hygroscopic" },
      { label: "Thermal behaviour", value: "Melts with decomposition at about 205 °C" },
      { label: "Structure", value: "N-acetylated amino monosaccharide (2-acetamido-2-deoxy-D-glucose)" },
    ],
    advantages: [
      {
        title: "Fermentation-derived",
        body: "Produced by microbial fermentation, giving a consistent ingredient from lot to lot.",
      },
      {
        title: "High purity",
        body: "Assay of at least 98% by HPLC, confirmed on the certificate of analysis for each lot.",
      },
      {
        title: "Easy to formulate",
        body: "Dissolves readily in water and blends into both aqueous and dry-powder formats.",
      },
      {
        title: "Kilogram-scale supply",
        body: "1 kg, 10 kg and 25 kg packs, with larger and recurring volumes quoted on request.",
      },
    ],
    specifications: [
      { parameter: "Assay", limit: "≥98.0%", method: "HPLC" },
      { parameter: "Appearance", limit: "White to off-white crystalline powder", method: "Visual" },
      { parameter: "Solubility", limit: "Freely soluble in water", method: "—" },
    ],
    specificationNote:
      "Loss on drying, residue on ignition, heavy metals and microbiological limits are stated on the lot certificate of analysis. Send us your specification and we will confirm it before you order.",
    applications: [
      {
        industry: "Cosmetics & personal care",
        categorySlug: "bulk-cosmetics",
        points: [
          "Hydrating serums, creams and lotions",
          "Formulations for even-looking skin tone",
          "Products formulated to support the skin barrier",
          "Smoothing and texture-refining skin care",
        ],
      },
      {
        industry: "Nutraceuticals & functional food",
        categorySlug: "bulk-nutraceuticals",
        points: [
          "Joint-care supplement formulations",
          "Digestive-health and gut-lining formulations",
          "Tablets, capsules, powders and beverages",
        ],
      },
      {
        industry: "Animal nutrition",
        categorySlug: "bulk-animal-nutrition",
        points: [
          "Feed additives aimed at intestinal health in young animals",
          "Pet joint-care chews and supplements",
        ],
      },
      {
        industry: "Agriculture",
        points: [
          "Biostimulant research, including root development and soil-microbe interactions",
        ],
      },
    ],
    packaging: [
      { label: "Pack sizes", value: "1 kg, 10 kg and 25 kg" },
      { label: "Packaging", value: "Sealed, lined bags or fibre drums depending on pack size; confirmed with your quote" },
      { label: "Storage", value: "Keep tightly closed in a cool, dry place away from moisture" },
      { label: "Shelf life", value: "Stated on the lot certificate of analysis" },
      { label: "Shipping", value: "Worldwide; lead time confirmed with your quote" },
    ],
    faqs: [
      {
        question: "What is N-acetyl-D-glucosamine (NAG)?",
        answer:
          "NAG (also written GlcNAc) is an amino sugar: glucosamine carrying an acetyl group on its nitrogen. It is the repeating unit of chitin and a building block of hyaluronic acid and other glycosaminoglycans.",
      },
      {
        question: "How is NAG different from glucosamine?",
        answer:
          "Glucosamine is usually sold as a hydrochloride or sulfate salt. NAG is the acetylated, salt-free form. It is a different ingredient with its own CAS number (7512-17-6), so formulators choose between them by application and label requirements.",
      },
      {
        question: "What purity is your bulk NAG?",
        answer:
          "The assay is at least 98% by HPLC. Every lot ships with a certificate of analysis, and we can confirm your own specification before you order.",
      },
      {
        question: "Which pack sizes can I order?",
        answer:
          "Choose 1 kg, 10 kg or 25 kg on this page and request a quote. For multiple drums, recurring supply or a contract volume, add the quantity to the quote request or contact us.",
      },
      {
        question: "Can I get a sample and documents before ordering?",
        answer:
          "Yes. Ask for a pre-shipment sample, technical data sheet and SDS in your quote request, and we will send them with pricing.",
      },
      {
        question: "How should NAG be stored?",
        answer:
          "NAG is slightly hygroscopic. Keep it in its sealed packaging in a cool, dry place and reseal opened packs promptly.",
      },
    ],
  },
  {
    productId: "bulk_l_fucose",
    seoTitle: "L-Fucose Bulk Powder, CAS 2438-80-4 | 1 kg, 10 kg, 25 kg",
    seoDescription:
      "Bulk L-Fucose (6-deoxy-L-galactose), CAS 2438-80-4, ≥99% by HPLC, fermentation-derived. 1 kg, 10 kg and 25 kg packs with lot CoA for cosmetic, nutraceutical and pharma use.",
    keywords: [
      "L-fucose bulk",
      "L-fucose powder",
      "L-fucose supplier",
      "CAS 2438-80-4",
      "6-deoxy-L-galactose",
      "L-fucose 25 kg",
    ],
    summary:
      "Fermentation-derived L-Fucose (6-deoxy-L-galactose), ≥99% by HPLC, for cosmetic, nutraceutical and pharmaceutical manufacturers. Supplied in 1 kg, 10 kg and 25 kg packs with a certificate of analysis for every lot.",
    basicInfo: [
      { label: "Product", value: "L-Fucose" },
      { label: "Synonyms", value: "6-Deoxy-L-galactose, L-(−)-fucose, L-rhodeose" },
      { label: "CAS number", value: "2438-80-4" },
      { label: "EC number", value: "219-452-7" },
      { label: "Molecular formula", value: "C6H12O5" },
      { label: "Molecular weight", value: "164.16 g/mol" },
      { label: "Grade", value: "High purity; cosmetic, nutraceutical and research use" },
      { label: "Assay", value: "≥99% (HPLC)" },
      { label: "Production route", value: "Microbial fermentation (not extracted from seaweed)" },
      { label: "Pack sizes", value: "1 kg · 10 kg · 25 kg (larger volumes on request)" },
      { label: "Documents", value: DOCUMENTS },
    ],
    overview: [
      "L-Fucose is a deoxyhexose sugar — galactose missing the hydroxyl group at carbon 6. Unusually for a sugar, it occurs in nature in the L-configuration. It is the fucose found in fucoidan from brown seaweed, in human milk oligosaccharides such as 2′-fucosyllactose, and at the ends of many glycoproteins and glycolipids.",
      "Our bulk L-fucose is made by targeted microbial fermentation rather than by acid hydrolysis of seaweed, then purified to at least 99% by HPLC. The fermentation route keeps other sugars low and avoids the heavy-metal carry-over that algae extraction can bring.",
      "Because so much of fucose's biology happens on cell surfaces, the ingredient is used in skin care, in nutrition formulations, as a building block for human milk oligosaccharide synthesis and as a starting material for fucosylated compounds. It is a white, readily water-soluble crystalline powder, which keeps handling and formulation simple.",
      "GlycoDepot also supplies L-fucose, GDP-L-fucose and fucosyltransferases at research scale. This listing is the kilogram-scale ingredient for manufacturers, with lot documentation for formulation and quality files.",
    ],
    properties: [
      { label: "Appearance", value: "White to off-white crystalline powder; odourless, slightly sweet" },
      { label: "Solubility", value: "Freely soluble in water; slightly soluble in methanol; insoluble in ethanol and ether" },
      { label: "Stability", value: "Stable at room temperature when kept dry" },
      { label: "Configuration", value: "L-sugar (6-deoxy-L-galactopyranose)" },
      { label: "Natural sources", value: "Seaweed fucoidan, human milk oligosaccharides, glycoproteins" },
    ],
    advantages: [
      {
        title: "Fermentation-derived",
        body: "Made by targeted microbial biosynthesis, not seaweed hydrolysis, for consistent lots without algae-derived contaminants.",
      },
      {
        title: "≥99% purity",
        body: "Assay of at least 99% by HPLC with low levels of other sugars, confirmed on each lot's CoA.",
      },
      {
        title: "Versatile",
        body: "One ingredient serving cosmetic, nutritional, HMO-synthesis and pharmaceutical-research uses.",
      },
      {
        title: "Kilogram-scale supply",
        body: "1 kg, 10 kg and 25 kg packs, with larger and recurring volumes quoted on request.",
      },
    ],
    specifications: [
      { parameter: "Assay", limit: "≥99.0%", method: "HPLC" },
      { parameter: "Appearance", limit: "White to off-white crystalline powder", method: "Visual" },
      { parameter: "Solubility", limit: "Freely soluble in water", method: "—" },
    ],
    specificationNote:
      "Specific rotation, loss on drying, heavy metals and microbiological limits are stated on the lot certificate of analysis. Send us your specification and we will confirm it before you order.",
    applications: [
      {
        industry: "Cosmetics & personal care",
        categorySlug: "bulk-cosmetics",
        points: [
          "Anti-ageing and firming serums and creams",
          "Formulations to support the skin barrier",
          "Scalp and hair-care formulations",
        ],
      },
      {
        industry: "Nutraceuticals & functional food",
        categorySlug: "bulk-nutraceuticals",
        points: [
          "Gut-health and microbiome-focused formulations",
          "Products inspired by human milk oligosaccharides",
          "Powders, capsules and beverages",
        ],
      },
      {
        industry: "APIs & pharmaceutical intermediates",
        categorySlug: "bulk-apis",
        points: [
          "Building block for human milk oligosaccharide (HMO) synthesis",
          "Starting material for fucosylated compounds, GDP-L-fucose and glycans",
          "Pharmaceutical and rare-disease research on fucosylation",
        ],
      },
    ],
    packaging: [
      { label: "Pack sizes", value: "1 kg, 10 kg and 25 kg" },
      { label: "Packaging", value: "Sealed, lined bags or fibre drums depending on pack size; confirmed with your quote" },
      { label: "Storage", value: "Keep tightly closed in a cool, dry place" },
      { label: "Shelf life", value: "Stated on the lot certificate of analysis" },
      { label: "Shipping", value: "Worldwide; lead time confirmed with your quote" },
    ],
    faqs: [
      {
        question: "What is L-fucose?",
        answer:
          "L-Fucose is 6-deoxy-L-galactose, a six-carbon sugar that occurs naturally in seaweed fucoidan, in human milk oligosaccharides and on many glycoproteins.",
      },
      {
        question: "What is the difference between L-fucose and D-fucose?",
        answer:
          "They are mirror-image forms. L-Fucose is the form found in human glycans and in fucoidan, and it is the form used in cosmetic, nutritional and pharmaceutical applications. GlycoDepot lists D-fucose separately for research.",
      },
      {
        question: "How is your L-fucose produced?",
        answer:
          "By targeted microbial fermentation followed by purification, not by acid hydrolysis of seaweed. That gives consistent lots with low levels of other sugars.",
      },
      {
        question: "What purity is your bulk L-fucose?",
        answer:
          "At least 99% by HPLC. Every lot ships with a certificate of analysis, and we can confirm your own specification before you order.",
      },
      {
        question: "Can it be used for HMO synthesis?",
        answer:
          "Yes, L-fucose is a building block for fucosylated human milk oligosaccharides. Tell us your process requirements in the quote request and we will confirm suitability.",
      },
      {
        question: "Which pack sizes can I order?",
        answer:
          "Choose 1 kg, 10 kg or 25 kg on this page and request a quote. For larger or recurring volumes, add the quantity to the quote request or contact us.",
      },
      {
        question: "Can I get a sample and documents before ordering?",
        answer:
          "Yes. Ask for a pre-shipment sample, technical data sheet and SDS in your quote request, and we will send them with pricing.",
      },
    ],
  },
];

const byId = new Map(BULK_PRODUCTS.map((p) => [p.productId, p]));

export function bulkContentFor(productId: string): BulkProductContent | null {
  return byId.get(productId) ?? null;
}

/** FAQPage structured data for a bulk product. */
export function bulkFaqJsonLd(content: BulkProductContent) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
