import type { Category, Product } from "./types";

/**
 * Static mock data used until the real cart API key is wired in.
 * Shape mirrors what the adapter will return — only the source changes.
 */

const usd = (amount: number) => ({ amount, currency: "USD" as const });

const placeholder = (label: string) => ({
  src: `https://placehold.co/600x600/eaf1fa/296dc1?text=${encodeURIComponent(label)}`,
  alt: label,
  width: 600,
  height: 600,
});

export const mockCategories: Category[] = [
  {
    id: "cat_sugar_nuc",
    slug: "sugar-nucleotides",
    name: "Sugar Nucleotides",
    description:
      "High-purity natural and modified sugar-nucleotide donors for enzymatic glycosylation, vaccine work, and glyco-engineering.",
    productCount: 6,
  },
  {
    id: "cat_glycoenzymes",
    slug: "glycoenzymes",
    name: "Glycoenzymes",
    description:
      "Glycosyltransferases, glycosidases, deglycosylation kits, and the reagents that power them.",
    productCount: 6,
  },
  {
    id: "cat_oligos",
    slug: "oligosaccharides",
    name: "Oligosaccharides & Glycans",
    description:
      "Blood-group glycans, N-glycans, O-glycans, carbohydrate antigens — characterised and lot-tracked.",
    productCount: 6,
  },
  {
    id: "cat_arrays",
    slug: "arrays",
    name: "Glycobiology Arrays",
    description: "Glycan arrays, lectin arrays, and detection toolkits.",
    productCount: 3,
  },
  {
    id: "cat_hmos",
    slug: "hmos",
    name: "Human Milk Oligosaccharides",
    description:
      "Precisely engineered HMOs for nutrition, microbiome, and immunology research.",
    productCount: 4,
  },
  {
    id: "cat_cyclodextrins",
    slug: "cyclodextrins",
    name: "Cyclodextrins",
    description:
      "α, β, γ forms for pharma, cosmetics, and food. Pharmaceutical-grade options available.",
    productCount: 3,
  },
];

type Seed = {
  name: string;
  price: number | null;
  badge?: Product["badge"];
  size?: string;
  cas?: string;
  purity?: string;
  description?: string;
  coverSrc?: string;
};

const makeProduct = (
  categoryId: string,
  i: number,
  seed: Seed,
): Product => ({
  id: `prod_${categoryId}_${i}`,
  slug: `${seed.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`,
  name: seed.name,
  shortDescription: seed.description ?? "Research-grade reagent. Lot-tracked. RUO.",
  description:
    seed.description ??
    "High-purity reagent for glycoscience research. Includes Certificate of Analysis, lot-specific QC data, and recommended handling guidance. Sourced from expert labs and shipped on dry ice when required.",
  categories: [categoryId],
  primaryCategoryId: categoryId,
  images: [
    seed.coverSrc
      ? { src: seed.coverSrc, alt: seed.name, width: 600, height: 600 }
      : placeholder(seed.name),
  ],
  variants: [
    {
      id: `var_${categoryId}_${i}_a`,
      name: seed.size ?? "10 mg",
      price: seed.price !== null ? usd(seed.price) : null,
      inStock: true,
    },
    {
      id: `var_${categoryId}_${i}_b`,
      name: "50 mg",
      price:
        seed.price !== null ? usd(Math.round(seed.price * 4.2)) : null,
      inStock: true,
    },
    {
      id: `var_${categoryId}_${i}_c`,
      name: "100 mg",
      price: seed.price !== null ? usd(Math.round(seed.price * 7.8)) : null,
      inStock: false,
    },
  ],
  price: seed.price !== null ? usd(seed.price) : null,
  badge: seed.badge ?? null,
  attributes: {
    ...(seed.cas ? { "CAS Number": seed.cas } : {}),
    Purity: seed.purity ?? "≥95% by HPLC",
    Storage: "-20 °C",
    "Lot Tracked": "Yes",
    Use: "Research Use Only",
  },
});

const sugarNucleotides: Seed[] = [
  {
    name: "UDP-GalNAz",
    price: 320,
    badge: "popular",
    cas: "868385-26-6",
    purity: "≥97% (HPLC)",
    description:
      "Azide-modified UDP-GalNAc analogue for metabolic glycan labelling and click chemistry workflows.",
    coverSrc: "/images/products/udp-galnaz.png",
  },
  {
    name: "GDP-Fucose",
    price: 280,
    cas: "15839-70-0",
    purity: "≥98%",
    coverSrc: "/images/products/gdp-fucose.png",
  },
  {
    name: "CMP-Neu5Ac",
    price: 410,
    badge: "sale",
    cas: "3063-71-6",
    purity: "≥96%",
    description: "Donor for α2,3- and α2,6-sialyltransferase reactions.",
    coverSrc: "/images/products/cmp-neu5az.png",
  },
  {
    name: "UDP-GlcNAc",
    price: 240,
    cas: "528-04-1",
    coverSrc: "/images/products/udp-galnac.png",
  },
  {
    name: "UDP-Galactose",
    price: 260,
    cas: "2956-16-3",
    coverSrc: "/images/science/nglycan-3d-colorful.png",
  },
  {
    name: "GDP-Mannose",
    price: 295,
    cas: "3123-67-9",
    coverSrc: "/images/science/molecule-3d.png",
  },
];

