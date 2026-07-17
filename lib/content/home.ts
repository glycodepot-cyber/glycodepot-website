export interface HeroSlide {
  headline: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  image: { src: string; alt: string; fit?: "cover" | "contain" };
}

export const heroSlides: HeroSlide[] = [
  {
    headline: "Your Trusted Source for Glycoscience Solutions",
    body: "We're committed to delivering high-quality reagents and raw materials, from expert labs to yours. Experience the highest service at its core.",
    ctaLabel: "Shop All Products",
    ctaHref: "/products",
    image: {
      src: "/images/science/n-glycan-cg-m62111.jpeg",
      alt: "N-Glycan CG-M62111 molecular structure diagram",
      fit: "cover",
    },
  },
  {
    headline: "Transform Your Glycoscience Idea to Reality",
    body: "Sourcing glycoscience supplies for your biggest projects made easy at GlycoDepot — from building blocks, glycans, enzymes and expert services.",
    ctaLabel: "Shop Now",
    ctaHref: "/products",
    image: {
      src: "/images/science/n-glycan-cg-n025.jpeg",
      alt: "N-Glycan CG-N025 GlcNAc structure with symbolic linkage diagram",
    },
  },
  {
    headline: "Complex Science Needs Expert Help",
    body: "Get a consultation or service from our dedicated experts in the field — whether it's glycoprofiling, glycan engineering, or formulation development.",
    ctaLabel: "Learn More",
    ctaHref: "/services",
    image: {
      src: "/images/science/fucosylation-pathway.png",
      alt: "Fucosylation biosynthesis pathway diagram",
    },
  },
  {
    headline: "Our Mission — Bring the Best of Glycoscience",
    body: "We connect glycoscientists worldwide, making products and services easy to access.",
    ctaLabel: "Sell With Us",
    ctaHref: "/start-selling",
    image: {
      src: "/images/science/nglycan-3d-colorful.png",
      alt: "3D model of a complex N-glycan branching structure",
    },
  },
];

export const featuredProducts = {
  label: "Featured Products",
  heading:
    "Buy sugar nucleotides from our largest collection of natural and modified versions",
  categoryKey: "sugar-nucleotides",
};

export const glycoenzymesGrid = {
  heading: "Glycosyltransferases, Glycosidases, Kits and More",
  categoryKey: "glycoenzymes",
};

export const oligosGrid = {
  heading: "Glycoanalysis — Standards, Substrates, Reference Materials",
  categoryKey: "glycoanalysis",
};

export const highlightedProducts = {
  heading:
    "Unlock the Power of Sugar Nucleotides & Glycoanalysis — Glycosyltransferases, Glycosidases, Kits and More",
  panels: [
    {
      title: "Sugar Nucleotides",
      description:
        "High-purity building blocks for glycosylation research. Ideal for enzymatic synthesis and biotech applications.",
    },
    {
      title: "Glycobiology Arrays",
      description:
        "Precision tools for analyzing glycan structures, empowering breakthroughs in biomedical and biotech research.",
    },
  ],
  tabs: ["Top Rated", "Best Selling", "On Sale"] as const,
};

export interface GlycanSolution {
  title: string;
  body: string;
  bullets: string[];
}

export const glycanSolutions: {
  heading: string;
  subheading: string;
  cards: GlycanSolution[];
} = {
  heading: "Explore Our Glycan Solutions",
  subheading:
    "High-purity, scalable, and application-specific oligosaccharides engineered for global impact",
  cards: [
    {
      title: "Human Milk Oligosaccharides (HMOs)",
      body: "Precisely engineered via chemo-enzymatic and cell-based platforms. Used in infant nutrition, microbiome research, and immunology.",
      bullets: [">95% Purity", "Regioselective synthesis", "Custom blends available"],
    },
    {
      title: "Cyclodextrins",
      body: "Molecular carriers used across pharmaceuticals, cosmetics, and food industries. Supports solubility and encapsulation needs.",
      bullets: ["α, β, and γ forms", "High complexation capacity", "Pharmaceutical-grade options"],
    },
    {
      title: "Chitosan & Hyaluronic Acid",
      body: "Biocompatible glycans for wound healing, skincare, and biomedical engineering. Available in varied molecular weights.",
      bullets: ["Biodegradable & safe", "High molecular control", "Moisture-retaining formulas"],
    },
  ],
};

export interface Application {
  title: string;
  body: string;
}

