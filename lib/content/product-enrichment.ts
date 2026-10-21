/** Reviewed 2026-10-18. Public chemistry references are not GlycoDepot lot specifications.
 * Applied once to the database through the authenticated product-content admin action;
 * later admin edits remain the source of truth. Never contains price or stock changes.
 */
export interface ProductEnrichment {
  id: string; name: string; shortDescription: string; description: string;
  seoTitle: string; seoDescription: string; attributes: Record<string,string>;
  references: Array<{label:string;url:string}>;
}
export const PRODUCT_ENRICHMENTS: ProductEnrichment[] = [
  {
    "id": "bprd_15158",
    "name": "UDP-Glucose (UDP-Glc)",
    "shortDescription": "UDP-glucose is a nucleotide sugar donor for glycosyltransferase research and enzymatic glycan synthesis. Compare salt-form CAS references and request lot data.",
    "description": "UDP-glucose (UDP-Glc) is an activated glucose donor used in glycosyltransferase reactions. It is useful for studying carbohydrate metabolism and designing enzymatic glycosylation experiments. UDP-glucose can also be converted into other nucleotide sugars, including UDP-galactose and UDP-glucuronic acid.\n\nChemical identity\nCAS 28053-08-9 is listed for the disodium salt; CAS 133-89-1 identifies the free acid. These forms have different formula weights and should not be treated as interchangeable mass standards.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.",
    "seoTitle": "UDP-Glucose (UDP-Glc)",
    "seoDescription": "UDP-glucose is a nucleotide sugar donor for glycosyltransferase research and enzymatic glycan synthesis. Compare salt-form CAS references and request lot data.",
    "attributes": {
      "Synonyms": "UDP-Glc; UDPG; uridine 5′-diphospho-α-D-glucose",
      "Research use": "For laboratory research use only",
      "CAS reference (disodium salt)": "28053-08-9",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot",
      "CAS reference (free acid)": "133-89-1"
    },
    "references": [
      {
        "label": "Sigma-Aldrich: UDP-glucose disodium identity",
        "url": "https://www.sigmaaldrich.com/TR/en/product/sigma/94335"
      },
      {
        "label": "PubChem: UDP-glucose free acid",
        "url": "https://pubchem.ncbi.nlm.nih.gov/compound/Udp-Glucose"
      }
    ]
  },
  {
    "id": "bprd_15159",
    "name": "UDP-Galactose (UDP-Gal)",
    "shortDescription": "UDP-galactose is a galactose donor for galactosyltransferase assays and enzymatic glycan synthesis. View form-labelled CAS references and request lot data.",
    "description": "UDP-galactose (UDP-Gal) supplies galactose residues in galactosyltransferase-catalysed reactions. Applications include glycoprotein and glycolipid glycosylation studies and the enzymatic preparation of galactose-containing glycans. It differs from UDP-glucose in the configuration of the sugar at C4.\n\nChemical identity\nCAS 137868-52-1 is listed for the disodium salt. CAS 2956-16-3 identifies the free acid.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.",
    "seoTitle": "UDP-Galactose (UDP-Gal)",
    "seoDescription": "UDP-galactose is a galactose donor for galactosyltransferase assays and enzymatic glycan synthesis. View form-labelled CAS references and request lot data.",
    "attributes": {
      "Synonyms": "UDP-Gal; uridine 5′-diphospho-α-D-galactose",
      "Research use": "For laboratory research use only",
      "CAS reference (disodium salt)": "137868-52-1",
      "Reference formula (disodium salt, anhydrous)": "C15H22N2Na2O17P2",
      "Reference molecular weight (disodium salt, anhydrous)": "610.27 g/mol",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot",
      "CAS reference (free acid)": "2956-16-3"
    },
    "references": [
      {
        "label": "Biosynth: UDP-galactose disodium identity",
        "url": "https://www.biosynth.com/p/MU06699/137868-52-1-udp-a-d-galactose-disodium-salt"
      },
      {
        "label": "PubChem: UDP-galactose free acid",
        "url": "https://pubchem.ncbi.nlm.nih.gov/compound/Udp-Galactose"
      }
    ]
  },
  {
    "id": "bprd_15161",
    "name": "UDP-GlcNAc (UDP-N-acetylglucosamine)",
    "shortDescription": "UDP-GlcNAc is an N-acetylglucosamine donor for glycosyltransferase research. View the disodium CAS reference and request lot-specific specifications.",
    "description": "UDP-N-acetylglucosamine (UDP-GlcNAc) is an activated amino sugar donor for N-acetylglucosaminyltransferases. It is used in glycan synthesis and research on GlcNAc transfer to glycan or protein acceptors. GlcNAc and GalNAc are distinct sugar stereoisomers, so UDP-GlcNAc should be selected separately from UDP-GalNAc.\n\nChemical identity\nCAS 91183-98-1 is listed for UDP-GlcNAc disodium salt. The reference formula and molecular weight below refer to that anhydrous salt, not a free-acid or hydrated preparation.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.",
    "seoTitle": "UDP-GlcNAc (UDP-N-acetylglucosamine)",
    "seoDescription": "UDP-GlcNAc is an N-acetylglucosamine donor for glycosyltransferase research. View the disodium CAS reference and request lot-specific specifications.",
    "attributes": {
      "Synonyms": "UDP-GlcNAc; UDP-N-acetyl-D-glucosamine; UDPAG",
      "Research use": "For laboratory research use only",
      "CAS reference (disodium salt)": "91183-98-1",
      "Reference formula (disodium salt, anhydrous)": "C17H25N3Na2O17P2",
      "Reference molecular weight (disodium salt, anhydrous)": "651.32 g/mol",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot"
    },
    "references": [
      {
        "label": "Biosynth: UDP-GlcNAc disodium identity",
        "url": "https://www.biosynth.com/p/MU07955/91183-98-1-udp-glcnac-disodium-salt"
      }
    ]
  },
  {
    "id": "bprd_15165",
    "name": "UDP-GalNAc (UDP-N-acetylgalactosamine)",
    "shortDescription": "UDP-GalNAc is an N-acetylgalactosamine donor for glycosyltransferase research. View CAS 108320-87-2 for the disodium salt and request lot data.",
    "description": "UDP-N-acetylgalactosamine (UDP-GalNAc) is a donor substrate for N-acetylgalactosaminyltransferases. It supports studies of GalNAc transfer to sugar or peptide acceptors, including initiation of mucin-type O-glycosylation with suitable polypeptide GalNAc transferases. It is the C4 sugar epimer of UDP-GlcNAc.\n\nChemical identity\nCAS 108320-87-2 identifies the disodium salt of UDP-GalNAc. It does not identify UDP-xylose.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.",
    "seoTitle": "UDP-GalNAc (UDP-N-acetylgalactosamine)",
    "seoDescription": "UDP-GalNAc is an N-acetylgalactosamine donor for glycosyltransferase research. View CAS 108320-87-2 for the disodium salt and request lot data.",
    "attributes": {
      "Synonyms": "UDP-GalNAc; UDP-N-acetyl-D-galactosamine",
      "Research use": "For laboratory research use only",
      "CAS reference (disodium salt)": "108320-87-2",
      "Reference formula (disodium salt, anhydrous)": "C17H25N3Na2O17P2",
      "Reference molecular weight (disodium salt, anhydrous)": "651.32 g/mol",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot"
    },
    "references": [
      {
        "label": "Biosynth: UDP-GalNAc disodium specification",
        "url": "https://www.biosynth.com/Files/Specification/MU/04/MU04515.pdf"
      }
    ]
  },
  {
    "id": "bprd_15182",
    "name": "UDP-Glucuronic acid (UDP-GlcA)",
    "shortDescription": "UDP-glucuronic acid is a glucuronosyl donor for enzyme assays and glycan research. View the trisodium CAS reference and request lot-specific data.",
    "description": "UDP-glucuronic acid (UDP-GlcA) is an activated glucuronic acid donor for glucuronosyltransferase reactions. It is used in studies of glucuronidation and glucuronic-acid-containing glycans. UDP-GlcA also provides the substrate from which UDP-xylose synthase produces UDP-xylose.\n\nChemical identity\nCAS 63700-19-6 is listed for the trisodium salt. Its formula and molecular weight differ from the free acid and other counterion forms.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.",
    "seoTitle": "UDP-Glucuronic acid (UDP-GlcA)",
    "seoDescription": "UDP-glucuronic acid is a glucuronosyl donor for enzyme assays and glycan research. View the trisodium CAS reference and request lot-specific data.",
    "attributes": {
      "Synonyms": "UDP-GlcA; UDPGA; uridine 5′-diphosphoglucuronic acid",
      "Research use": "For laboratory research use only",
      "CAS reference (trisodium salt)": "63700-19-6",
      "Reference formula (trisodium salt, anhydrous)": "C15H19N2Na3O18P2",
      "Reference molecular weight (trisodium salt, anhydrous)": "646.24 g/mol",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot"
    },
    "references": [
      {
        "label": "Biosynth: UDP-glucuronic acid trisodium identity",
        "url": "https://www.biosynth.com/p/MU08961/63700-19-6-udp-d-glucuronide-trisodium-salt"
      },
      {
        "label": "Research: UDP-xylose synthase and UDP-glucuronic acid",
        "url": "https://pubmed.ncbi.nlm.nih.gov/28011867/"
      }
    ]
  },
  {
    "id": "bprd_15183",
    "name": "UDP-Xylose (UDP-Xyl)",
    "shortDescription": "UDP-xylose is an activated xylose donor for glycosylation and polysaccharide research. View CAS 108320-89-4 for the disodium reference form.",
    "description": "UDP-xylose (UDP-Xyl) is an activated pentose sugar donor used in glycosylation and polysaccharide biosynthesis research. UDP-xylose synthase makes UDP-xylose from UDP-glucuronic acid through an oxidative decarboxylation reaction. It is not formed from UDP-glucose by UDP-glucose 4-epimerase.\n\nChemical identity\nThe disodium reference CAS is 108320-89-4. UDP-GalNAc disodium has a different CAS number, 108320-87-2.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.",
    "seoTitle": "UDP-Xylose (UDP-Xyl)",
    "seoDescription": "UDP-xylose is an activated xylose donor for glycosylation and polysaccharide research. View CAS 108320-89-4 for the disodium reference form.",
    "attributes": {
      "Synonyms": "UDP-Xyl; UDP-D-xylose; uridine 5′-diphospho-α-D-xylose",
      "Research use": "For laboratory research use only",
      "CAS reference (disodium salt)": "108320-89-4",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot"
    },
    "references": [
      {
        "label": "Biosynth: UDP-xylose disodium identity",
        "url": "https://www.biosynth.com/p/J-700264/108320-89-4-udp-a-d-xylose-disodium"
      },
      {
        "label": "Research: UDP-xylose synthase and UDP-glucuronic acid",
        "url": "https://pubmed.ncbi.nlm.nih.gov/28011867/"
      }
    ]
  },
  {
    "id": "bprd_15218",
    "name": "GDP-L-Fucose (GDP-Fuc)",
    "shortDescription": "GDP-L-fucose is a donor for fucosyltransferase assays and chemoenzymatic glycan synthesis. View the disodium CAS reference and request lot data.",
    "description": "GDP-L-fucose (GDP-Fuc) is an activated fucose donor used by fucosyltransferases. It supports chemoenzymatic preparation of fucosylated glycans and studies of glycoprotein and oligosaccharide fucosylation. The acceptor and fucose linkage depend on the selected enzyme.\n\nChemical identity\nCAS 148296-47-3 is listed for GDP-L-fucose disodium salt.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.",
    "seoTitle": "GDP-L-Fucose (GDP-Fuc)",
    "seoDescription": "GDP-L-fucose is a donor for fucosyltransferase assays and chemoenzymatic glycan synthesis. View the disodium CAS reference and request lot data.",
    "attributes": {
      "Synonyms": "GDP-Fuc; GDP-L-Fuc; guanosine 5′-diphospho-β-L-fucose",
      "Research use": "For laboratory research use only",
      "CAS reference (disodium salt)": "148296-47-3",
      "Reference formula (disodium salt, anhydrous)": "C16H23N5Na2O15P2",
      "Reference molecular weight (disodium salt, anhydrous)": "633.31 g/mol",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot"
    },
    "references": [
      {
        "label": "Biosynth: GDP-L-fucose disodium identity",
        "url": "https://www.biosynth.com/p/MG01912/148296-47-3-gdp-l-fucose-disodium-salt"
      }
    ]
  },
  {
    "id": "bprd_15216",
    "name": "GDP-Mannose (GDP-Man)",
    "shortDescription": "GDP-mannose is a nucleotide sugar for mannose metabolism and glycosylation research. View a disodium reference identifier and request exact lot specifications.",
    "description": "GDP-mannose (GDP-Man) is a guanosine diphosphate sugar used in mannose metabolism and glycosylation research. It is also a substrate of GDP-mannose 4,6-dehydratase in the pathway leading to GDP-L-fucose.\n\nChemical identity\nCAS 103301-73-1 is a documented GDP-mannose disodium reference. Registry entries can distinguish stereochemical and counterion forms; confirm the exact structure and supplied lot before choosing a reference standard.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.",
    "seoTitle": "GDP-Mannose (GDP-Man)",
    "seoDescription": "GDP-mannose is a nucleotide sugar for mannose metabolism and glycosylation research. View a disodium reference identifier and request exact lot specifications.",
    "attributes": {
      "Synonyms": "GDP-Man; GDP-D-mannose; guanosine 5′-diphospho-D-mannose",
      "Research use": "For laboratory research use only",
      "CAS reference (disodium salt)": "103301-73-1",
      "Reference formula (disodium salt, anhydrous)": "C16H23N5Na2O16P2",
      "Reference molecular weight (disodium salt, anhydrous)": "649.30 g/mol",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot"
    },
    "references": [
      {
        "label": "Cayman Chemical: GDP-mannose disodium identity",
        "url": "https://www.caymanchem.com/product/46575/guanosine-5-prime-diphospho-d-mannose-sodium-salt"
      }
    ]
  },
  {
    "id": "bprd_11425",
    "name": "CMP-Neu5Ac disodium salt (CMP-sialic acid)",
    "shortDescription": "CMP-Neu5Ac disodium salt is an activated sialic acid donor for sialyltransferase research and enzymatic glycan synthesis. Request lot-specific documentation.",
    "description": "CMP-Neu5Ac is the activated nucleotide form of N-acetylneuraminic acid (Neu5Ac). Sialyltransferases use it to transfer sialic acid onto suitable glycan acceptors. Applications include enzymatic sialylation, glycoconjugate synthesis and sialyltransferase assays.\n\nChemical identity\nThis catalog entry is labelled as the disodium salt. CMP contains one phosphate group. Source product formulation and purity values are not specifications for GlycoDepot lots.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.",
    "seoTitle": "CMP-Neu5Ac disodium salt (CMP-sialic acid)",
    "seoDescription": "CMP-Neu5Ac disodium salt is an activated sialic acid donor for sialyltransferase research and enzymatic glycan synthesis. Request lot-specific documentation.",
    "attributes": {
      "Synonyms": "CMP-Neu5Ac; CMP-NANA; cytidine 5′-monophospho-N-acetylneuraminic acid disodium salt",
      "Research use": "For laboratory research use only",
      "CAS reference (disodium salt)": "3063-71-6",
      "Reference formula (disodium salt, anhydrous)": "C20H29N4Na2O16P",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot"
    },
    "references": [
      {
        "label": "Merck: CMP-sialic acid disodium identity",
        "url": "https://www.merckmillipore.com/MY/en/product/CMP-Sialic-Acid-Disodium-Salt-InSolution-CAS-3063-71-6-Calbiochem,EMD_BIO-505223"
      }
    ]
  },
  {
    "id": "bprd_11444",
    "name": "CMP-Neu5Gc disodium salt",
    "shortDescription": "CMP-Neu5Gc is an activated N-glycolylneuraminic acid donor for sialylation research. View the sodium salt reference identity and request lot documentation.",
    "description": "CMP-Neu5Gc is the activated nucleotide form of N-glycolylneuraminic acid. It supports studies of Neu5Gc transfer onto glycoconjugates and comparison with Neu5Ac-containing glycans. Unlike CMP-Neu5Ac, the N-acyl substituent includes a hydroxyl group.\n\nChemical identity\nThe sodium salt reference listed by Biosynth uses CAS 98300-80-2 and formula C20H29N4Na2O17P. Confirm the exact lot identity on its CoA.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.",
    "seoTitle": "CMP-Neu5Gc disodium salt",
    "seoDescription": "CMP-Neu5Gc is an activated N-glycolylneuraminic acid donor for sialylation research. View the sodium salt reference identity and request lot documentation.",
    "attributes": {
      "Synonyms": "CMP-Neu5Gc; cytidine 5′-monophospho-N-glycolylneuraminic acid disodium salt",
      "Research use": "For laboratory research use only",
      "CAS reference (disodium salt)": "98300-80-2",
      "Reference formula (disodium salt, anhydrous)": "C20H29N4Na2O17P",
      "Reference molecular weight (disodium salt, anhydrous)": "674.41 g/mol",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot"
    },
    "references": [
      {
        "label": "Biosynth: CMP-Neu5Gc sodium salt identity",
        "url": "https://www.biosynth.com/p/MC00696/98300-80-2-cmp-neu5gc-sodium-salt"
      },
      {
        "label": "Research: utilization of CMP-Neu5Gc in glycoconjugates",
        "url": "https://pubmed.ncbi.nlm.nih.gov/2684973/"
      }
    ]
  },
  {
    "id": "bprd_15162",
    "name": "UDP-GlcNAz (UDP-N-azidoacetylglucosamine)",
    "shortDescription": "UDP-GlcNAz is an azidoacetyl-modified GlcNAc nucleotide for glycan labeling research. Compare the disodium CAS reference and confirm enzyme compatibility.",
    "description": "UDP-GlcNAz is an analogue of UDP-GlcNAc with an N-azidoacetyl group. This azide handle supports bioorthogonal labeling after incorporation into an appropriate acceptor. It is chemically distinct from UDP-6-azido-GlcNAc, which carries the azide at C6 rather than on the N-acyl group.\n\nApplication focus\nUse in glycosyltransferase substrate studies and click-based detection workflows with an experimentally validated enzyme and acceptor.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.\n\nExperimental planning\nEnzyme acceptance depends on the transferase, acceptor and reaction conditions. Validate the donor with your enzyme system; nucleotide sugars should not be assumed to enter cells simply because related monosaccharide precursors do.",
    "seoTitle": "UDP-GlcNAz (UDP-N-azidoacetylglucosamine)",
    "seoDescription": "UDP-GlcNAz is an azidoacetyl-modified GlcNAc nucleotide for glycan labeling research. Compare the disodium CAS reference and confirm enzyme compatibility.",
    "attributes": {
      "Synonyms": "UDP-GlcNAz; UDP-N-azidoacetyl-D-glucosamine",
      "Research use": "For laboratory research use only",
      "CAS reference (disodium salt)": "1611490-64-2",
      "Chemical handle": "Azide on the N-acyl group",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot"
    },
    "references": [
      {
        "label": "MedChemExpress: UDP-GlcNAz disodium identity",
        "url": "https://www.medchemexpress.com/udp-glcnaz-disodium.html"
      }
    ]
  },
  {
    "id": "bprd_15166",
    "name": "UDP-GalNAz (UDP-N-azidoacetylgalactosamine)",
    "shortDescription": "UDP-GalNAz is an azidoacetyl-modified GalNAc donor analogue for bioorthogonal glycan labeling. View the disodium CAS reference and request lot data.",
    "description": "UDP-GalNAz is an analogue of UDP-GalNAc containing an N-azidoacetyl group. The azide enables subsequent detection or conjugation by copper-catalysed azide–alkyne cycloaddition or strain-promoted reactions with suitable partners. Transfer depends on the glycosyltransferase and acceptor.\n\nApplication focus\nUseful for studying modified GalNAc transfer and establishing glycan labeling workflows. UDP-GalNAz and UDP-6-azido-GalNAc are positional analogues with different chemical structures and should not share identity specifications.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.\n\nExperimental planning\nEnzyme acceptance depends on the transferase, acceptor and reaction conditions. Validate the donor with your enzyme system; nucleotide sugars should not be assumed to enter cells simply because related monosaccharide precursors do.",
    "seoTitle": "UDP-GalNAz (UDP-N-azidoacetylgalactosamine)",
    "seoDescription": "UDP-GalNAz is an azidoacetyl-modified GalNAc donor analogue for bioorthogonal glycan labeling. View the disodium CAS reference and request lot data.",
    "attributes": {
      "Synonyms": "UDP-GalNAz; UDP-N-azidoacetyl-D-galactosamine",
      "Research use": "For laboratory research use only",
      "CAS reference (disodium salt)": "653600-61-4",
      "Reference formula (disodium salt, anhydrous)": "C17H24N6Na2O17P2",
      "Reference molecular weight (disodium salt, anhydrous)": "692.33 g/mol",
      "Chemical handle": "Azide on the N-acyl group",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot"
    },
    "references": [
      {
        "label": "MedChemExpress: UDP-GalNAz disodium identity",
        "url": "https://www.medchemexpress.com/us/en/udp-galnaz-disodium.html"
      }
    ]
  },
  {
    "id": "bprd_15164",
    "name": "UDP-6-azido-GlcNAc (UDP-6-N3-GlcNAc)",
    "shortDescription": "UDP-6-azido-GlcNAc is a C6 azide donor analogue for chemoenzymatic glycan labeling. Confirm the exact structure, salt form and enzyme compatibility.",
    "description": "UDP-6-azido-GlcNAc carries an azido substitution at the sugar C6 position. The resulting handle can be detected using an appropriate click-chemistry partner after enzymatic transfer. It differs from UDP-GlcNAz, where the azide is part of the N-acyl group.\n\nResearch context\nA published chemoenzymatic cell-surface labeling study used UDP-6-N3-GlcNAc with the N. meningitidis β1–3-N-acetylglucosaminyltransferase NmLgtA. This establishes a specific research example, not universal transferase compatibility.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.\n\nExperimental planning\nEnzyme acceptance depends on the transferase, acceptor and reaction conditions. Validate the donor with your enzyme system; nucleotide sugars should not be assumed to enter cells simply because related monosaccharide precursors do.",
    "seoTitle": "UDP-6-azido-GlcNAc (UDP-6-N3-GlcNAc)",
    "seoDescription": "UDP-6-azido-GlcNAc is a C6 azide donor analogue for chemoenzymatic glycan labeling. Confirm the exact structure, salt form and enzyme compatibility.",
    "attributes": {
      "Synonyms": "UDP-6-N3-GlcNAc; UDP-6-azido-6-deoxy-N-acetylglucosamine",
      "Research use": "For laboratory research use only",
      "Chemical handle": "Azide at sugar C6",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot",
      "CAS number": "Confirm against the exact structure and supplied salt form"
    },
    "references": [
      {
        "label": "Research: chemoenzymatic labeling of living-cell glycans",
        "url": "https://journals.biologists.com/bio/article/6/6/923/1924/Labeling-glycans-on-living-cells-by-a"
      }
    ]
  },
  {
    "id": "bprd_15160",
    "name": "UDP-6-azido-galactose (UDP-6-N3-Gal)",
    "shortDescription": "UDP-6-azido-galactose is a C6 azide donor analogue for chemoenzymatic glycan labeling. Request the exact salt-form identity and lot specifications.",
    "description": "UDP-6-azido-galactose is an analogue of UDP-galactose with an azide handle at C6. It is intended for glycan labeling research in systems that accept the modified nucleotide donor. The azide can be paired with an appropriate alkyne reagent for detection after transfer.\n\nResearch context\nPublished living-cell glycoengineering work paired UDP-6-N3-Gal with the N. meningitidis β1,4-galactosyltransferase NmLgtB. Validate activity with the transferase and acceptor used in your own experiment.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.\n\nExperimental planning\nEnzyme acceptance depends on the transferase, acceptor and reaction conditions. Validate the donor with your enzyme system; nucleotide sugars should not be assumed to enter cells simply because related monosaccharide precursors do.",
    "seoTitle": "UDP-6-azido-galactose (UDP-6-N3-Gal)",
    "seoDescription": "UDP-6-azido-galactose is a C6 azide donor analogue for chemoenzymatic glycan labeling. Request the exact salt-form identity and lot specifications.",
    "attributes": {
      "Synonyms": "UDP-6-N3-Gal; UDP-6-azido-6-deoxy-D-galactose",
      "Research use": "For laboratory research use only",
      "Chemical handle": "Azide at sugar C6",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot",
      "CAS number": "Confirm against the exact structure and supplied salt form"
    },
    "references": [
      {
        "label": "Research: chemoenzymatic labeling of living-cell glycans",
        "url": "https://journals.biologists.com/bio/article/6/6/923/1924/Labeling-glycans-on-living-cells-by-a"
      }
    ]
  },
  {
    "id": "bprd_12768",
    "name": "UDP-6-azido-GalNAc disodium salt",
    "shortDescription": "UDP-6-azido-GalNAc disodium salt is a C6 azide nucleotide donor analogue for glycosylation and click-labeling research. Request lot identity and CoA.",
    "description": "UDP-6-azido-GalNAc is a modified GalNAc nucleotide with an azide at sugar C6. This catalog entry is labelled as a disodium salt. It is distinct from UDP-GalNAz, whose azide is in the N-acyl substituent.\n\nChemical identity\nCAS 1202854-87-2 appears in supplier listings for this donor, but references do not consistently distinguish the free acid from the disodium salt. Confirm the exact counterion and identity from the supplied lot CoA before using a registry number or molecular weight in experimental calculations.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.\n\nExperimental planning\nEnzyme acceptance depends on the transferase, acceptor and reaction conditions. Validate the donor with your enzyme system; nucleotide sugars should not be assumed to enter cells simply because related monosaccharide precursors do.",
    "seoTitle": "UDP-6-azido-GalNAc disodium salt",
    "seoDescription": "UDP-6-azido-GalNAc disodium salt is a C6 azide nucleotide donor analogue for glycosylation and click-labeling research. Request lot identity and CoA.",
    "attributes": {
      "Synonyms": "UDP-6-N3-GalNAc; UDP-6-azido-6-deoxy-N-acetyl-D-galactosamine disodium salt",
      "Research use": "For laboratory research use only",
      "Chemical handle": "Azide at sugar C6",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot",
      "CAS number": "Confirm against the exact structure and supplied salt form",
      "CAS reference (form requires lot confirmation)": "1202854-87-2"
    },
    "references": [
      {
        "label": "Sigma-Aldrich: UDP-6-azido-GalNAc catalog identity",
        "url": "https://www.sigmaaldrich.com/US/en/product/aablocksinc/aabh9abc3274?context=bbe"
      }
    ]
  },
  {
    "id": "bprd_15163",
    "name": "UDP-2-alkyne-GlcNAc",
    "shortDescription": "UDP-2-alkyne-GlcNAc is an alkyne-functionalized nucleotide sugar for glycan labeling research. Confirm the exact structure and transferase compatibility.",
    "description": "UDP-2-alkyne-GlcNAc is an alkyne-functionalized UDP-GlcNAc derivative for glycosylation and glycan-remodeling research. The alkyne offers a chemical handle for conjugation to a suitable azide partner after enzymatic transfer.\n\nProduct selection\nThe shorthand “2-alkyne” is not sufficient to establish linker connectivity, counterion or hydration. Request the structure and lot data before choosing a CAS number, formula or molecular weight.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.\n\nExperimental planning\nEnzyme acceptance depends on the transferase, acceptor and reaction conditions. Validate the donor with your enzyme system; nucleotide sugars should not be assumed to enter cells simply because related monosaccharide precursors do.",
    "seoTitle": "UDP-2-alkyne-GlcNAc",
    "seoDescription": "UDP-2-alkyne-GlcNAc is an alkyne-functionalized nucleotide sugar for glycan labeling research. Confirm the exact structure and transferase compatibility.",
    "attributes": {
      "Synonyms": "UDP-2-alkyne-N-acetylglucosamine; UDP-alkynyl-GlcNAc",
      "Research use": "For laboratory research use only",
      "Chemical handle": "Alkyne; confirm exact connectivity",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot",
      "CAS number": "Confirm against the exact structure and supplied salt form"
    },
    "references": [
      {
        "label": "MedChemExpress: UDP-2-alkyne-GlcNAc research listing",
        "url": "https://www.medchemexpress.com/search.html?q=UDP-GlcNAc"
      },
      {
        "label": "Cayman Chemical: azide–alkyne click chemistry",
        "url": "https://www.caymanchem.com/product/9001369/nat-20-s-yne"
      }
    ]
  },
  {
    "id": "bprd_15167",
    "name": "UDP-2-alkyne-GalNAc",
    "shortDescription": "UDP-2-alkyne-GalNAc is an alkyne-functionalized GalNAc nucleotide for glycan labeling research. Request the exact structure and lot-specific specifications.",
    "description": "UDP-2-alkyne-GalNAc is an alkyne-functionalized GalNAc nucleotide listed for glycan-labeling research. An alkyne handle can support conjugation to azide-bearing reporters through a suitable click reaction. Enzymatic transfer must be established for the exact derivative.\n\nProduct selection\nConfirm the full structure, N-acyl connectivity, salt form and hydration before assigning a CAS number or calculating solution concentrations. The abbreviated product name alone does not establish those details.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.\n\nExperimental planning\nEnzyme acceptance depends on the transferase, acceptor and reaction conditions. Validate the donor with your enzyme system; nucleotide sugars should not be assumed to enter cells simply because related monosaccharide precursors do.",
    "seoTitle": "UDP-2-alkyne-GalNAc",
    "seoDescription": "UDP-2-alkyne-GalNAc is an alkyne-functionalized GalNAc nucleotide for glycan labeling research. Request the exact structure and lot-specific specifications.",
    "attributes": {
      "Synonyms": "UDP-2-alkyne-N-acetylgalactosamine; UDP-alkynyl-GalNAc",
      "Research use": "For laboratory research use only",
      "Chemical handle": "Alkyne; confirm exact connectivity",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot",
      "CAS number": "Confirm against the exact structure and supplied salt form"
    },
    "references": [
      {
        "label": "Cayman Chemical: azide–alkyne click chemistry",
        "url": "https://www.caymanchem.com/product/9001369/nat-20-s-yne"
      }
    ]
  },
  {
    "id": "bprd_15219",
    "name": "GDP-6-azido-fucose (GDP-6-N3-Fuc)",
    "shortDescription": "GDP-6-azido-fucose is an azide-functionalized GDP-fucose analogue for fucosylation and glycan labeling research. Request exact structure and lot data.",
    "description": "GDP-6-azido-fucose is an azide-bearing GDP-fucose analogue for fucosyltransferase and bioorthogonal labeling research. The azide provides a conjugation handle after an accepting enzyme transfers the modified sugar.\n\nResearch context\nChemoenzymatic preparation of GDP-azidofucose derivatives is documented in fucosyltransferase research. Select the enzyme and acceptor experimentally; this nucleotide donor is distinct from a cell-fed free fucose precursor. Natural L-fucose is a 6-deoxy sugar.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.\n\nExperimental planning\nEnzyme acceptance depends on the transferase, acceptor and reaction conditions. Validate the donor with your enzyme system; nucleotide sugars should not be assumed to enter cells simply because related monosaccharide precursors do.",
    "seoTitle": "GDP-6-azido-fucose (GDP-6-N3-Fuc)",
    "seoDescription": "GDP-6-azido-fucose is an azide-functionalized GDP-fucose analogue for fucosylation and glycan labeling research. Request exact structure and lot data.",
    "attributes": {
      "Synonyms": "GDP-6-N3-Fuc; GDP-azidofucose; GDP-FucAz",
      "Research use": "For laboratory research use only",
      "Chemical handle": "Azide on the fucose analogue",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot",
      "CAS number": "Confirm against the exact structure and supplied salt form"
    },
    "references": [
      {
        "label": "Research: chemoenzymatic GDP-fucose derivative synthesis",
        "url": "https://tdr.lib.ntu.edu.tw/jspui/handle/123456789/16393?mode=full"
      }
    ]
  },
  {
    "id": "bprd_15220",
    "name": "GDP-6-alkyne-fucose (GDP-6-Alk-Fuc)",
    "shortDescription": "GDP-6-alkyne-fucose is an alkyne-bearing GDP-fucose analogue for fucosylation and glycan labeling research. Confirm structure and enzyme acceptance.",
    "description": "GDP-6-alkyne-fucose is an alkyne-bearing GDP-fucose analogue used in research on fucose probes and glycan labeling. Its alkyne handle allows reaction with a suitable azide reporter. Related GDP-alkynyl-fucose analogues have been studied in glycoprotein labeling, with incorporation varying between probes.\n\nProduct selection\nConfirm the exact alkyne chain connectivity and sugar configuration; related fucose probes should not be assigned the same identity specifications solely from an abbreviated name.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.\n\nExperimental planning\nEnzyme acceptance depends on the transferase, acceptor and reaction conditions. Validate the donor with your enzyme system; nucleotide sugars should not be assumed to enter cells simply because related monosaccharide precursors do.",
    "seoTitle": "GDP-6-alkyne-fucose (GDP-6-Alk-Fuc)",
    "seoDescription": "GDP-6-alkyne-fucose is an alkyne-bearing GDP-fucose analogue for fucosylation and glycan labeling research. Confirm structure and enzyme acceptance.",
    "attributes": {
      "Synonyms": "GDP-6-Alk-Fuc; GDP-6-alkynyl-fucose",
      "Research use": "For laboratory research use only",
      "Chemical handle": "Alkyne on the fucose analogue",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot",
      "CAS number": "Confirm against the exact structure and supplied salt form"
    },
    "references": [
      {
        "label": "Research: differential labeling with alkynyl fucose analogs",
        "url": "https://pubmed.ncbi.nlm.nih.gov/32825463/"
      },
      {
        "label": "Cayman Chemical: azide–alkyne click chemistry",
        "url": "https://www.caymanchem.com/product/9001369/nat-20-s-yne"
      }
    ]
  },
  {
    "id": "bprd_11453",
    "name": "CMP-Neu5Az (CMP-N-azidoacetylneuraminic acid)",
    "shortDescription": "CMP-Neu5Az is an N-azidoacetyl sialic acid donor analogue for chemoenzymatic glycan labeling. Request exact salt form, structure and lot documentation.",
    "description": "CMP-Neu5Az is a CMP-activated sialic acid analogue with an N-azidoacetyl substituent. The azide enables subsequent conjugation to suitable reporters following enzymatic transfer. It differs from CMP-9-azido-Neu5Ac, which places the azide at C9.\n\nResearch context\nA published living-cell glycoengineering study used CMP-Neu5Az with the P. multocida sialyltransferase mutant PmST1_M144D. Compatibility with other transferases, acceptors and conditions requires validation.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.\n\nExperimental planning\nEnzyme acceptance depends on the transferase, acceptor and reaction conditions. Validate the donor with your enzyme system; nucleotide sugars should not be assumed to enter cells simply because related monosaccharide precursors do.",
    "seoTitle": "CMP-Neu5Az (CMP-N-azidoacetylneuraminic acid)",
    "seoDescription": "CMP-Neu5Az is an N-azidoacetyl sialic acid donor analogue for chemoenzymatic glycan labeling. Request exact salt form, structure and lot documentation.",
    "attributes": {
      "Synonyms": "CMP-Neu5Az; CMP-SiaNAz; CMP-N-azidoacetylneuraminic acid",
      "Research use": "For laboratory research use only",
      "Chemical handle": "Azide on the N-acyl group",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot",
      "CAS number": "Confirm against the exact structure and supplied salt form"
    },
    "references": [
      {
        "label": "Research: chemoenzymatic labeling of living-cell glycans",
        "url": "https://journals.biologists.com/bio/article/6/6/923/1924/Labeling-glycans-on-living-cells-by-a"
      }
    ]
  },
  {
    "id": "bprd_11454",
    "name": "CMP-9-azido-Neu5Ac (CMP-C9-azido-sialic acid)",
    "shortDescription": "CMP-9-azido-Neu5Ac is a C9 azide sialic acid nucleotide analogue for labeling research. Confirm the structure, salt form and transferase compatibility.",
    "description": "CMP-9-azido-Neu5Ac is a CMP-activated sialic acid analogue bearing an azide at C9. It provides a potential bioorthogonal conjugation handle in an enzymatic labeling workflow. The position of the azide distinguishes it from CMP-Neu5Az, which contains an N-azidoacetyl group.\n\nProduct selection\nRequest the full structure, counterion and lot documentation before selecting an identity number or preparing molar solutions. CMP is a monophosphate nucleotide.\n\nProduct selection and documentation\nReference identifiers describe the labelled chemical form; they do not establish the counterion or hydration of a particular lot. Confirm the supplied form, assay, purity method and storage conditions on the lot certificate of analysis. Use the lot-specific formula weight when preparing molar solutions.\n\nExperimental planning\nEnzyme acceptance depends on the transferase, acceptor and reaction conditions. Validate the donor with your enzyme system; nucleotide sugars should not be assumed to enter cells simply because related monosaccharide precursors do.",
    "seoTitle": "CMP-9-azido-Neu5Ac (CMP-C9-azido-sialic acid)",
    "seoDescription": "CMP-9-azido-Neu5Ac is a C9 azide sialic acid nucleotide analogue for labeling research. Confirm the structure, salt form and transferase compatibility.",
    "attributes": {
      "Synonyms": "CMP-9-N3-Neu5Ac; CMP-9-azido-9-deoxy-Neu5Ac",
      "Research use": "For laboratory research use only",
      "Chemical handle": "Azide at sialic acid C9",
      "Supplied form": "Confirm counterion, hydration and formulation on the lot CoA",
      "Lot documentation": "Request CoA, purity method and storage conditions for the supplied lot",
      "CAS number": "Confirm against the exact structure and supplied salt form"
    },
    "references": [
      {
        "label": "Cayman Chemical: azide–alkyne click chemistry",
        "url": "https://www.caymanchem.com/product/9001369/nat-20-s-yne"
      }
    ]
  }
];

/** Public references are restricted to neutral databases and academic sources.
 * Supplier verification links remain in the admin-only manifest review.
 */
export function productReferences(id:string) {
  if (id.startsWith("gd_galnac_")) return [
    { label: "GalNAc conjugation and hepatocyte delivery (Nair et al., 2014)", url: "https://pubmed.ncbi.nlm.nih.gov/25434769/" },
    { label: "GalNAc-ASO receptor binding: valency and linker effects", url: "https://pubmed.ncbi.nlm.nih.gov/28158620/" },
  ];
  const publicHosts = new Set([
    "pubchem.ncbi.nlm.nih.gov", "pubmed.ncbi.nlm.nih.gov",
    "journals.biologists.com", "tdr.lib.ntu.edu.tw",
  ]);
  return (PRODUCT_ENRICHMENTS.find(product=>product.id===id)?.references ?? [])
    .filter(reference => publicHosts.has(new URL(reference.url).hostname));
}
