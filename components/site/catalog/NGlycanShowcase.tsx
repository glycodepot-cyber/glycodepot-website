import Image from "next/image";
import { BrandButton } from "@/components/primitives";

const base = "/images/science/nglycan-standards/";
const structures = [
  { image: "sialylated-fucosylated-arm-a.png", width: 322, height: 534, title: "Sialylated, fucosylated N-glycan", detail: "Antenna placement defines the target", alt: "Biantennary N-glycan with an alpha 2-3 sialylated, alpha 1-3 fucosylated antenna on the alpha 1-6 mannose arm" },
  { image: "sialylated-fucosylated-arm-b.png", width: 301, height: 528, title: "Alternative antenna arrangement", detail: "Compare the branch and linkage pattern", alt: "Biantennary N-glycan with an alpha 2-3 sialylated, alpha 1-3 fucosylated antenna on the alpha 1-3 mannose arm" },
  { image: "sialylated-lewis-a-arm.png", width: 321, height: 522, title: "Alternative terminal linkages", detail: "Galactose and fucose linkages matter", alt: "Biantennary N-glycan with an alpha 2-3 sialylated beta 1-3 galactose and alpha 1-4 fucose terminal motif" },
  { image: "sialylated-lewis-a-counterpart.png", width: 296, height: 541, title: "Branch-specific counterpart", detail: "Specify the complete structure", alt: "Related biantennary N-glycan with a sialylated beta 1-3 galactose and alpha 1-4 fucose motif on the other antenna" },
];

export function NGlycanShowcase() {
  return <section aria-labelledby="nglycan-library-title" className="mb-14 overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white">
    <div className="relative overflow-hidden bg-gradient-to-br from-[#073f30] via-[#086345] to-[#0c7550] px-6 py-10 text-white sm:px-10 sm:py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">N-glycan standards</p>
      <h2 id="nglycan-library-title" className="mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">The right structure.<br />Down to the linkage.</h2>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-emerald-50">Explore selected structures from our N-glycan standard projects. Closely related glycans can differ in antenna placement or terminal linkages. Share your exact target with our team.</p>
      <div className="mt-7"><BrandButton href="/services/custom-glycan-synthesis#request" className="border border-white/40 bg-white text-[#073f30] hover:bg-emerald-50">Consult our expert</BrandButton></div>
    </div>
    <div className="grid divide-y divide-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0">
      {structures.map((s) => <figure key={s.image} className="group flex flex-col border-[var(--color-border)] p-6 sm:odd:border-r lg:border-r lg:last:border-r-0">
        <a href={base + s.image} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size structure: ${s.title}`} className="flex h-72 items-center justify-center rounded-2xl bg-white outline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--color-brand)]">
          <Image src={base + s.image} width={s.width} height={s.height} alt={s.alt} sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 20vw" className="h-full w-full object-contain p-3 transition-transform duration-300 motion-safe:group-hover:scale-105" />
        </a>
        <figcaption className="mt-5"><h3 className="text-base font-semibold">{s.title}</h3><p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">{s.detail}</p><span className="mt-3 inline-block text-xs font-semibold text-[var(--color-brand)]">Select drawing to enlarge ↗</span></figcaption>
      </figure>)}
    </div>
    <div className="border-t border-[var(--color-border)] bg-[var(--color-brand-soft)] p-6 sm:p-10">
      <div className="max-w-3xl"><p className="type-overline text-[var(--color-brand)]">Analytical examples</p><h3 className="type-h2 mt-3">Structure with supporting characterization</h3><p className="mt-4 text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">Selected proton NMR spectra from the two antenna arrangements shown above. These are project examples, rather than certificates for every product or batch. Ask our team for the documentation and specifications available for your requested standard.</p></div>
      <div className="mt-7 grid gap-6 md:grid-cols-2">{[
        { image: "standard-arm-a-nmr.png", width: 641, height: 482, caption: "Proton NMR · first antenna arrangement" },
        { image: "standard-arm-b-nmr.png", width: 625, height: 471, caption: "Proton NMR · alternative antenna arrangement" },
      ].map(s => <figure key={s.image} className="rounded-2xl border border-[var(--color-border)] bg-white p-4"><a href={base + s.image} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size ${s.caption}`}><Image src={base + s.image} width={s.width} height={s.height} alt={s.caption + ", supplied project characterization spectrum"} sizes="(max-width: 768px) 90vw, 45vw" className="h-auto w-full" /></a><figcaption className="mt-4 border-t border-[var(--color-border)] pt-3 text-sm font-semibold">{s.caption}</figcaption></figure>)}</div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-5"><p className="max-w-2xl text-xs leading-relaxed text-[var(--color-muted-foreground)]">Selected project structures do not indicate current stock. Confirm the exact structure, chemical form, quantity and analytical package with our team. Research Use Only.</p><BrandButton href="/services/custom-glycan-synthesis#request" tone="outline">Consult our expert</BrandButton></div>
      <p className="mt-6 text-xs text-[var(--color-muted-foreground)]">Structure notation reference: <a href="https://www.ncbi.nlm.nih.gov/glycans/snfg.html" target="_blank" rel="noopener noreferrer" className="underline">Symbol Nomenclature for Glycans (SNFG)</a>. Drawings and spectra shown here are supplied GlycoDepot project materials.</p>
    </div>
  </section>;
}
