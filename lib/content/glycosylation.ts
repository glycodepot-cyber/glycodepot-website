/**
 * Content for /services/enzymatic-glycosylation.
 *
 * The published case-study figures below are drawn from the peer-reviewed
 * literature on glycosylated analogues. They illustrate what the chemistry can
 * do and are NOT GlycoDepot project results — keep that framing in the UI.
 */

export const glycosylationHero = {
  eyebrow: "Enzymatic Glycosylation",
  title: "Put a sugar on your molecule — and change what it can do.",
  intro:
    "GlycoDepot screens your small molecule against a library of 380 plant glycosyltransferases to find enzymes that glycosylate it regio- and stereo-specifically, then scales the winning reaction from milligrams to grams. No protecting-group chemistry. No IP claims on your composition.",
};

export interface GlycoStat {
  value: string;
  label: string;
}

export const glycosylationStats: GlycoStat[] = [
  { value: "380", label: "UGT enzymes in the screening library" },
  { value: "145", label: "Di-glycosyltransferases for sugar-on-sugar" },
  { value: "30", label: "Taxonomically dispersed plant species" },
  { value: "75%", label: "Of small molecules are glycosylated by the library" },
];

export const glycosylationWhy = [
  "Medicinal and process chemists reach for hydroxylation, methylation and fluorination routinely. Glycosylation — attaching a sugar — is used far less, not because it works less well, but because doing it chemically is painful: a molecule with several reactive groups needs protection and deprotection at every step.",
  "Enzymes remove that problem. A glycosyltransferase picks one position on your molecule and attaches one sugar, in one step, in water. The difficulty moves from the chemistry to finding the right enzyme — which is what this service exists to do.",
];

export const glycosylationBenefits = [
  "Increase solubility, often by orders of magnitude",
  "Optimise drug delivery with prodrugs cleaved at the target tissue",
  "Improve blood-brain barrier penetration via glucose transporters",
  "Optimise tissue targeting using local glucuronidase or gut flora",
  "Improve potency and selectivity",
  "Change organoleptic properties — sweetness, bitterness, colour stability",
  "Create novel, patentable composition of matter",
  "Improve production by detoxifying a product that poisons its own host",
];

export interface GlycoPlatformRow {
  component: string;
  detail: string;
}

export const glycosylationPlatform: GlycoPlatformRow[] = [
  {
    component: "Primary library",
    detail:
      "380 individual UGT enzymes, one per well, across four 96-well microtiter plates",
  },
  {
    component: "Di-glycosylation library",
    detail:
      "145 di-glycosyltransferases for sugar-on-sugar linkages — 1,2-, 1,3- and 1,6-bonds",
  },
  {
    component: "Sugar donors",
    detail:
      "Most enzymes transfer glucose; others accept xylose, rhamnose, galactose or glucuronic acid",
  },
  {
    component: "Selectivity",
    detail:
      "Regio-specific in most cases and frequently stereo-specific — no protecting groups required",
  },
  {
    component: "Analytics",
    detail:
      "UHPLC-MS/MS (triple quadrupole) with UV; methods developed per substrate",
  },
  {
    component: "Hit rate",
    detail:
      "Approximately 75% of small molecules submitted are glycosylated by at least one library member",
  },
];

export interface GlycoCase {
  title: string;
  body: string;
  highlight: string;
  cite: string;
}

export const glycosylationCases: GlycoCase[] = [
  {
    title: "Solubility — curcumin",
    body: "Curcumin is notoriously insoluble in water. Glucosylation produced a monoglucoside at roughly 230-fold the solubility of curcumin, and a digentiobioside carrying four glucose units at around 20 million-fold.",
    highlight: "~230× to 20,000,000× solubility",
    cite: "Kaminaga et al., FEBS Lett.",
  },
  {
    title: "Blood-brain barrier — dopamine",
    body: "Dopamine does not cross the BBB. Glucose and galactose prodrugs did, probably via GLUT transporters, and the galactoside outperformed L-DOPA in two rodent Parkinson's models. O-glycosylation of a linear opioid peptide roughly doubled BBB permeability.",
    highlight: "2× BBB permeability",
    cite: "Bonina et al.; Egleton et al.",
  },
  {
    title: "Potency — morphine-6-glucuronide",
    body: "The 6-glucuronide of morphine is reported to be far more potent as an analgesic than morphine in animal models, with a longer-lasting effect and greater µ-selectivity.",
    highlight: "45–60× more potent",
    cite: "Frances et al.",
  },
  {
    title: "Tumour targeting — doxorubicin",
    body: "Doxorubicin's dose is capped by cardiac toxicity. A glucuronide prodrug was taken up into bronchial carcinoma tissue at a much higher rate, with β-glucuronidase in the tumour releasing the active drug locally.",
    highlight: "7× tumour uptake",
    cite: "Mürdter et al., Cancer Res. 57:2440",
  },
  {
    title: "Mechanism switching — digitoxin",
    body: "Replacing digitoxin's natural trisaccharide with single sugars abolished Na⁺/K⁺-ATPase inhibition entirely while diversifying cytotoxicity — one new glycoside was strongly active against a single cancer cell line and weak against the other eight.",
    highlight: "Selectivity from 1-of-9 to 9-of-9",
    cite: "Langenhan et al., PNAS 102:12305",
  },
  {
    title: "Manufacturability — vanillin",
    body: "Vanillin is toxic to the yeast that produces it, capping titre. A vanillin glycosyltransferase converts it in situ to the non-toxic glucoside, allowing much higher titres; cheap hydrolases release the vanillin afterwards. This route is used in commercial manufacture.",
    highlight: "In commercial production today",
    cite: "Hansen et al.",
  },
];

