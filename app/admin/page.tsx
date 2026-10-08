import Link from "next/link";
import { getAdminSummary } from "@/lib/admin/catalog";

export default async function AdminPage() {
  const summary = await getAdminSummary();
  const cards = [
    ["Products", summary.products.count],
    ["Active", summary.products.active],
    ["Quote only", summary.products.rfq],
    ["Featured", summary.products.featured],
    ["Hot", summary.products.hot],
    ["Categories", summary.categories],
    ["Orders", summary.orders],
  ];
  return (
    <div>
      <h1 className="text-3xl font-bold">Commerce dashboard</h1>
      <p className="mt-2 text-[var(--color-muted)]">Products, inventory and orders in one GlycoDepot interface.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-[var(--color-border)] bg-white p-5">
            <div className="text-sm text-[var(--color-muted)]">{label}</div>
            <div className="mt-2 text-3xl font-bold">{value}</div>
          </div>
        ))}
      </div>
      <Link href="/admin/products" className="mt-8 inline-flex rounded-full bg-[var(--color-brand)] px-5 py-3 font-semibold text-white">Manage products</Link>
    </div>
  );
}
