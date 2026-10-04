import Link from "next/link";
import { listAdminProducts } from "@/lib/admin/catalog";
import { importProducts } from "./import-action";

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; imported?: string; skipped?: string; error?: string }> }) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const products = await listAdminProducts(q);
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Products</h1><p className="mt-1 text-sm text-[var(--color-muted)]">Showing up to 100 products.</p></div>
        <form className="flex gap-2"><input name="q" defaultValue={q} placeholder="Name or SKU" className="h-11 rounded-lg border border-[var(--color-border)] bg-white px-4"/><button className="rounded-lg bg-[var(--color-brand)] px-5 font-semibold text-white">Search</button></form>
      </div>
      <section className="mt-6 rounded-xl border border-[var(--color-border)] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><h2 className="font-bold">Bulk edit products</h2><p className="mt-1 text-sm text-[var(--color-muted)]">Export XLSX, edit the rows, then import it back. Product ID is the stable match key.</p></div>
          <Link href="/admin/products/export" className="rounded-lg border border-[var(--color-brand)] px-4 py-2 font-semibold text-[var(--color-brand)]">Export XLSX</Link>
        </div>
        <form action={importProducts} className="mt-4 flex flex-wrap items-center gap-3">
          <input required type="file" name="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="max-w-full text-sm" />
          <button className="rounded-lg bg-[var(--color-brand)] px-4 py-2 font-semibold text-white">Import updates</button>
        </form>
        {params.imported && <p className="mt-3 text-sm text-[var(--color-success)]">Updated {params.imported} products; skipped {params.skipped ?? "0"} unmatched rows.</p>}
        {params.error && <p className="mt-3 text-sm text-red-700">{params.error}</p>}
      </section>
      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--color-border)] bg-white">
        <table className="w-full text-left text-sm"><thead className="bg-[var(--color-surface)]"><tr>{["Product", "SKU", "Price", "Stock", "Status", ""].map(h=><th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody>{products.map((product) => <tr key={String(product.id)} className="border-t border-[var(--color-border)]"><td className="px-4 py-3 font-medium">{String(product.name)}</td><td className="px-4 py-3">{String(product.sku ?? "—")}</td><td className="px-4 py-3">{product.is_rfq ? "Quote" : product.price_cents == null ? "—" : `$${(Number(product.price_cents)/100).toFixed(2)}`}</td><td className="px-4 py-3">{String(product.stock_quantity)}</td><td className="px-4 py-3">{product.is_active ? "Active" : "Hidden"}</td><td className="px-4 py-3 text-right"><Link className="font-semibold text-[var(--color-brand)]" href={`/admin/products/${product.id}`}>Edit</Link></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
