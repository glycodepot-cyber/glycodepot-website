import "server-only";

import { cache } from "react";
import { getDb } from "@/lib/db";
import type { Category, Product, ProductVariant } from "./types";

type CategoryRow = { id: string; slug: string; name: string; description: string | null };
type ProductRow = {
  id: string; slug: string; sku: string | null; name: string;
  short_description: string | null; description: string | null;
  primary_category_id: string | null; price_cents: number | null;
  compare_at_price_cents: number | null; currency: "USD";
  stock_quantity: number; is_rfq: boolean; attributes: Record<string, string> | null;
};
type VariantRow = {
  id: string; product_id: string; sku: string | null; name: string | null;
  price_cents: number | null; compare_at_price_cents: number | null;
  stock_quantity: number; is_active: boolean;
};
type ImageRow = { product_id: string; src: string; alt: string };
type ProductCategoryRow = { product_id: string; category_id: string };

const money = (cents: number | null) =>
  cents === null ? null : { amount: cents / 100, currency: "USD" as const };

export const loadDatabaseCatalog = cache(async (): Promise<{
  products: Product[];
  categories: Category[];
}> => {
  const sql = getDb();
  const results = await Promise.all([
    sql`SELECT id, slug, name, description FROM categories ORDER BY name`,
    sql`SELECT id, slug, sku, name, short_description, description,
               primary_category_id, price_cents, compare_at_price_cents,
               currency, stock_quantity, is_rfq, attributes
        FROM products WHERE is_active = true ORDER BY name`,
    sql`SELECT id, product_id, sku, name, price_cents, compare_at_price_cents,
               stock_quantity, is_active
        FROM product_variants WHERE is_active = true ORDER BY id`,
    sql`SELECT product_id, src, alt FROM product_images ORDER BY product_id, position`,
    sql`SELECT product_id, category_id FROM product_categories`,
  ]);
  const categoryRows = results[0] as unknown as CategoryRow[];
  const productRows = results[1] as unknown as ProductRow[];
  const variantRows = results[2] as unknown as VariantRow[];
  const imageRows = results[3] as unknown as ImageRow[];
  const linkRows = results[4] as unknown as ProductCategoryRow[];

  const categoryCounts = new Map<string, number>();
  const categoriesByProduct = new Map<string, string[]>();
  for (const row of linkRows) {
    const ids = categoriesByProduct.get(row.product_id) ?? [];
    ids.push(row.category_id);
    categoriesByProduct.set(row.product_id, ids);
    categoryCounts.set(row.category_id, (categoryCounts.get(row.category_id) ?? 0) + 1);
  }
  const categories: Category[] = categoryRows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? undefined,
    productCount: categoryCounts.get(row.id) ?? 0,
  }));

  const variants = new Map<string, ProductVariant[]>();
  for (const row of variantRows) {
    const items = variants.get(row.product_id) ?? [];
    items.push({
      id: row.id,
      sku: row.sku ?? undefined,
      name: row.name ?? undefined,
      price: money(row.price_cents),
      compareAtPrice: money(row.compare_at_price_cents),
      inStock: row.stock_quantity > 0,
    });
    variants.set(row.product_id, items);
  }

  const images = new Map<string, Array<{ src: string; alt: string }>>();
  for (const row of imageRows) {
    const items = images.get(row.product_id) ?? [];
    items.push({ src: row.src, alt: row.alt });
    images.set(row.product_id, items);
  }

  const products: Product[] = productRows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description ?? undefined,
    description: row.description ?? undefined,
    categories: categoriesByProduct.get(row.id) ?? (row.primary_category_id ? [row.primary_category_id] : []),
    primaryCategoryId: row.primary_category_id ?? undefined,
    images: images.get(row.id) ?? [{ src: "/Glycodepot_Logo.jpeg", alt: row.name }],
    variants: variants.get(row.id) ?? [],
    price: row.is_rfq ? null : money(row.price_cents),
    compareAtPrice: row.is_rfq ? null : money(row.compare_at_price_cents),
    isRfq: row.is_rfq || undefined,
    badge: null,
    attributes: row.attributes ?? (row.sku ? { SKU: row.sku } : undefined),
  }));

  return { products, categories };
});
