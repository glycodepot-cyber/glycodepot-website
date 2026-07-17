export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  body: ContentBlock[];
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  author: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "what-are-sugar-nucleotides",
    title: "What Are Sugar Nucleotides? A Researcher's Guide to Glycobiology Building Blocks",
    excerpt:
      "Sugar nucleotides are the activated forms of monosaccharides used in the biosynthesis of glycans. Understanding their structure, function, and diversity is fundamental to any glycobiology research program.",
    category: "Glycobiology Basics",
    tags: ["sugar nucleotides", "glycobiology", "UDP-glucose", "CMP-sialic acid", "glycan biosynthesis"],
    publishedAt: "2025-09-12",
    readTime: 6,
    author: "GlycoDepot Editorial",
    body: [
      {
        type: "p",
        text: "Sugar nucleotides — sometimes called nucleotide sugars or activated sugars — are the universal donors used by glycosyltransferases to build glycans on proteins, lipids, and other biomolecules. Without them, the elaborate carbohydrate coatings that decorate every cell in your body simply could not be assembled.",
      },
      {
        type: "h2",
        text: "Why Activation Matters",
      },
      {
        type: "p",
        text: "Free monosaccharides have very low reactivity. To transfer a sugar residue onto a growing glycan chain, the cell must first invest energy to form a high-energy bond between the sugar and a nucleoside diphosphate (or monophosphate, in the case of CMP-sialic acid). This activation step overcomes the thermodynamic barrier and drives glycan assembly forward.",
      },
      {
        type: "p",
        text: "The general structure is: nucleoside (or nucleotide) — diphosphate — monosaccharide. Examples include UDP-glucose, UDP-galactose, GDP-mannose, GDP-fucose, UDP-GlcNAc, UDP-GalNAc, and CMP-Neu5Ac (CMP-sialic acid). Each is synthesized in a dedicated biosynthetic pathway and transported into the Golgi lumen where glycosyltransferases reside.",
      },
      {
        type: "h2",
        text: "The Most Commonly Used Sugar Nucleotides in Research",
      },
      {
        type: "ul",
        items: [
          "UDP-Glucose — the starting point for many biosynthetic pathways, including glycogen and cellulose synthesis.",
          "UDP-Galactose — critical for lactose synthesis and the terminal galactosylation of N- and O-glycans.",
          "UDP-GlcNAc — central to N-glycan processing, GPI anchor assembly, and O-GlcNAc modification of nuclear proteins.",
          "GDP-Fucose — donor for fucosyltransferases that add fucose to selectin ligands and the core of N-glycans.",
          "CMP-Neu5Ac — the sole donor for all mammalian sialyltransferases; sialylation of glycans is crucial for cell signaling and pathogen recognition.",
          "UDP-GlcUA — glucuronic acid donor important for proteoglycan biosynthesis and detoxification reactions.",
        ],
      },
      {
        type: "h2",
        text: "How to Work with Sugar Nucleotides in the Lab",
      },
      {
        type: "p",
        text: "Sugar nucleotides are generally labile compounds. They are sensitive to hydrolysis by nucleotide pyrophosphatases and phosphatases, which are abundant in cell lysates and crude enzyme preparations. For in vitro glycosyltransferase assays, researchers should work at 4°C when possible, include phosphatase inhibitors, and use freshly dissolved substrate solutions.",
      },
      {
        type: "p",
        text: "Storage is equally important. Most sugar nucleotides are best kept at −80°C as lyophilized powders or concentrated aqueous solutions buffered to pH 7–8. Avoid repeated freeze-thaw cycles; working aliquots stored at −20°C are typically stable for 1–2 months.",
      },
      {
        type: "h3",
        text: "Purity and Analytical Considerations",
      },
      {
        type: "p",
        text: "When purchasing sugar nucleotides for assays, always verify purity by HPLC or NMR. Contaminating nucleotide diphosphates (UDP, GDP) are potent product-inhibitors of many glycosyltransferases and will artificially reduce your measured enzyme activity. Look for products with ≥95% purity and certificates of analysis that confirm both chemical identity and biological activity.",
      },
      {
        type: "callout",
        text: "GlycoDepot stocks an extensive range of sugar nucleotides for research use, sourced from expert labs and supplied with full CoA documentation. Browse our Sugar Nucleotides collection to find the right substrate for your assay.",
      },
      {
        type: "h2",
        text: "Emerging Applications",
      },
      {
        type: "p",
        text: "Beyond classic biochemistry, sugar nucleotides are finding new roles in chemical biology. Unnatural sugar nucleotide analogs — such as UDP-GalNAz or GDP-FucAz — carry bioorthogonal handles (azides, alkynes) that allow researchers to metabolically label glycoproteins and track them in living cells using click chemistry. This approach, pioneered by the Bertozzi lab, has opened an entire field of chemical glycobiology.",
      },
      {
        type: "p",
        text: "Advances in chemoenzymatic synthesis are also making it feasible to produce custom sugar nucleotides at scale, enabling high-throughput screening of glycosyltransferase activity and the synthesis of defined glycoconjugates for therapeutic development.",
      },
    ],
  },
  {
    slug: "glycoenzymes-in-research",
    title: "Glycoenzymes in Research: Types, Functions, and How to Choose the Right One",
    excerpt:
      "Glycoenzymes — glycosyltransferases, glycosidases, and glycan-remodeling enzymes — are the molecular tools that build, trim, and restructure glycans. Here is what researchers need to know.",
    category: "Research Tools",
    tags: ["glycoenzymes", "glycosyltransferases", "glycosidases", "enzyme research", "glycobiology"],
    publishedAt: "2025-10-08",
    readTime: 7,
    author: "GlycoDepot Editorial",
    body: [
      {
        type: "p",
        text: "Glycoenzymes are the biological catalysts responsible for the synthesis, modification, and degradation of glycans. They underpin nearly every aspect of carbohydrate biology — from the assembly of complex N-glycans on secretory proteins to the precise trimming of oligosaccharides during lysosomal storage. For researchers who work with glycoproteins, proteoglycans, or polysaccharides, choosing the right glycoenzyme can make or break an experiment.",
      },
      {
        type: "h2",
        text: "The Two Major Classes",
      },
      {
        type: "h3",
        text: "Glycosyltransferases",
      },
      {
        type: "p",
        text: "Glycosyltransferases catalyze the transfer of a sugar residue from an activated donor (a nucleotide sugar) onto a specific acceptor molecule, creating a new glycosidic bond. The human genome encodes roughly 200 glycosyltransferases, organized into CAZy GT families based on sequence and structural similarity. Each enzyme typically shows exquisite specificity for its donor sugar, acceptor substrate, and the stereochemistry of the bond it forms (α or β).",
      },
      {
        type: "ul",
        items: [
          "Fucosyltransferases (FUT family) — add fucose to glycoprotein cores and selectin ligands such as sialyl-Lewis X.",
          "Sialyltransferases (ST3, ST6, ST8 families) — cap glycan chains with sialic acid; crucial determinants of serum half-life for therapeutic glycoproteins.",
          "Galactosyltransferases — responsible for terminal β1,4-galactosylation, a common modification in N-glycan maturation.",
          "GlcNAc transferases (MGAT family) — extend N-glycan antennae and are key control points in glycan branching.",
          "GalNAc-Ts — O-GalNAc transferases that initiate mucin-type O-glycosylation on Ser/Thr residues.",
        ],
      },
      {
        type: "h3",
        text: "Glycosidases (Glycoside Hydrolases)",
      },
      {
        type: "p",
        text: "Glycosidases cleave glycosidic bonds using either a retaining or inverting mechanism. In research, they serve two distinct purposes: sequencing glycan structures (analytical use) and remodeling or trimming glycoproteins for functional studies.",
      },
      {
        type: "ul",
        items: [
          "PNGase F — removes all complex, hybrid, and high-mannose N-glycans from glycoproteins en bloc; the workhorse of N-glycan release.",
          "Endo H / Endo Hf — cleaves only high-mannose and some hybrid N-glycans, making it useful for distinguishing ER-resident glycoproteins.",
          "O-glycanase (Endo-α-N-acetylgalactosaminidase) — releases core 1 O-glycans (Galβ1-3GalNAc-) from peptides.",
          "Neuraminidase (sialidase) — removes terminal sialic acid residues; different isoforms show α2-3 vs α2-6 linkage specificity.",
          "α-Fucosidase — trims fucose residues; used analytically and for glycoprotein remodeling.",
          "β-Galactosidase — broad-specificity versions are used to study galactosylation in glycan arrays and ELISA formats.",
        ],
      },
      {
        type: "h2",
        text: "Selecting the Right Enzyme for Your Application",
      },
      {
        type: "p",
        text: "The most important considerations are substrate specificity, linkage selectivity, and reaction conditions. Many glycosidases show linkage preference (e.g., α2-3 vs α2-6 neuraminidase from Arthrobacter vs bovine liver) that must match your experimental glycan. Always confirm activity with a defined glycan standard before using a new enzyme lot in quantitative experiments.",
      },
      {
        type: "p",
        text: "Buffer compatibility matters enormously. Glycosyltransferases typically require a divalent cation (Mn²⁺ or Mg²⁺), whereas glycosidases are generally active without metal cofactors. pH optima range from 4–5 for lysosomal enzymes to 6.5–7.5 for Golgi-localized ones. Recombinant enzymes expressed in E. coli may behave differently from native enzyme isolated from tissue — check your supplier's data sheet carefully.",
      },
      {
        type: "h2",
        text: "Quality Control in Glycoenzyme Research",
      },
      {
        type: "p",
        text: "Enzyme lot-to-lot variability is a persistent challenge in glycobiology. A given lot of PNGase F may have markedly different specific activity than a previous lot, introducing silent variability into deglycosylation efficiency. Best practice is to run a side-by-side comparison with your previous lot and a defined glycoprotein standard (e.g., ribonuclease B for N-glycan release) whenever you open a new vial.",
      },
      {
        type: "callout",
        text: "GlycoDepot supplies research-grade glycoenzymes with individual lot-specific activity data. Browse our Glycoenzymes catalogue to find glycosyltransferases, PNGase F, sialidases, and more — all supplied with CoA and specification sheets.",
      },
    ],
  },
  {
    slug: "human-milk-oligosaccharides-hmos",
    title: "Human Milk Oligosaccharides (HMOs): Structure, Function, and Research Applications",
    excerpt:
      "Human milk oligosaccharides are the third most abundant solid component of human breast milk. Their complex structures and diverse bioactivities have made them one of the fastest-growing areas of glycoscience research.",
    category: "Oligosaccharides",
    tags: ["HMOs", "human milk oligosaccharides", "2-FL", "LNT", "infant nutrition", "prebiotic", "glycobiology"],
    publishedAt: "2025-11-14",
    readTime: 8,
    author: "GlycoDepot Editorial",
    body: [
      {
        type: "p",
        text: "Human milk oligosaccharides (HMOs) are a diverse family of complex carbohydrates found almost exclusively in human breast milk. With concentrations of 5–15 g/L in mature milk and up to 20–25 g/L in colostrum, HMOs are the third most abundant solid after lactose and fat. Despite their abundance, infants cannot digest HMOs — they serve as functional bioactive agents rather than caloric substrates.",
      },
      {
        type: "h2",
        text: "Structural Diversity of HMOs",
      },
      {
        type: "p",
        text: "More than 200 structurally distinct HMOs have been identified, all built on a common lactose (Galβ1-4Glc) core. Elongation occurs via alternating β1-3 and β1-6 glycosidic linkages using lacto-N-biose or N-acetyllactosamine units. The resulting chains can be further decorated with fucose (α1-2 or α1-3/4 linkages) and/or sialic acid (α2-3 or α2-6 linkages). The diversity arises from combinatorial assembly of these building blocks.",
      },
      {
        type: "ul",
        items: [
          "2'-Fucosyllactose (2'-FL) — the most abundant HMO in most mothers' milk; α1-2-fucosylated lacose. Present in infant formula supplementation trials.",
          "Lacto-N-tetraose (LNT) — a core type-1 chain structure; benchmark for lactose-extended HMOs.",
          "Lacto-N-neotetraose (LNnT) — type-2 chain counterpart of LNT; both are approved for infant formula use in several jurisdictions.",
          "3'-Sialyllactose (3'-SL) and 6'-Sialyllactose (6'-SL) — sialylated core HMOs; major precursors of ganglioside-type structures.",
          "Difucosyllactose (DFL / LNDFH) — highly fucosylated structures with potent anti-adhesion activity against bacterial pathogens.",
        ],
      },
      {
        type: "h2",
        text: "Biological Functions",
      },
      {
        type: "h3",
        text: "Prebiotic Activity and Microbiome Shaping",
      },
      {
        type: "p",
        text: "The primary biological role attributed to HMOs is selective modulation of the infant gut microbiome. Bifidobacterium longum subsp. infantis and related strains encode HMO-specific transporters and glycoside hydrolases that allow them to consume HMOs as a primary carbon source. This confers a competitive advantage over non-HMO-consuming bacteria, promoting the bloom of Bifidobacterium that characterizes the breastfed infant gut.",
      },
      {
        type: "h3",
        text: "Pathogen Decoys",
      },
      {
        type: "p",
        text: "Many enteric pathogens — including Campylobacter jejuni, enteropathogenic E. coli, and Vibrio cholerae — use glycan structures as adhesion receptors on epithelial cells. HMOs that mimic these glycan structures can act as soluble decoys, competitively inhibiting pathogen binding. 2'-FL, for instance, bears structural similarity to H-antigen Lewis blood group epitopes and has been shown to reduce adhesion of Campylobacter to intestinal cells in vitro.",
      },
      {
        type: "h3",
        text: "Immune Modulation and Intestinal Maturation",
      },
      {
        type: "p",
        text: "HMOs directly interact with intestinal epithelial cells and immune cells. Several studies have demonstrated that HMOs reduce NF-κB activation and pro-inflammatory cytokine production in intestinal epithelial models. They also appear to accelerate intestinal barrier maturation, increasing tight junction protein expression. These effects may contribute to the lower incidence of necrotizing enterocolitis (NEC) observed in breastfed premature infants.",
      },
      {
        type: "h3",
        text: "Neurological Development",
      },
      {
        type: "p",
        text: "Sialylated HMOs (3'-SL and 6'-SL) are potential precursors for brain ganglioside synthesis. During the rapid brain growth of the first year of life, the demand for sialic acid is exceptionally high. Several animal studies suggest that HMO-supplemented diets improve cognitive outcomes compared with unsupplemented controls, though direct evidence in human infants remains an active area of investigation.",
      },
      {
        type: "h2",
        text: "Research Applications of HMOs",
      },
      {
        type: "ul",
        items: [
          "Microbiome studies — use individual HMOs to selectively stimulate or inhibit bacterial strains in vitro and in germ-free mouse models.",
          "Lectin and pathogen adhesion assays — coat microplates or glycan arrays with defined HMOs to screen adhesins and lectins.",
          "Enzyme characterization — HMOs are excellent substrates for characterizing novel glycosidases from gut microbiota.",
          "Infant formula development — regulatory-approved HMOs (2'-FL, LNnT, 3'-SL, etc.) for supplementation studies.",
          "Mass spectrometry method development — the structural diversity of HMOs makes them valuable standards for developing glycan LC-MS/MS methods.",
        ],
      },
      {
        type: "callout",
        text: "GlycoDepot offers a curated selection of human milk oligosaccharides for research use, including 2'-FL, 3'-SL, 6'-SL, LNT, and LNnT. Each product is supplied with HPLC purity data and NMR confirmation. Browse our Oligosaccharides collection.",
      },
    ],
  },
  {
    slug: "getting-started-with-glycan-arrays",
    title: "Getting Started with Glycan Arrays: A Complete Researcher's Guide",
    excerpt:
      "Glycan arrays allow you to screen hundreds of defined carbohydrate structures against lectins, antibodies, and pathogens in a single experiment. Here is everything you need to know to design a successful glycan array study.",
    category: "Glycan Arrays",
    tags: ["glycan arrays", "lectin binding", "carbohydrate-protein interactions", "microarray", "glycomics"],
    publishedAt: "2026-01-20",
    readTime: 9,
    author: "GlycoDepot Editorial",
    body: [
      {
        type: "p",
        text: "Glycan arrays are high-density microarrays on which hundreds of chemically defined glycan structures are covalently immobilized. By incubating a labeled protein — a lectin, antibody, or even an intact pathogen — with the array, researchers can simultaneously determine the binding specificity across an entire library of glycan epitopes in a single experiment. This approach has transformed our understanding of glycan-binding proteins (GBPs) and revealed the remarkable complexity of carbohydrate recognition.",
      },
      {
        type: "h2",
        text: "How Glycan Arrays Work",
      },
      {
        type: "p",
        text: "Most glycan arrays use NHS-ester activated glass slides or nitrocellulose-coated surfaces to covalently couple amino-functionalized glycan probes via a flexible linker. This linker is critical: it spaces the glycan away from the surface and mimics the multivalent display found on cell surfaces, which dramatically influences lectin binding avidities.",
      },
      {
        type: "p",
        text: "After printing the array, it is blocked (typically with ethanolamine or BSA), incubated with the fluorescently labeled test protein, washed, and scanned on a standard microarray fluorescence scanner. The resulting data — relative fluorescence intensity for each spot — directly reports the binding preference of the test protein for each glycan structure on the array.",
      },
      {
        type: "h2",
        text: "Key Applications",
      },
      {
        type: "ul",
        items: [
          "Lectin specificity profiling — determine the preferred ligands of recombinant lectins or plant agglutinins with single-linkage resolution.",
          "Antibody glycan recognition — characterize anti-carbohydrate antibody responses in vaccines, cancer immunology, and autoimmune disease.",
          "Pathogen binding — identify which host glycan epitopes a virus, bacterium, or parasite uses for adhesion; critical for designing receptor decoys.",
          "Enzyme substrate mapping — use the array as a substrate panel to define the activity range of glycosidases and glycosyltransferases.",
          "Therapeutic glycoprotein characterization — profile which host lectins (e.g., asialoglycoprotein receptor, mannose receptor) interact with your drug's glycans.",
        ],
      },
      {
        type: "h2",
        text: "Designing Your Experiment",
      },
      {
        type: "h3",
        text: "Choosing an Array Platform",
      },
      {
        type: "p",
        text: "The Consortium for Functional Glycomics (CFG) Mammalian Printed Array covers ~600 mammalian glycans and is the most widely used reference library. The Glycan Array Synthesis Core at Emory University and commercial platforms (e.g., Lectenz Bio, Sussex Research) offer custom and focused arrays targeting specific glycan families. For most initial experiments, starting with a broad mammalian array and then following up with a focused custom array is a cost-effective strategy.",
      },
      {
        type: "h3",
        text: "Protein Labeling",
      },
      {
        type: "p",
        text: "The test protein is typically labeled with Cy3, Cy5, or Alexa-series fluorophores using NHS-ester chemistry. The degree of labeling (DOL) must be optimized carefully — overlabeling can reduce binding by steric occlusion of the binding site. Aim for 1–3 fluorophores per protein monomer. Alternatively, primary-antibody plus fluorescent secondary antibody detection works well for native proteins where direct labeling is impractical.",
      },
      {
        type: "h3",
        text: "Controls and Replicates",
      },
      {
        type: "p",
        text: "Each glycan should be spotted in at least triplicate on the array. Include a positive control glycan of known specificity for your protein, a negative control (e.g., irrelevant glycan or surface without glycan), and a protein-only background control (labeled protein on an unprinted surface). Technical replicates across multiple slides reduce the impact of spotting variability.",
      },
      {
        type: "h2",
        text: "Data Analysis and Interpretation",
      },
      {
        type: "p",
        text: "Raw fluorescence values should be background-subtracted and normalized. Common normalization approaches include dividing by the median of all signals or by the intensity of a reference standard spotted at known concentration. Z-score normalization is useful for comparing multiple proteins on the same array. Hits are typically defined as signals exceeding mean + 2–3 standard deviations of the negative control distribution.",
      },
      {
        type: "p",
        text: "Interpretation requires care. High signal indicates binding, but does not establish thermodynamic affinity — array signals reflect avidity (multivalent interactions amplified by the surface) rather than true Kd. Follow up hits with solution-phase measurements (ITC, SPR, MST) to establish binding constants and confirm mono- vs multivalent contributions.",
      },
      {
        type: "callout",
        text: "GlycoDepot supplies individually verified glycan probes, linker-coupled glycan standards, and lectin-ready arrays suitable for in-house printing. Contact our team to discuss a custom array solution tailored to your research focus.",
      },
      {
        type: "h2",
        text: "Common Pitfalls",
      },
      {
        type: "ul",
        items: [
          "Humidity during printing — glycan arrays should be printed at 50–60% relative humidity to ensure uniform spot morphology.",
          "Buffer carry-over — use freshly prepared buffers; detergent residues dramatically alter non-specific binding backgrounds.",
          "Photo-bleaching — scan arrays immediately after washing; fluorescent signal degrades rapidly in ambient light.",
          "Over-interpreting weak positives — clusters of structurally related glycan positives are more meaningful than isolated weak hits.",
          "Ignoring glycan orientation — some immobilization chemistries can bury the binding epitope; test both reducing-end and non-reducing-end coupling where possible.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((p) => p.category === category);
}

export const blogCategories = [...new Set(blogPosts.map((p) => p.category))];
