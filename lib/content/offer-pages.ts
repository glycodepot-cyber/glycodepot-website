export interface OfferPage {
  title: string;
  description: string;
  intro: string;
  selectionTitle: string;
  selection: string[];
  faqs: { question: string; answer: string }[];
}

export const offerPages: Record<string, OfferPage> = {
  "sugar-nucleotides": {
    title: "Sugar Nucleotides for Glycosylation Research",
    description: "Browse UDP, GDP and CMP sugar nucleotides for glycobiology research. Compare available pack sizes and prices, order online, or request a quote.",
    intro: "Find nucleotide sugars and modified sugar donors for your glycosylation studies. Browse individual products for the listed chemical form, specifications, available pack sizes, and pricing.",
    selectionTitle: "Choose the right sugar donor",
    selection: [
      "Search by product name, synonym, or CAS number. Confirm that the CAS number matches the listed salt or free-acid form.",
      "Check the structure and donor identity against your enzyme and assay requirements. Review modified or labeled analogues separately from their natural counterparts.",
      "Choose a priced pack on the product page to check out, or add products to your quote list for bulk quantities and special requirements.",
    ],
    faqs: [
      { question: "Can I order sugar nucleotides online?", answer: "Products with a listed price can be added to your cart. Open the product page to choose an available pack size and review the price before checkout. For quantities or products without pricing, request a quote." },
      { question: "Are salt and free-acid forms interchangeable?", answer: "Chemical form affects molecular weight and preparation calculations. Confirm the exact form, structure, and product specifications before choosing a material for your assay." },
      { question: "How do I request a bulk or multi-product quote?", answer: "Add the required products and pack sizes to your quote list, then submit your quantities, billing and shipping details, and any purity or timeline requirements. Our team will review pricing before sending your quote." },
    ],
  },
  "n-glycans": {
    title: "N-Glycan Standards for Glycoanalysis",
    description: "Explore N-glycan standards for glycoanalysis and glycobiology research. Review structures and specifications, select available packs, or request a tailored quote.",
    intro: "Explore N-glycans for analytical method development, glycan profiling, and glycobiology research. Select by the exact structure and product specifications rather than composition alone.",
    selectionTitle: "Match the standard to your method",
    selection: [
      "Review the glycan structure, branching, linkages, and reducing-end form on the individual product page.",
      "Specify any labeling or derivatization requirements, intended analytical method, and documentation needed when requesting a quote.",
      "Order priced packs online where available. Request pricing for larger quantities, reference panels, or structures outside the catalog.",
    ],
    faqs: [
      { question: "How do I choose an N-glycan standard?", answer: "Match the exact structure, chemical form, and labeling status to your method. Share your target structure and analytical application with our team if you need help identifying a suitable product." },
      { question: "Can I request several standards in one quote?", answer: "Yes. Add the products to your quote list and submit the required quantities together. Include your intended method and any documentation requirements in the notes." },
      { question: "What if I cannot find the required glycan?", answer: "Send a custom glycan synthesis request with the target sequence or structure, required amount, and purity. Feasibility, pricing, and delivery expectations are reviewed for each project." },
    ],
  },
};
