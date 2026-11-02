import { requireAdmin } from "@/lib/admin/auth";
import { getPricePolicyPreview } from "@/lib/admin/price-policy";
import { applyPricePolicyAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function PricePolicyPage() {
  await requireAdmin();
  const { protectedProducts, summary, audit } = await getPricePolicyPreview();
  return <main className="mx-auto max-w-4xl space-y-6 p-8">
    <h1 className="text-3xl font-bold">Quote-only catalog pricing</h1>
    <p>Preserve the 21 October stock-list sugar nucleotides. Convert other stored prices to the nearest lower .99 ending (47 becomes 46.99). Missing prices stay quote-only. Prices below 0.99 become 0.99.</p>
    <p>Customers see Request a quote for .99 prices. Changing a price to a non-.99 amount restores purchasing for that pack, subject to stock availability.</p>
    <dl className="grid grid-cols-3 gap-4 rounded-xl border p-5">
      <div><dt>Other products</dt><dd>{String(summary.products)}</dd></div>
      <div><dt>Priced products</dt><dd>{String(summary.priced_products)}</dd></div>
      <div><dt>Priced variants</dt><dd>{String(summary.priced_variants)}</dd></div>
    </dl>
    <p>Prices below 0.99: {String(summary.small_product_prices)} product prices and {String(summary.small_variant_prices)} variant prices.</p>
    <h2 className="text-xl font-semibold">Protected products ({protectedProducts.length}/21)</h2>
    <ul className="grid gap-2 sm:grid-cols-2">{protectedProducts.map(p => <li key={String(p.id)}>{String(p.name)}</li>)}</ul>
    {audit ? <section role="status" className="rounded-xl border border-green-700 p-5"><h2 className="font-bold">Price policy applied</h2><p>Original prices were saved before the update.</p><pre className="mt-3 whitespace-pre-wrap">{JSON.stringify(audit.summary,null,2)}</pre></section>
      : <form action={applyPricePolicyAction}><button disabled={protectedProducts.length!==21} className="rounded-full bg-green-800 px-6 py-3 font-semibold text-white disabled:opacity-50">Apply .99 RFQ policy</button></form>}
  </main>;
}
