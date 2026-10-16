import Link from "next/link";
import { BrandButton } from "@/components/primitives";
import type { OfferPage } from "@/lib/content/offer-pages";

export function CategoryOffer({ offer, position }: { offer: OfferPage; position: "intro" | "details" }) {
  if (position === "intro") return (
    <div className="mb-9 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 sm:p-8">
      <p className="max-w-3xl text-[16px] leading-relaxed text-[var(--color-muted-foreground)]">{offer.intro}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <BrandButton href="#catalog">Browse products &amp; prices</BrandButton>
        <BrandButton tone="outline" href="/quote-request">View quote list</BrandButton>
        <Link href="/services/custom-glycan-synthesis#request" className="self-center text-sm font-semibold text-[var(--color-brand)] hover:underline">Need a custom structure?</Link>
      </div>
      <p className="mt-4 text-sm text-[var(--color-muted-foreground)]">Select packs on each product page. Checkout for priced products; request a quote for bulk or custom requirements.</p>
    </div>
  );
  return (
    <div className="mt-12 grid gap-8 border-t border-[var(--color-border)] pt-10 lg:grid-cols-2">
      <div>
        <h2 className="type-h2">{offer.selectionTitle}</h2>
        <ul className="mt-5 list-disc space-y-4 pl-5 text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
          {offer.selection.map(item => <li key={item}>{item}</li>)}
        </ul>
        <p className="mt-6 text-sm text-[var(--color-muted-foreground)]">For Research Use Only. Ask our team about specifications and availability for your application.</p>
      </div>
      <div>
        <h2 className="type-h2">Questions before you order</h2>
        <div className="mt-5 divide-y divide-[var(--color-border)]">
          {offer.faqs.map(faq => <details key={faq.question} className="py-4"><summary className="cursor-pointer font-semibold">{faq.question}</summary><p className="mt-3 text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">{faq.answer}</p></details>)}
        </div>
      </div>
    </div>
  );
}
