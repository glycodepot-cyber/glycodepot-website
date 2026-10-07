import Link from "next/link";
import { requireStaff } from "@/lib/admin/auth";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const staff = await requireStaff();
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <header className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold text-[var(--color-brand)]">
              GlycoDepot Admin
            </Link>
            <Link href="/admin/products" className="text-sm font-medium">
              Products
            </Link>
            <Link href="/admin/categories" className="text-sm font-medium">
              Categories
            </Link>
            <Link href="/admin/tags" className="text-sm font-medium">
              Tags
            </Link>
            <Link href="/" className="text-sm text-[var(--color-muted)]">
              View storefront
            </Link>
          </div>
          <span className="text-xs text-[var(--color-muted)]">
            {staff.email} ·{" "}
            {staff.role === "admin" ? "Administrator" : "Product manager"}
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