export const applications: Application[] = [
  {
    title: "Pharmaceutical & Biotech",
    body: "Glycans for drug development, glyco-therapeutics, vaccine design, and biomarker discovery.",
  },
  {
    title: "Nutraceuticals & Infant Nutrition",
    body: "HMOs and oligosaccharides to support gut health and immune function.",
  },
  {
    title: "Cosmetics & Personal Care",
    body: "Hyaluronic acid and cyclodextrins for moisturizing, delivery, and stabilization.",
  },
  {
    title: "Food & Agriculture",
    body: "Functional oligosaccharides for prebiotics, food additives, and crop enhancement.",
  },
];

export const contactBanner = {
  body: "For inquiries about bulk orders, custom synthesis, or technical support on our glycan products, please contact our sales team. We are committed to providing high-quality glycans tailored to your specific research or industrial requirements.",
  ctaLabel: "Get in Touch",
  ctaHref: "/contact",
};

export interface Discipline {
  title: string;
  body: string;
}

export const glycoscience = {
  heading: "What is Glycoscience?",
  intro:
    "Glycoscience is the science of complex carbohydrates (glycans). They play an essential role in biological systems. Glycoscience is an enabling science that overlaps biochemistry, immunology, and biotechnology. Research based on this field leads to future breakthroughs — in drug discovery, disease diagnosis, and biomarker discovery. Glycan structures allow researchers to develop new drugs and enhance biomedical research productivity based on human biological functions. GlycoDepot offers high-quality glycoscience products and services to researchers, the pharmaceutical market, and academia. Our products aid glycan research and drive excellence in glycochemistry, glycobiology, and glycoanalysis outcomes.",
  disciplinesHeading: "Core Disciplines",
  disciplines: [
    {
      title: "Glycochemistry",
      body: "Glycochemistry deals with the chemical synthesis, modification, and analysis of carbohydrates. Our research-grade glycochemistry products include reagents, sugar derivatives, and chemical synthesis tools — required for glycan functionalization. Scientists use them for drug discovery, vaccine design, and bioengineering.",
    },
    {
      title: "Glycobiology",
      body: "Glycobiology explores the biological function of carbohydrates in biological systems. It affects cell signaling, immune defense, and pathogen recognition. Our glycobiology products include glycan-binding proteins, glycan metabolic enzymes, and analytical reagents — mainly used for glycan structure–function studies relevant in glycomics and biomedical sciences.",
    },
    {
      title: "Glycoanalysis",
      body: "Glycoanalysis is perhaps the most important research field for glycoscience, providing information about glycan composition and structure. Our products include mass-spectrometry standards, fluorescent labeling kits, and chromatography instruments. The tools allow researchers to accurately study glycan profiles of biological and clinical samples — advancing therapeutics and disease diagnosis.",
    },
  ] as Discipline[],
};

export const whyChooseUs = {
  heading: "Why Choose Us?",
  columns: [
    {
      title: "Quality Assurance",
      body: "ISO 9001:2015 certified facilities with complete analytical documentation and batch tracking.",
    },
    {
      title: "Timely Delivery",
      body: "Guaranteed project timelines with real-time tracking and dedicated project management.",
    },
    {
      title: "Expert Team",
      body: "PhD-level scientists with 15+ years experience in carbohydrate chemistry and analysis.",
    },
  ],
};

export const ourServices = {
  heading: "Our Services",
  cards: [
    {
      title: "Glycosylation Analysis",
      body: "Comprehensive characterization of glycosylation patterns using state-of-the-art LC-MS/MS platforms and bioinformatics tools. Professional consultation on glycoscience applications and research planning.",
      ctaLabel: "Get in Touch",
      ctaHref: "/contact",
    },
    {
      title: "Enzyme Engineering",
      body: "Custom glycosyltransferase development and optimization. High-yield expression systems for industrial-scale enzyme production. Extremely precise glycan identification using the latest analysis methods.",
      ctaLabel: "Get in Touch",
      ctaHref: "/contact",
    },
    {
      title: "Custom Glycan Synthesis",
      body: "Tailored production of complex oligosaccharides and glycoconjugates with >98% purity. GMP/GLP compliant synthesis from mg to kg scale. Custom glycans produced according to individual research requirements.",
      ctaLabel: "Get in Touch",
      ctaHref: "/contact",
    },
  ],
};

export const startSellingBanner = {
  features: [
    "We know the field better than anyone",
    "Warehouse support in the US",
    "More products, more visibility",
    "Expert technical support",
    "Easy listing of products",
    "We are result-oriented",
    "Product listing is 100% free",
  ],
  primaryCta: { label: "Start Selling", href: "/start-selling" },
  secondaryCta: { label: "Contact us", href: "/contact" },
};
