export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string }
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
  {
    slug: "what-is-glycosylation",
    title: "What Is Glycosylation? A Practical Guide for Researchers",
    excerpt:
      "Glycosylation is the enzymatic attachment of a carbohydrate to a protein, lipid, or small molecule. Here is how the main types differ, what the enzymes and sugar donors are, and how to analyze glycosylation at the bench.",
    category: "Glycobiology Basics",
    tags: [
      "glycosylation",
      "N-linked glycosylation",
      "O-glycosylation",
      "glycosyltransferases",
      "sialylation",
      "glycomics",
    ],
    publishedAt: "2026-11-14",
    readTime: 9,
    author: "GlycoDepot Editorial",
    body: [
      {
        type: "image",
        src: "https://cdn.marblism.com/P11mYDeZufE.png",
        alt: "A biantennary, core-fucosylated, disialylated N-glycan attached to a membrane protein, drawn in CFG symbol notation",
        caption:
          "A biantennary N-glycan with core fucose (α1-6) and two α2-3 sialic acids, as it would appear on a cell-surface glycoprotein. Structure drawn from GlyTouCan G17689DH.",
      },
      {
        type: "p",
        text: "Glycosylation is the enzymatic attachment of a carbohydrate, or sugar, to a protein, lipid, or small molecule. The attached carbohydrate, often a single sugar or a more complex structure called a glycan, can change how that molecule folds, behaves, moves through a cell, or interacts with other molecules. Glycosylation is a family of processes, not one fixed modification: the resulting structures depend on the enzymes, sugar donors, cell type, and conditions involved.",
      },
      {
        type: "h2",
        text: "Why is glycosylation important?",
      },
      {
        type: "p",
        text: "For proteins, glycans can support folding and quality control, affect stability and trafficking, and influence cell signaling and immune recognition. They can also affect a protein's interactions with other molecules. The outcome depends on the protein and the glycan; adding a sugar does not always have the same effect.",
      },
      {
        type: "p",
        text: "Protein glycosylation is also a key consideration in biologic research and manufacturing. Glycan features such as branching, fucosylation, and sialylation can influence a biologic's properties, including how long it circulates in the body. These effects are molecule-specific, so glycan characterization helps researchers understand and compare a protein rather than assume a particular glycan will produce a particular outcome.",
      },
      {
        type: "p",
        text: "Unlike a sequence-defined modification, many glycans are not built from a direct template. They are assembled and remodeled by enzymes, so one protein may occur as a mixture of related glycoforms.",
      },
      {
        type: "h2",
        text: "Where are glycans built?",
      },
      {
        type: "p",
        text: "For proteins entering the secretory pathway, glycosylation begins mainly in the endoplasmic reticulum (ER) and continues in the Golgi apparatus. N-linked glycans are initiated in the ER, where a preassembled sugar structure is transferred to a protein. The glycan is then trimmed and processed; the Golgi adds or modifies sugars to produce a range of mature structures.",
      },
      {
        type: "p",
        text: "Other types have different locations. Mucin-type O-glycans are mainly built stepwise in the Golgi, while O-GlcNAc is added to intracellular proteins in the cytoplasm and nucleus. GPI anchors are assembled in the ER and can be remodeled later in the Golgi.",
      },
      {
        type: "image",
        src: "https://cdn.marblism.com/FP2S3gI2fck.png",
        alt: "Pathway showing a high-mannose precursor glycan in the ER, stepwise processing in the Golgi, and a mature sialylated glycoprotein at the cell surface",
        caption:
          "In the secretory pathway, the ER initiates N-glycosylation with a high-mannose precursor and the Golgi processes it further. Structures drawn from GlyTouCan G00028MO (Man5) and G17689DH.",
      },
      {
        type: "h2",
        text: "Types of glycosylation",
      },
      {
        type: "p",
        text: "The names describe, in part, how a sugar attaches to its target. The most familiar forms include:",
      },
      {
        type: "ul",
        items: [
          "N-linked glycosylation: A glycan attaches to the nitrogen atom in the side chain of asparagine (Asn). A common recognition sequence is Asn-X-Ser/Thr, where X is any amino acid except proline. This sequence is called a sequon, but its presence does not guarantee that the site will be occupied.",
          "O-linked, or mucin-type, glycosylation: Sugars attach to the oxygen atom in the side chain of serine (Ser) or threonine (Thr). Mucin-type O-glycosylation usually begins with GalNAc and is extended step by step, mainly in the Golgi.",
          "O-GlcNAcylation: A single N-acetylglucosamine (GlcNAc) is attached to Ser or Thr on intracellular proteins. It is dynamically added and removed, rather than extended into a large glycan.",
          "C-linked glycosylation: A sugar forms a carbon-carbon bond to an amino acid. C-mannosylation of tryptophan is a less common example.",
          "GPI anchors: A glycan-containing glycolipid anchor attaches to a protein's C-terminus and helps tether the protein to a membrane.",
          "Glycolipids: Glycans attach to lipids rather than proteins. These molecules are components of cell membranes.",
          "Enzymatic glycosylation of small molecules: Glycosyltransferases can transfer sugars onto small-molecule acceptors, often called aglycones. Researchers use this approach to make and study glycosylated compounds.",
        ],
      },
      {
        type: "p",
        text: "The main N-linked and mucin-type O-linked pathways differ in their attachment site and how their glycans are assembled.",
      },
      {
        type: "image",
        src: "https://cdn.marblism.com/0t_XijXEA-j.png",
        alt: "Side-by-side comparison of an N-linked glycan on asparagine and a sialyl-T O-glycan on serine or threonine",
        caption:
          "Both panels use CFG symbol notation. The N-glycan is the biantennary, core-fucosylated, disialylated structure GlyTouCan G17689DH; the O-glycan is the sialyl-T antigen, Neu5Acα2-3Galβ1-3GalNAcα1-Ser/Thr (G65562ZE).",
      },
      {
        type: "ul",
        items: [
          "Attachment residue: asparagine for N-linked; serine or threonine for mucin-type O-linked.",
          "Sequence feature: the Asn-X-Ser/Thr sequon for N-linked (X is not proline); no single universal consensus sequon for O-linked.",
          "Where it begins: the ER for N-linked, with further processing in the Golgi; mainly the Golgi for O-linked.",
          "Assembly: a precursor glycan is transferred as a unit and then processed for N-linked; sugars are added step by step for O-linked.",
          "Typical role: folding and quality control plus protein properties and interactions for N-linked; common on mucins and other secreted or cell-surface proteins for O-linked.",
        ],
      },
      {
        type: "p",
        text: "The comparison describes common pathways; other forms of O-linked glycosylation have distinct starting sugars and locations.",
      },
      {
        type: "h2",
        text: "The molecular players: enzymes and sugar donors",
      },
      {
        type: "p",
        text: "Glycosyltransferases build glycans by transferring a sugar from a donor molecule to an acceptor, such as a growing glycan or a protein. Different transferases favor different sugar donors, acceptor structures, and linkages. Glycosidases remove sugars or trim glycans, helping shape structures as they mature.",
      },
      {
        type: "p",
        text: "Many glycosyltransferases use activated sugar donors called nucleotide sugars. Examples include UDP-GlcNAc for GlcNAc transfer, GDP-fucose for fucosylation, and CMP-Neu5Ac for sialylation. The donor must match the enzyme and reaction.",
      },
      {
        type: "p",
        text: "Two terms you may encounter are fucosylation, the addition of fucose, and sialylation, the addition of sialic acid, often at the ends of glycan branches. Their effects depend on the glycan structure and biological context.",
      },
      {
        type: "h2",
        text: "At the bench: how do researchers analyze glycosylation?",
      },
      {
        type: "p",
        text: "No single method answers every question. Choose the approach based on whether you need to know which sites are occupied, what glycan structures are present, or how a sample compares with a control.",
      },
      {
        type: "ul",
        items: [
          "LC-MS/MS: mass spectrometry can be used to study intact glycopeptides, linking glycan information to a protein site, or to analyze released glycans. The workflow and fragmentation strategy affect how much structural detail can be assigned.",
          "Released-glycan profiling: enzymes such as PNGase F can release many N-linked glycans from proteins for profiling. This can help compare glycan distributions, but by itself it does not retain the original protein-site information.",
          "HILIC: hydrophilic interaction liquid chromatography can separate or enrich glycans and glycopeptides based on their hydrophilic properties. It is often paired with mass spectrometry.",
          "Lectin blots: lectins bind selected glycan features. A lectin blot can provide a useful motif-focused comparison, but binding is not a complete structural identification. Interpret the result alongside appropriate controls or an orthogonal method.",
        ],
      },
      {
        type: "h3",
        text: "What can go wrong in expression systems?",
      },
      {
        type: "p",
        text: "A host cell's glycosylation machinery helps determine the glycans produced. Different cell types may generate different patterns, and culture conditions or process changes can shift glycan distributions. Yeast and plant systems, for example, may produce glycan features that differ from those commonly found in mammalian cells. Engineered systems can alter these patterns, so the host and engineering details matter.",
      },
      {
        type: "p",
        text: "Even within one system, glycosylation can be incomplete or heterogeneous. A potential N-glycosylation site may not be occupied, and processing may vary across molecules in the same sample. If the question concerns a particular protein or product, measure the sample rather than infer its glycan structures from the expression host alone.",
      },
      {
        type: "h3",
        text: "What should you control for?",
      },
      {
        type: "p",
        text: "Start by defining the question: site occupancy, glycan composition, a specific motif, or a change between conditions. Then plan controls around the method and sample:",
      },
      {
        type: "ul",
        items: [
          "Keep expression, harvest, storage, and sample preparation consistent across compared groups.",
          "Normalize protein input and include biological replicates where appropriate.",
          "Use enzyme-treated samples or suitable standards to support assignments; include untreated controls when they clarify the result.",
          "Consider whether your preparation or instrument method could lose or alter features of interest, especially labile groups.",
          "Pair broad profiling with site-specific or motif-focused analysis when the interpretation requires it.",
        ],
      },
      {
        type: "p",
        text: "A clear sample plan makes it easier to distinguish real biological differences from variation introduced by handling or measurement.",
      },
      {
        type: "h2",
        text: "Glycosylation FAQ",
      },
      {
        type: "h3",
        text: "Is glycosylation the same as glycation?",
      },
      {
        type: "p",
        text: "No. Glycosylation is an enzyme-directed process in which a sugar is attached to a target molecule. Glycation is a non-enzymatic reaction between a reducing sugar and a molecule such as a protein. The two processes differ in mechanism and in the structures they produce.",
      },
      {
        type: "h3",
        text: "What is the difference between glycosylation and a glycosidic bond?",
      },
      {
        type: "p",
        text: "Glycosylation is the process of adding a sugar to another molecule. A glycosidic bond is the chemical linkage that connects sugars to each other, or a sugar to another part of a molecule. A glycosylation reaction forms a bond as part of the attachment.",
      },
      {
        type: "h3",
        text: "Are all N-linked glycans the same?",
      },
      {
        type: "p",
        text: "No. Proteins can carry different N-glycan structures at different sites, and occupancy or processing can vary. The final pattern depends on factors such as the protein, host cell, and cellular processing.",
      },
      {
        type: "h3",
        text: "What does it mean when a protein is sialylated or fucosylated?",
      },
      {
        type: "p",
        text: "It means that sialic acid or fucose, respectively, is present as part of the protein's glycan structures. These terms describe glycan features, not a complete structure; the location and linkage of each sugar can matter.",
      },
      {
        type: "h2",
        text: "A useful starting point for glycosylation research",
      },
      {
        type: "p",
        text: "Glycosylation describes many enzyme-driven processes that attach sugars to proteins, lipids, and small molecules. Understanding the type, site, and structure of a glycan, and how the sample was produced and analyzed, helps researchers interpret its role without treating all glycosylation as equivalent.",
      },
      {
        type: "callout",
        text: "GlycoDepot supplies research-grade sugar nucleotides, glycoenzymes, and glycan standards, and runs glycosylation analysis and custom glycan synthesis projects with lot-specific documentation. Products and services are for research use only.",
      },
    ],
  },
  {
    slug: "glycosylation-of-proteins",
    title: "Glycosylation of Proteins: N-Linked, O-Linked, and How They Differ",
    excerpt:
      "N-linked glycans attach through GlcNAc to asparagine; mucin-type O-glycans begin with GalNAc on serine or threonine. How the two differ, and what that means at the bench.",
    category: "Glycobiology Basics",
    tags: [
      "protein glycosylation",
      "N-linked glycosylation",
      "O-glycosylation",
      "glycoproteomics",
      "glycosyltransferases",
    ],
    publishedAt: "2026-11-20",
    readTime: 9,
    author: "GlycoDepot Editorial",
    body: [
      {
        type: "image",
        src: "https://cdn.marblism.com/Pc76_DEYT5W.png",
        alt: "Two cell-surface glycoproteins side by side: an N-glycan attached through GlcNAc to asparagine, and a mucin-type O-glycan attached through GalNAc to serine or threonine",
        caption:
          "Both structures were drawn from GlyTouCan entries, in CFG symbol notation. Left: the biantennary, core-fucosylated (α1-6), disialylated (α2-3) N-glycan G17689DH, linked through GlcNAc to Asn. Right: sialyl-T antigen, Neu5Acα2-3Galβ1-3GalNAcα1-Ser/Thr, G65562ZE. Linkages are labelled on each bond; blue square = GlcNAc, yellow square = GalNAc, green circle = mannose, yellow circle = galactose, red triangle = fucose, purple diamond = sialic acid.",
      },
      {
        type: "p",
        text: "When you have a glycoprotein in hand, the first practical question is often whether its glycans are N-linked or O-linked. N-linked glycans attach through GlcNAc to asparagine at a common sequence motif, while mucin-type O-glycans usually begin with GalNAc attached to serine or threonine and have no single consensus sequon. That difference shapes where the glycans are assembled, how predictable their sites are, and which analytical methods work.",
      },
      {
        type: "p",
        text: "This post focuses on identifying and analyzing the major protein-linked types, rather than surveying every glycosylation family. For a broader introduction, see our companion guide, What Is Glycosylation? A Practical Guide for Researchers.",
      },
      {
        type: "h2",
        text: "What makes N-linked and O-linked glycosylation different?",
      },
      {
        type: "p",
        text: "The N and O refer to the atom on the amino acid side chain that connects to the first sugar.",
      },
      {
        type: "p",
        text: "In N-linked glycosylation, the innermost N-acetylglucosamine (GlcNAc) forms a β-linkage to the amide nitrogen of asparagine (Asn). In mucin-type O-linked glycosylation, N-acetylgalactosamine (GalNAc) forms an α-linkage to the oxygen of serine (Ser) or threonine (Thr). These are different chemical attachments and different biosynthetic pathways, not interchangeable labels for a glycan structure.",
      },
      {
        type: "p",
        text: "Two other modifications are worth distinguishing. O-GlcNAcylation adds a single GlcNAc to Ser or Thr on many nuclear and cytoplasmic proteins; it is installed by O-GlcNAc transferase (OGT) using UDP-GlcNAc and removed by O-GlcNAcase (OGA), rather than being extended like a typical mucin-type O-glycan. C-mannosylation links mannose by a carbon-carbon bond to tryptophan. It is a distinct modification, not an O-linked glycan.",
      },
      {
        type: "h2",
        text: "Can you predict the site from the protein sequence?",
      },
      {
        type: "p",
        text: "For N-linked glycosylation, scan for the canonical Asn-X-Ser/Thr sequon, where X can be any amino acid except proline. This motif is a useful candidate-site marker, not proof that the Asn is glycosylated. Local protein structure, folding, site accessibility, translation and processing context can all affect occupancy. N-X-T sites are often more frequently occupied than N-X-S sites, but neither motif guarantees a glycan.",
      },
      {
        type: "p",
        text: "Mucin-type O-glycosylation has no single consensus sequon. Polypeptide GalNAc-transferase enzymes (GalNAc-Ts) recognize local peptide features, and different GalNAc-T isoforms have distinct but overlapping preferences. Ser/Thr-rich stretches and some proline-rich regions can be favorable contexts, but they do not define a universal rule. Several nearby residues may be modified, producing clusters of O-glycosylation sites that can be difficult to resolve individually.",
      },
      {
        type: "p",
        text: "In both pathways, the presence of a potential site is not the same as measured occupancy. A sequence prediction can guide experiments, but it cannot establish how much of the protein is glycosylated at a site.",
      },
      {
        type: "h2",
        text: "Where are the glycans assembled, and which enzymes act?",
      },
      {
        type: "h3",
        text: "N-linked: transfer first, then processing",
      },
      {
        type: "p",
        text: "Most N-glycosylation begins in the endoplasmic reticulum (ER). A lipid-linked oligosaccharide precursor (Glc3Man9GlcNAc2, assembled on dolichol) is transferred as a unit to an Asn in a suitable sequon by the oligosaccharyltransferase (OST) complex. The attached glycan is trimmed in the ER and undergoes further trimming and elaboration in the Golgi.",
      },
      {
        type: "p",
        text: "Golgi glycosyltransferases then help build and modify N-glycan branches. MGAT enzymes use UDP-GlcNAc to add GlcNAc and form branches; FUT8 uses GDP-fucose to add core α1-6 fucose to the innermost GlcNAc. Sialyltransferases use CMP-Neu5Ac to add terminal sialic acid: ST6GAL1, for example, forms α2-6 linkages to galactose, while ST3GAL-family enzymes form α2-3 linkages.",
      },
      {
        type: "h3",
        text: "Mucin-type O-linked: add sugars step by step",
      },
      {
        type: "p",
        text: "Mucin-type O-glycosylation is initiated mainly in the Golgi. GalNAc-T isoforms transfer GalNAc from UDP-GalNAc directly to Ser or Thr. Unlike the N-linked pathway, the first sugar is added to the protein step by step rather than transferred as part of a preassembled precursor.",
      },
      {
        type: "p",
        text: "The core-1 structure, Galβ1-3GalNAcα1-Ser/Thr, is made by C1GalT1 (also called T-synthase), which uses UDP-Gal. Core-1 glycans can then be extended, branched or capped. Sialyltransferases use CMP-Neu5Ac to add sialic acid; the G65562ZE example above has Neu5Acα2-3Galβ1-3GalNAcα1-Ser/Thr. Other common donor sugars include UDP-GlcNAc and GDP-Fuc, used by the corresponding transferases.",
      },
      {
        type: "p",
        text: "Exact structures depend on the protein, the enzymes present and the reaction conditions. For structural references, compare the GlyTouCan entries for the N-glycan G17689DH and the O-glycan G65562ZE. Our N-glycan standards and sugar nucleotide collections are relevant when planning profiling or enzyme-based experiments.",
      },
      {
        type: "image",
        src: "https://cdn.marblism.com/X-Oszh-HLYd.png",
        alt: "The two assembly routes: a dolichol-linked precursor transferred en bloc by OST in the ER, and stepwise GalNAc addition by GalNAc-T in the Golgi followed by extension and sialylation",
        caption:
          "Left: in the ER, the dolichol-linked Glc3Man9GlcNAc2 precursor is transferred to Asn as a single unit by oligosaccharyltransferase, giving Man5GlcNAc2 after trimming (shown as G00028MO). Right: in the Golgi, GalNAc-T adds GalNAc to Ser/Thr from UDP-GalNAc, C1GalT1 adds galactose from UDP-Gal, and ST3GAL caps with sialic acid from CMP-Neu5Ac, giving sialyl-T (G65562ZE). Nothing is transferred as a preassembled block on the O-linked side.",
      },
      {
        type: "h2",
        text: "N-linked vs. mucin-type O-linked glycosylation",
      },
      {
        type: "p",
        text: "These are the points that most often change experimental design.",
      },
      {
        type: "ul",
        items: [
          "Attachment residue: Asn for N-linked, with the innermost GlcNAc β-linked to the side-chain nitrogen; Ser or Thr for O-linked, with GalNAc α-linked to the side-chain oxygen.",
          "Sequon: the canonical Asn-X-Ser/Thr motif for N-linked, where X is not proline, and presence does not guarantee occupancy; no single consensus sequon for O-linked, where local peptide context and GalNAc-T isoform matter.",
          "Starting structure: a dolichol-linked Glc3Man9GlcNAc2 precursor transferred en bloc for N-linked; GalNAc added directly to Ser/Thr and then extended step by step for O-linked.",
          "Site of assembly: initiated in the ER and elaborated in the ER and Golgi for N-linked; initiated and extended mainly in the Golgi for O-linked.",
          "Common enzymes: OST, MGATs, FUT8 and sialyltransferases such as ST6GAL1 for N-linked; GalNAc-T isoforms, C1GalT1 and sialyltransferases for O-linked.",
          "Release: PNGase F releases most N-glycans, though core α1-3-fucosylated structures resist it; there is no PNGase-F-like enzyme for O-glycans, so reductive β-elimination releases glycans and OpeRATOR cleaves selected O-glycopeptides.",
          "Predictable from sequence: candidate N-linked sites can be predicted from sequons but occupancy must be measured; O-linked site prediction is less direct, and sequence alone does not specify the modified residues.",
        ],
      },
      {
        type: "h2",
        text: "What does the difference mean at the bench?",
      },
      {
        type: "h3",
        text: "Choose a release method for the glycan type",
      },
      {
        type: "p",
        text: "PNGase F releases most N-linked glycans, not mucin-type O-glycans. It cleaves the bond between the innermost GlcNAc and Asn, converting the Asn residue to Asp. An important exception is N-glycans with core α1-3 fucose, which are resistant to PNGase F. If distinguishing enzymatic deglycosylation from spontaneous Asn deamidation matters, an appropriate control or an isotopically labeled-water strategy can help.",
      },
      {
        type: "image",
        src: "https://cdn.marblism.com/Mve0OpF1ERr.png",
        alt: "PNGase F cleaves the GlcNAc-Asn bond on an N-glycan, but has no cleavage site on a GalNAc-Ser/Thr O-glycan",
        caption:
          "Why the same enzyme cannot do both jobs. PNGase F hydrolyses the bond between the innermost GlcNAc and the asparagine side chain, so the released N-glycan keeps its GlcNAc and the peptide residue becomes aspartate. An O-glycan is attached through GalNAc to the oxygen of Ser or Thr, which is not a substrate for PNGase F, so O-glycans need reductive β-elimination or an O-glycoprotease such as OpeRATOR.",
      },
      {
        type: "p",
        text: "There is no single universal enzyme for releasing mucin-type O-glycans intact. Reductive β-elimination is a common chemical release method, but conditions need to be chosen carefully because degradation can complicate interpretation. O-glycoproteases such as OpeRATOR are useful for releasing or generating O-glycopeptides at defined sites; they cleave N-terminal to O-glycosylated Ser/Thr under suitable substrate conditions. They are not a general substitute for PNGase F to release a complete pool of intact O-glycans.",
      },
      {
        type: "h3",
        text: "Localize sites with suitable MS/MS methods",
      },
      {
        type: "p",
        text: "O-glycopeptides are often harder to map because they can contain several nearby modified Ser/Thr residues, lack a simple sequence motif, and fragment in ways that lose glycan information. Many routine workflows are optimized for N-glycopeptides or rely on PNGase F, so they can systematically under-report O-glycosylation.",
      },
      {
        type: "p",
        text: "For site localization, ETD or EThcD can produce peptide-backbone fragments that retain glycan information. Stepped-HCD can also help by combining fragmentation conditions that provide glycan and peptide evidence; interpret results with the method's fragmentation behavior in mind. O-glycoproteomics methods are an active area of development.",
      },
      {
        type: "p",
        text: "Sialic acids can be labile during MS analysis, including in MALDI workflows, and may be lost during ionization or fragmentation. If sialylation is central to the question, use suitable sample preparation and acquisition conditions, and consider whether derivatization or an orthogonal method is needed to preserve or confirm the signal.",
      },
      {
        type: "h3",
        text: "Measure occupancy and heterogeneity",
      },
      {
        type: "p",
        text: "A sequon does not tell you whether a site is fully occupied, partly occupied or unoccupied. Likewise, knowing the host cell does not reveal the exact glycan distribution on a particular protein. Occupancy and glycan heterogeneity are measured, not inferred from the host.",
      },
      {
        type: "p",
        text: "Choose a method that addresses the question directly: site-specific occupancy, released-glycan composition, or intact glycopeptide profiling. Before starting, confirm enzyme specificity, protein input, controls and the analytical endpoint. For reagents, check lot-specific identity, purity, salt form and storage instructions; aliquoting donor stocks can help limit repeated freeze-thaw cycles.",
      },
      {
        type: "h2",
        text: "Researcher's quick checklist",
      },
      {
        type: "ul",
        items: [
          "Look for an N-X-S/T sequon to identify candidate N-linked sites; do not assume it is occupied.",
          "Treat Ser/Thr-rich regions as O-glycosylation candidates, not confirmed sites.",
          "Use PNGase F for most N-glycans, not O-glycans, and account for its core α1-3-fucose limitation.",
          "Plan O-glycan release or mapping separately, using a method suited to the question.",
          "Select MS/MS conditions for site localization, especially when O-glycosites are clustered or sialylated.",
          "Measure the sample's occupancy and glycoform distribution rather than predicting them from the expression host.",
        ],
      },
      {
        type: "h2",
        text: "FAQs about protein glycosylation",
      },
      {
        type: "h3",
        text: "Can PNGase F remove O-glycans?",
      },
      {
        type: "p",
        text: "No. PNGase F cleaves most N-linked glycans from Asn; it does not remove mucin-type O-glycans attached to Ser or Thr. O-glycans are commonly released by reductive β-elimination, while OpeRATOR can cleave selected O-glycopeptides.",
      },
      {
        type: "h3",
        text: "Is every Asn-X-Ser/Thr site glycosylated?",
      },
      {
        type: "p",
        text: "No. The sequon identifies a potential N-glycosylation site, but occupancy depends on factors including local structure, accessibility and processing context. Measure occupancy experimentally.",
      },
      {
        type: "h3",
        text: "Why is O-glycosylation harder to map than N-glycosylation?",
      },
      {
        type: "p",
        text: "O-glycosylation lacks a single consensus sequon, and multiple Ser/Thr residues can be modified close together. There is also no universal enzyme equivalent to PNGase F for releasing O-glycans. These features, along with glycan loss during fragmentation, make site localization more challenging.",
      },
      {
        type: "h3",
        text: "Are O-GlcNAc and mucin-type O-glycosylation the same?",
      },
      {
        type: "p",
        text: "No. Both attach a sugar to the oxygen of Ser or Thr, but O-GlcNAc is usually a single, dynamically regulated GlcNAc on nuclear or cytoplasmic proteins. Mucin-type O-glycosylation typically starts with GalNAc and can be extended into larger glycans in the Golgi.",
      },
      {
        type: "h3",
        text: "Does the expression host tell me which glycans are present?",
      },
      {
        type: "p",
        text: "It can help explain which biosynthetic pathways are available, but it does not establish the glycan structures or occupancy on a specific protein preparation. Analyze the sample to determine its glycoforms.",
      },
      {
        type: "p",
        text: "Protein glycosylation analysis starts with the attachment chemistry, but reliable conclusions depend on matching the workflow to the glycan type and measuring the actual sample.",
      },
      {
        type: "callout",
        text: "GlycoDepot supplies research-grade N-glycans, sugar nucleotides and glycoenzymes, and runs glycosylation analysis and custom glycan synthesis projects with lot-specific documentation. Products and services are for research use only.",
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