export interface GlycoRoute {
  key: string;
  title: string;
  summary: string;
  points: string[];
  bestWhen: string;
}

export const glycosylationRoutes: GlycoRoute[] = [
  {
    key: "kit",
    title: "GlycoT Discovery Kit — run it yourself",
    summary:
      "The full 380-enzyme library ships to your lab in four 96-well plates. You supply the UDP-sugar donor and run the plates against your substrate on your own HPLC or LC-MS.",
    points: [
      "380 purified UGTs, with enough enzyme per well for your chosen number of reactions",
      "TCP positive control, detailed protocols, online and phone support",
      "On a hit, we supply the enzyme identity, sequence and an E. coli expression plasmid",
    ],
    bestWhen:
      "You have the analytics in-house and want the substrate never to leave your building.",
  },
  {
    key: "service",
    title: "Full screening & production service",
    summary:
      "You send 10–30 mg of substrate. We develop the analytical method, run the screen, rank the hits and scale the winner.",
    points: [
      "Phase I — screen all 380 enzymes, 20 h incubations, UHPLC-MS/MS readout, hits ranked by conversion",
      "Phase I-b (optional) — the 145-member di-glycosylation library for poly-glycosides",
      "Phase II — bioconversion and purification to 50–100 mg, or to more than 1 g",
      "Phase III (optional) — gram-scale, 1–10 g, priced on Phase II data",
    ],
    bestWhen: "You want a decision and material, not a screening project.",
  },
];

export interface GlycoPhase {
  phase: string;
  optional?: boolean;
  work: string;
  duration: string;
  deliverable: string;
}

export const glycosylationPhases: GlycoPhase[] = [
  {
    phase: "I-a",
    work: "Analytical method development; screen of all 380 UGTs against your substrate with UDP-glucose, 20 h incubations, UHPLC-MS/MS readout",
    duration: "4–6 weeks",
    deliverable: "Ranked hit list with chromatograms",
  },
  {
    phase: "I-b",
    optional: true,
    work: "Secondary screen of up to 3 Phase I-a products against the 145-member di-glycosyltransferase library",
    duration: "4–7 weeks",
    deliverable: "Poly-glycosylation report",
  },
  {
    phase: "II",
    work: "Large-scale enzyme preparation, bioconversion, extraction and purification; purity by UHPLC-UV",
    duration: "5–12 weeks",
    deliverable: "50–100 mg, or more than 1 g, of purified product",
  },
  {
    phase: "III",
    optional: true,
    work: "Gram-scale bioconversion and purification based on Phase II data",
    duration: "8–10 weeks",
    deliverable: "1–10 g of product",
  },
];

export const glycosylationTerms = [
  "No IP claims — you own any resulting composition of matter.",
  "No downstream fees — no royalties, milestones or success fees.",
  "All work, substrates and results are handled under confidentiality.",
  "Invoiced half at the start of each agreed phase, half on delivery of the final report.",
];

export const glycosylationPricing = {
  headline: "Discovery Kits start at $10,900.",
  body: "Kits are priced by the number of reactions per well. Full screening and production programmes are quoted per project against your substrate, scope and target quantity. Enzyme identities and E. coli expression plasmids are available separately once a screen returns a positive hit.",
};

export const glycosylationLeadMagnet = {
  eyebrow: "Technical brochure",
  title: "Get the full technical brochure",
  description:
    "Sixteen pages covering the enzyme toolkit, the published case studies in detail, the phase-by-phase work plan, full kit and plasmid pricing, and two worked project quotations. Tell us a little about your project and we will email it to you.",
  points: [
    "Complete kit, plasmid and project pricing",
    "Two worked quotations with timelines and deliverables",
    "Full reference list for every case study cited",
  ],
  privacyNote:
    "No structures or confidential details needed. We are happy to sign an NDA before you share anything about your molecule.",
};

export const glycosylationDisclaimer =
  "Case-study figures above are drawn from the published literature on glycosylated analogues and illustrate what the chemistry can achieve; they are not GlycoDepot project results. This service is for Research Use Only, not intended for any clinical use.";
