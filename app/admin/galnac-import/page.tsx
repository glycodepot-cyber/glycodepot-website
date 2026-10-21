import { requireAdmin } from '@/lib/admin/auth';
import { getGalnacPreview, GALNAC_CATEGORY, isGalnacCopyApplied } from '@/lib/admin/galnac-import';
import products from '@/lib/content/galnac-products.json';
import { importGalnacAction, updateGalnacScaleCopyAction } from './actions';
export const dynamic='force-dynamic';
export default async function Page(){
 await requireAdmin();const state=await getGalnacPreview();const copyApplied=await isGalnacCopyApplied();
 return <div className="space-y-6"><h1 className="text-3xl font-bold">GalNAc catalog import</h1><p>{GALNAC_CATEGORY.name}: 25 products, 75 quote-only variants. 1 g, 10 g and 100 g. Existing products are preserved.</p>
 {state.applied?<p role="status" className="rounded-xl border border-green-700 p-5">Import complete: 25 products and 75 quote-only variants.</p>:<form action={importGalnacAction}><button disabled={state.existing.length>0} className="rounded-full bg-green-800 px-6 py-3 text-white disabled:opacity-50">Publish 25 GalNAc products</button></form>}
 {state.existing.length&&!state.applied?<pre>{JSON.stringify(state.existing,null,2)}</pre>:null}
 {state.applied ? (copyApplied ? <p role="status">Scale supply copy applied to 25 products.</p> : <form action={updateGalnacScaleCopyAction}><button className="rounded-full bg-green-800 px-6 py-3 text-white">Update supply wording and unavailable CAS fields</button></form>) : null}
 <div className="grid gap-4">{products.map(p=><article key={p.id} className="rounded-xl border p-5"><h2 className="font-bold">{p.name}</h2><p>{p.sku} · {p.attributes['CAS number']}</p><p className="whitespace-pre-line">{p.description}</p></article>)}</div></div>;
}
