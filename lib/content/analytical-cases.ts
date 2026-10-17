const base = "/images/science/case-studies/";
export const analyticalCases = [
  {
    id: "gd2-characterization", number: "03", title: "GD2 ganglioside characterization", methods: "Proton NMR · Mass spectrometry · HPLC",
    brief: "A GD2-ceramide project with complementary structural and chromatographic characterization.",
    detail: "The supplied analytical package includes a proton NMR spectrum, a mass spectrum, and an HPLC chromatogram with its integrated peak table. Review the original panels below and discuss the chemical form, quantity, and batch requirements with our team.",
    slides: [{ src: base + "gd2-nmr.png", caption: "Proton NMR spectrum" }, { src: base + "gd2-ms.png", caption: "Mass spectrum" }, { src: base + "gd2-hplc.png", caption: "HPLC chromatogram and integrated peak table" }],
  },
  {
    id: "confidential-siglec-ligand", number: "04", title: "Custom Siglec ligand", methods: "Proton NMR · Mass spectrometry · HPLC",
    brief: "A custom ligand project supported by NMR, mass-spectrometric, and chromatographic data.",
    detail: "The analytical panels document the supplied project material. Only the supplied partial molecular drawing is shown. The full ligand identity remains confidential. These data do not establish binding affinity or biological activity, which require separate evaluation.",
    slides: [{ src: base + "siglec-partial-structure.png", caption: "Supplied partial Siglec-ligand structure" }, { src: base + "siglec-nmr-cropped.png", caption: "Proton NMR · displayed range 7–1.6 ppm" }, { src: base + "siglec-ms.png", caption: "Mass spectrum" }, { src: base + "siglec-hplc.png", caption: "HPLC chromatogram and integrated peak table" }],
  },
  {
    id: "n-glycan-reference-panel", number: "05", title: "N-glycan standard panel", methods: "Proton NMR · Structure-defined research standards",
    brief: "A panel of related N-glycan standards with individual proton NMR records and glycan structure diagrams.",
    detail: "Four supplied N-glycan examples show different terminal motifs and branch arrangements. Each spectrum is paired with its own structure. Select standards by the complete structure and linkage pattern, and confirm the required specifications with our experts.",
    slides: [1, 2, 3, 4].map(i => ({ src: base + `nglycan-panel-${i}.png`, caption: `Proton NMR and structure · N-glycan example ${i}` })),
  },
  {
    id: "oligosaccharide-standards", number: "06", title: "Oligosaccharide standards", methods: "Proton NMR · Defined carbohydrate materials",
    brief: "Selected oligosaccharide reference materials with proton NMR characterization, including a sialyl Lewis X example.",
    detail: "The supplied records include two oligosaccharide panels and a separate sialyl Lewis X spectrum. NMR is the available method for these examples. Discuss any additional mass-spectrometric or chromatographic documentation needed for your application.",
    slides: [{ src: base + "oligosaccharide-panel-1.png", caption: "Proton NMR · oligosaccharide example 1" }, { src: base + "oligosaccharide-panel-2.png", caption: "Proton NMR and structure · oligosaccharide example 2" }, { src: base + "sialyl-lewis-x-nmr.png", caption: "Proton NMR · sialyl Lewis X" }],
  },
];
