import { notFound } from "next/navigation";
import { getAdminProduct } from "@/lib/admin/catalog";
import { saveProduct } from "../../actions";

function dollars(cents: unknown) { return cents == null ? "" : (Number(cents) / 100).toFixed(2); }

export default async function AdminProductPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { id } = await params;
  const product = await getAdminProduct(id);
  if (!product) notFound();
  const saved = (await searchParams).saved === "1";
  const field = "mt-1 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 py-2";
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold">Edit product</h1>
      {saved ? <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-green-800">Product saved.</p> : null}
      <form action={saveProduct} className="mt-6 space-y-5 rounded-xl border border-[var(--color-border)] bg-white p-6">
        <input type="hidden" name="id" value={String(product.id)}/>
        <label className="block text-sm font-semibold">Name<input className={field} name="name" required defaultValue={String(product.name)}/></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">SKU<input className={field} name="sku" defaultValue={String(product.sku ?? "")}/></label><label className="block text-sm font-semibold">Unit<input className={field} name="unit" defaultValue={String(product.unit ?? "")}/></label></div>
        <div className="grid gap-4 sm:grid-cols-3"><label className="block text-sm font-semibold">Price (USD)<input className={field} type="number" min="0" step="0.01" name="price" defaultValue={dollars(product.price_cents)}/></label><label className="block text-sm font-semibold">Compare-at price<input className={field} type="number" min="0" step="0.01" name="compareAtPrice" defaultValue={dollars(product.compare_at_price_cents)}/></label><label className="block text-sm font-semibold">Stock<input className={field} type="number" min="0" step="1" name="stockQuantity" defaultValue={String(product.stock_quantity)}/></label></div>
        <label className="block text-sm font-semibold">Description<textarea className={`${field} min-h-48`} name="description" defaultValue={String(product.description ?? "")}/></label>
        <div className="flex gap-6"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="isRfq" defaultChecked={Boolean(product.is_rfq)}/> Quote only</label><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="isActive" defaultChecked={Boolean(product.is_active)}/> Active</label></div>
        <button className="rounded-full bg-[var(--color-brand)] px-6 py-3 font-semibold text-white">Save product</button>
      </form>
    </div>
  );
}