const glycoenzymes: Seed[] = [
  {
    name: "β1-4 Galactosyltransferase",
    price: null,
    description:
      "Recombinant bovine β1-4 GalT for in vitro galactosylation. High activity, low endotoxin.",
    coverSrc: "/images/products/cgtb-enzyme.png",
  },
  {
    name: "α2-6 Sialyltransferase",
    price: null,
    description:
      "ST6Gal1 for terminal α2,6-sialylation of N-glycans and O-glycans.",
    coverSrc: "/images/products/pd2-6st.png",
  },
  {
    name: "PNGase F",
    price: null,
    badge: "popular",
    description:
      "Releases N-linked oligosaccharides from glycoproteins. 15,000 units / vial.",
    coverSrc: "/images/science/signaling-pathway.png",
  },
  {
    name: "Endo H Kit",
    price: null,
    description: "Complete kit for selective release of high-mannose N-glycans.",
    coverSrc: "/images/science/glycoscience-folding-cycle.png",
  },
  {
    name: "Endo M Glycosynthase",
    price: null,
    badge: "new",
    coverSrc: "/images/science/antibody-bioorthogonal.png",
  },
  {
    name: "Neuraminidase (broad-spec)",
    price: null,
    coverSrc: "/images/science/cell-membrane-ecm.png",
  },
];

const oligos: Seed[] = [
  {
    name: "GloboH Hexasaccharide",
    price: 690,
    badge: "new",
    purity: "≥98% by HPLC",
    coverSrc: "/images/science/nglycan-complex-tall.png",
  },
  {
    name: "Blood Group A Tetrasaccharide",
    price: null,
    coverSrc: "/images/science/blood-group-glycans.png",
  },
  {
    name: "2'-Fucosyllactose (2'-FL)",
    price: 180,
    cas: "41263-94-9",
    coverSrc: "/images/products/l-fucose.png",
  },
  {
    name: "Sialyl Lewis X",
    price: 540,
    purity: "≥97%",
    coverSrc: "/images/science/oligosaccharide-structure.png",
  },
  {
    name: "Lacto-N-tetraose (LNT)",
    price: 220,
    coverSrc: "/images/science/nglycan-3d-colorful.png",
  },
  {
    name: "Lewis Y Tetrasaccharide",
    price: 480,
    badge: "sale",
    coverSrc: "/images/science/fucosylation-pathway.png",
  },
];

const arrays: Seed[] = [
  {
    name: "Mammalian N-Glycan Array (300)",
    price: null,
    description:
      "Curated set of 300 N-glycan structures spotted on epoxide slides for high-throughput screening.",
    coverSrc: "/images/science/glycan-array-surface.png",
  },
  {
    name: "Lectin Array — 96 Lectins",
    price: null,
    badge: "popular",
    coverSrc: "/images/science/nglycan-3d-colorful.png",
  },
  {
    name: "HMO Microarray (24 structures)",
    price: null,
    coverSrc: "/images/science/oligosaccharide-structure.png",
  },
];

const hmos: Seed[] = [
  { name: "3-Fucosyllactose (3-FL)", price: 195, coverSrc: "/images/products/l-fucose.png" },
  { name: "Lacto-N-fucopentaose II (LNFP II)", price: 365, badge: "new", coverSrc: "/images/science/fucosylation-pathway.png" },
  { name: "Sialyllacto-N-tetraose c (LSTc)", price: 410, coverSrc: "/images/science/molecule-3d.png" },
  { name: "Difucosyllacto-N-hexaose (DFLNH)", price: null, coverSrc: "/images/science/nglycan-complex-tall.png" },
];

const cyclodextrins: Seed[] = [
  { name: "β-Cyclodextrin (pharma grade)", price: 85, cas: "7585-39-9", coverSrc: "/images/science/nglycan-3d-colorful.png" },
  { name: "γ-Cyclodextrin", price: 110, cas: "17465-86-0", coverSrc: "/images/science/molecule-3d.png" },
  { name: "HP-β-Cyclodextrin", price: 145, badge: "popular", coverSrc: "/images/science/nglycan-complex-tall.png" },
];

export const mockProducts: Product[] = [
  ...sugarNucleotides.map((s, i) => makeProduct("cat_sugar_nuc", i + 1, s)),
  ...glycoenzymes.map((s, i) => makeProduct("cat_glycoenzymes", i + 1, s)),
  ...oligos.map((s, i) => makeProduct("cat_oligos", i + 1, s)),
  ...arrays.map((s, i) => makeProduct("cat_arrays", i + 1, s)),
  ...hmos.map((s, i) => makeProduct("cat_hmos", i + 1, s)),
  ...cyclodextrins.map((s, i) => makeProduct("cat_cyclodextrins", i + 1, s)),
];
