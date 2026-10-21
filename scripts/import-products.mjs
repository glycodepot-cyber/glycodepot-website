import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { neon } from "@neondatabase/serverless";
import ExcelJS from "exceljs";

const root = path.resolve(import.meta.dirname, "..");
const source = process.argv.find((arg) => arg.endsWith(".xlsx"));
const apply = process.argv.includes("--apply");
if (!source) throw new Error("Usage: npm run import:products -- /path/products.xlsx [--apply]");

const file = await fs.readFile(path.resolve(source));
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.load(file);
const worksheet = workbook.worksheets[0];
if (!worksheet) throw new Error("The workbook has no worksheets");
const normalizeCell = (value) => {
  if (value === undefined || value === null) return null;
  if (typeof value === "object" && "result" in value) return value.result ?? null;
  if (typeof value === "object" && "richText" in value) return value.richText.map((part) => part.text).join("");
  if (typeof value === "object" && "text" in value) return value.text;
  return value;
};
const headers = worksheet.getRow(1).values.slice(1).map(normalizeCell);
const rows = [];
worksheet.eachRow((row, number) => {
  if (number === 1) return;
  const values = row.values.slice(1).map(normalizeCell);
  if (!values.some((value) => value !== null && value !== "")) return;
  rows.push(Object.fromEntries(headers.map((header, index) => [header, values[index] ?? null])));
});
const cached = JSON.parse(await fs.readFile(path.join(root, "lib/data/catalog.json"), "utf8"));

const cachedById = new Map();
for (const product of cached.products) {
  if (!cachedById.has(product.id)) cachedById.set(product.id, product);
}
const usedCategorySlugs = new Set();
const cachedCategoryByName = new Map(cached.categories.map((category) => {
  let slug = category.slug;
  if (usedCategorySlugs.has(slug)) slug = `${slug}-${String(category.id).replace(/^bcat_/, "")}`;
  usedCategorySlugs.add(slug);
  return [category.name, { ...category, slug }];
}));
const slugify = (value) => String(value).toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const toCents = (value) => Number(value) > 0 ? Math.round(Number(value) * 100) : null;
const tags = (value) => String(value ?? "").split(",").map((item) => item.trim()).filter(Boolean);

const categories = new Map();
const products = [];
const usedProductSlugs = new Set();
for (const row of rows) {
  const legacyId = Number(row["Product ID"]);
  if (!Number.isFinite(legacyId)) continue;
  const id = `bprd_${legacyId}`;
  const old = cachedById.get(id);
  const categoryName = String(row.Category ?? "Other").trim() || "Other";
  const oldCategory = cachedCategoryByName.get(categoryName);
  const category = oldCategory ?? { id: `cat_${slugify(categoryName)}`, slug: slugify(categoryName), name: categoryName };
  categories.set(category.id, category);
  const priceCents = toCents(row["Price/Unit"]);
  const compareAtPriceCents = toCents(row["Compare-at Price"]);
  const sku = String(row.SKU ?? old?.attributes?.SKU ?? "").trim();
  let slug = old?.slug || slugify(row.Name) || `product-${legacyId}`;
  if (usedProductSlugs.has(slug)) slug = `${slug}-${slugify(sku) || legacyId}`;
  if (usedProductSlugs.has(slug)) slug = `${slug}-${legacyId}`;
  usedProductSlugs.add(slug);
  products.push({
    id, legacyId, slug, sku,
    name: String(row.Name ?? old?.name ?? "Unnamed product").trim(),
    shortDescription: old?.shortDescription ?? null, description: old?.description ?? null,
    categoryId: category.id, unit: String(row.Unit ?? "").trim() || null,
    priceCents, compareAtPriceCents: compareAtPriceCents && priceCents && compareAtPriceCents > priceCents ? compareAtPriceCents : null,
    stockQuantity: Math.max(0, Math.floor(Number(row["In Stock"] ?? 0))),
    isRfq: priceCents === null, isActive: String(row.Status).toLowerCase() === "active",
    vendor: row.Vendor ? String(row.Vendor) : null, tags: tags(row.Tags),
    attributes: { ...(old?.attributes ?? {}), ...(sku ? { SKU: sku } : {}), ...(row.Unit ? { Unit: String(row.Unit) } : {}) },
    images: old?.images ?? [], variants: old?.variants ?? [],
  });
}

const report = {
  spreadsheetRows: rows.length,
  uniqueProducts: products.length,
  categories: categories.size,
  cachedRows: cached.products.length,
  cachedUniqueIds: cachedById.size,
  duplicateCachedRowsRemoved: cached.products.length - cachedById.size,
  pricedProducts: products.filter((p) => p.priceCents !== null).length,
  quoteOnlyProducts: products.filter((p) => p.isRfq).length,
};
console.log(JSON.stringify(report, null, 2));
if (!apply) {
  console.log("Dry run complete. Add --apply with DATABASE_URL set to import.");
  process.exit(0);
}

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required with --apply");
const sql = neon(process.env.DATABASE_URL);
const migration = await fs.readFile(path.join(root, "db/migrations/0001_unified_commerce.sql"), "utf8");
for (const statement of migration.split(";").map((part) => part.trim()).filter(Boolean)) {
  await sql.query(statement);
}

