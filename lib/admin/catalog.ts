import "server-only";

import { getDb } from "@/lib/db";

export async function getAdminSummary() {
  const sql = getDb();
  const [products, categories, orders] = await Promise.all([
    sql`SELECT count(*)::int AS count,
               count(*) FILTER (WHERE is_active)::int AS active,
               count(*) FILTER (WHERE is_rfq)::int AS rfq
        FROM products`,
    sql`SELECT count(*)::int AS count FROM categories`,
    sql`SELECT count(*)::int AS count FROM orders`,
  ]);
  return {
    products: products[0] as { count: number; active: number; rfq: number },
    categories: (categories[0] as { count: number }).count,
    orders: (orders[0] as { count: number }).count,
  };
}

export async function listAdminProducts(search = "") {
  const sql = getDb();
  const q = `%${search.trim()}%`;
  return sql`SELECT id, name, sku, price_cents, stock_quantity, is_rfq, is_active
             FROM products
             WHERE ${search.trim() === ""} OR name ILIKE ${q} OR sku ILIKE ${q}
             ORDER BY updated_at DESC, name
             LIMIT 100`;
}

export async function getAdminProduct(id: string) {
  const sql = getDb();
  const rows = await sql`SELECT id, name, slug, sku, description, unit, price_cents,
                                compare_at_price_cents, stock_quantity, is_rfq, is_active
                         FROM products WHERE id = ${id} LIMIT 1`;
  return rows[0] ?? null;
}

export async function updateAdminProduct(input: {
  id: string; name: string; sku: string; description: string; unit: string;
  priceCents: number | null; compareAtPriceCents: number | null;
  stockQuantity: number; isRfq: boolean; isActive: boolean;
}) {
  const sql = getDb();
  await sql`UPDATE products SET
      name = ${input.name}, sku = ${input.sku || null},
      description = ${input.description || null}, unit = ${input.unit || null},
      price_cents = ${input.isRfq ? null : input.priceCents},
      compare_at_price_cents = ${input.isRfq ? null : input.compareAtPriceCents},
      stock_quantity = ${input.stockQuantity}, is_rfq = ${input.isRfq},
      is_active = ${input.isActive}, updated_at = now()
    WHERE id = ${input.id}`;
}

