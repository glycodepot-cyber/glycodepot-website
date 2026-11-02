import { requireAdmin } from "@/lib/admin/auth";
import { getProductContentPreview } from "@/lib/admin/product-content";
import { PRODUCT_ENRICHMENTS } from "@/lib/content/product-enrichment";
import { applyProductContentAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProductContentPage() {
  await requireAdmin();
  const {products,audit}=await getProductContentPreview();
  return <main className="mx-auto max-w-5xl space-y-6 p-8">
    <h1 className="text-3xl font-bold">Priority product chemistry & SEO update</h1>
    <p>Update the 21 priority sugar nucleotide names, descriptions, SEO fields and chemistry attributes. Slugs, prices, stock, variants, images and RFQ settings stay unchanged. Original rows are archived atomically before this one-time update. Later catalog edits remain authoritative.</p>
    <p>Matched active products: {products.length}/21</p>
    {audit ? <section role="status" className="rounded-xl border border-green-700 p-5"><h2 className="font-bold">Product content applied</h2><pre>{JSON.stringify(audit.summary,null,2)}</pre></section>
      : <form action={applyProductContentAction}><button disabled={products.length!==21} className="rounded-full bg-green-800 px-6 py-3 font-semibold text-white disabled:opacity-50">Apply verified product content</button></form>}
    <div className="space-y-6">{PRODUCT_ENRICHMENTS.map(product=><article key={product.id} className="space-y-3 rounded-xl border p-5">
      <h2 className="text-xl font-semibold">{product.name}</h2>
      <p className="text-sm">{product.id} · Current name: {String(products.find(p=>p.id===product.id)?.name ?? "MISSING")}</p>
      <p>{product.shortDescription}</p>
      <details><summary>Review description, specifications and sources</summary><p className="my-3 whitespace-pre-line">{product.description}</p><dl>{Object.entries(product.attributes).map(([key,value])=><div key={key} className="py-1"><dt className="font-semibold">{key}</dt><dd>{value}</dd></div>)}</dl><ul className="mt-3">{product.references.map(reference=><li key={reference.url}><a href={reference.url} className="underline">{reference.label}</a></li>)}</ul></details>
    </article>)}</div>
  </main>;
}