async function batches(items, size, fn) {
  for (let i = 0; i < items.length; i += size) await fn(items.slice(i, i + size));
}
function placeholders(rows, columns) {
  const values = [];
  const chunks = rows.map((row, rowIndex) => `(${columns.map((column, columnIndex) => {
    values.push(row[column]); return `$${rowIndex * columns.length + columnIndex + 1}`;
  }).join(",")})`);
  return { text: chunks.join(","), values };
}

await batches([...categories.values()], 100, async (items) => {
  const q = placeholders(items, ["id", "slug", "name"]);
  await sql.query(`INSERT INTO categories (id, slug, name) VALUES ${q.text}
    ON CONFLICT (id) DO UPDATE SET slug=excluded.slug, name=excluded.name, updated_at=now()`, q.values);
});

await batches(products, 100, async (items) => {
  const mapped = items.map((p) => ({ ...p, tagsJson: p.tags, attributesJson: JSON.stringify(p.attributes) }));
  const columns = ["id", "legacyId", "slug", "sku", "name", "shortDescription", "description", "categoryId", "unit", "priceCents", "compareAtPriceCents", "stockQuantity", "isRfq", "isActive", "vendor", "tagsJson", "attributesJson"];
  const q = placeholders(mapped, columns);
  await sql.query(`INSERT INTO products (id, legacy_byson_id, slug, sku, name, short_description, description, primary_category_id, unit, price_cents, compare_at_price_cents, stock_quantity, is_rfq, is_active, vendor, tags, attributes)
    VALUES ${q.text} ON CONFLICT (id) DO UPDATE SET legacy_byson_id=excluded.legacy_byson_id, slug=excluded.slug, sku=excluded.sku, name=excluded.name, short_description=excluded.short_description, description=excluded.description, primary_category_id=excluded.primary_category_id, unit=excluded.unit, price_cents=excluded.price_cents, compare_at_price_cents=excluded.compare_at_price_cents, stock_quantity=excluded.stock_quantity, is_rfq=excluded.is_rfq, is_active=excluded.is_active, vendor=excluded.vendor, tags=excluded.tags, attributes=excluded.attributes, updated_at=now()`, q.values);
  const ids = items.map((p) => p.id);
  await sql.query("DELETE FROM product_categories WHERE product_id = ANY($1::text[])", [ids]);
  await sql.query("DELETE FROM product_images WHERE product_id = ANY($1::text[])", [ids]);
  await sql.query("DELETE FROM product_variants WHERE product_id = ANY($1::text[])", [ids]);
  const links = items.map((p) => ({ productId: p.id, categoryId: p.categoryId }));
  const lq = placeholders(links, ["productId", "categoryId"]);
  await sql.query(`INSERT INTO product_categories (product_id, category_id) VALUES ${lq.text} ON CONFLICT DO NOTHING`, lq.values);
  const imageRows = items.flatMap((p) => p.images.map((image, position) => ({ productId: p.id, src: image.src, alt: image.alt || p.name, position })));
  if (imageRows.length) {
    const iq = placeholders(imageRows, ["productId", "src", "alt", "position"]);
    await sql.query(`INSERT INTO product_images (product_id, src, alt, position) VALUES ${iq.text} ON CONFLICT DO NOTHING`, iq.values);
  }
  const variantRows = items.flatMap((p) => p.variants.map((variant) => ({
    id: variant.id, productId: p.id, sku: variant.sku ?? null, name: variant.name ?? null,
    priceCents: variant.price ? Math.round(variant.price.amount * 100) : null,
    compareAtPriceCents: variant.compareAtPrice ? Math.round(variant.compareAtPrice.amount * 100) : null,
    stockQuantity: variant.inStock ? Math.max(1, p.stockQuantity) : 0,
  })));
  if (variantRows.length) {
    const vq = placeholders(variantRows, ["id", "productId", "sku", "name", "priceCents", "compareAtPriceCents", "stockQuantity"]);
    await sql.query(`INSERT INTO product_variants (id, product_id, sku, name, price_cents, compare_at_price_cents, stock_quantity) VALUES ${vq.text} ON CONFLICT (id) DO UPDATE SET product_id=excluded.product_id, sku=excluded.sku, name=excluded.name, price_cents=excluded.price_cents, compare_at_price_cents=excluded.compare_at_price_cents, stock_quantity=excluded.stock_quantity, updated_at=now()`, vq.values);
  }
});

await sql`INSERT INTO catalog_imports (source_filename, source_sha256, imported_products, imported_categories, notes)
          VALUES (${path.basename(source)}, ${crypto.createHash("sha256").update(file).digest("hex")}, ${products.length}, ${categories.size}, ${JSON.stringify(report)}::jsonb)`;
console.log(`Imported ${products.length} products into GlycoDepot.`);
