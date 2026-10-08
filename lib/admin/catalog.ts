import "server-only";
import { getDb } from "@/lib/db";

export type AdminProductFilters = { search?: string; category?: string; status?: string; page?: number };

export async function getAdminSummary() {
  const sql = getDb();
  const [products, categories, orders] = await Promise.all([
    sql`SELECT count(*)::int AS count, count(*) FILTER (WHERE is_active)::int AS active,
      count(*) FILTER (WHERE is_rfq)::int AS rfq, count(*) FILTER (WHERE is_featured)::int AS featured,
      count(*) FILTER (WHERE is_hot)::int AS hot FROM products`,
    sql`SELECT count(*)::int AS count FROM categories`, sql`SELECT count(*)::int AS count FROM orders`,
  ]);
  return { products: products[0] as { count:number; active:number; rfq:number; featured:number; hot:number }, categories: Number(categories[0].count), orders: Number(orders[0].count) };
}

export async function listAdminProducts(filters: AdminProductFilters = {}) {
  const sql = getDb(); const search = filters.search?.trim() ?? ""; const category = filters.category ?? "";
  const status = filters.status ?? ""; const page = Math.max(1, filters.page ?? 1); const pageSize = 50;
  const q = `%${search}%`; const offset = (page - 1) * pageSize;
  const rows = await sql`SELECT p.id,p.name,p.sku,p.price_cents,p.compare_at_price_cents,p.stock_quantity,
      p.is_rfq,p.is_active,p.is_featured,p.is_hot,p.badge,c.name AS category_name,count(*) OVER()::int AS total_count
    FROM products p LEFT JOIN categories c ON c.id=p.primary_category_id
    WHERE (${search === ""} OR p.name ILIKE ${q} OR p.sku ILIKE ${q})
      AND (${category === ""} OR p.primary_category_id=${category})
      AND (${status === ""} OR (${status === "active"} AND p.is_active) OR (${status === "hidden"} AND NOT p.is_active)
        OR (${status === "featured"} AND p.is_featured) OR (${status === "hot"} AND p.is_hot)
        OR (${status === "sale"} AND p.compare_at_price_cents>p.price_cents) OR (${status === "rfq"} AND p.is_rfq))
    ORDER BY p.updated_at DESC,p.name LIMIT ${pageSize} OFFSET ${offset}`;
  const total=Number(rows[0]?.total_count??0); return {rows,total,page,pageSize,totalPages:Math.max(1,Math.ceil(total/pageSize))};
}

export async function listAdminCategories() { const sql=getDb(); return sql`SELECT c.id,c.slug,c.name,c.description,c.parent_id,count(pc.product_id)::int AS product_count FROM categories c LEFT JOIN product_categories pc ON pc.category_id=c.id GROUP BY c.id ORDER BY c.name`; }
export async function listAdminTags() { const sql=getDb(); return sql`SELECT tag,count(*)::int AS product_count FROM products,unnest(tags) AS tag GROUP BY tag ORDER BY product_count DESC,tag`; }

export async function getAdminProduct(id:string) {
  const sql=getDb(); const [products,categories,selectedCategories,variants]=await Promise.all([
    sql`SELECT id,name,slug,sku,short_description,description,unit,price_cents,compare_at_price_cents,stock_quantity,
      is_rfq,is_active,tags,attributes,primary_category_id,badge,is_featured,is_hot,seo_title,seo_description,
      focus_keyword,canonical_url FROM products WHERE id=${id} LIMIT 1`, listAdminCategories(),
    sql`SELECT category_id FROM product_categories WHERE product_id=${id}`,
    sql`SELECT id,sku,name,price_cents,compare_at_price_cents,stock_quantity,is_active,attributes FROM product_variants WHERE product_id=${id} ORDER BY name,id`,
  ]); return products[0]?{product:products[0],categories,selectedCategories,variants}:null;
}

export type ProductUpdate={id:string;name:string;slug:string;sku:string;shortDescription:string;description:string;unit:string;
  priceCents:number|null;compareAtPriceCents:number|null;stockQuantity:number;isRfq:boolean;isActive:boolean;categoryIds:string[];
  primaryCategoryId:string|null;tags:string[];badge:string|null;isFeatured:boolean;isHot:boolean;seoTitle:string;seoDescription:string;focusKeyword:string;canonicalUrl:string};

export async function updateAdminProduct(input:ProductUpdate){const sql=getDb();await sql`UPDATE products SET name=${input.name},slug=${input.slug},sku=${input.sku||null},short_description=${input.shortDescription||null},description=${input.description||null},unit=${input.unit||null},price_cents=${input.isRfq?null:input.priceCents},compare_at_price_cents=${input.isRfq?null:input.compareAtPriceCents},stock_quantity=${input.stockQuantity},is_rfq=${input.isRfq},is_active=${input.isActive},primary_category_id=${input.primaryCategoryId},tags=${input.tags},badge=${input.badge},is_featured=${input.isFeatured},is_hot=${input.isHot},seo_title=${input.seoTitle||null},seo_description=${input.seoDescription||null},focus_keyword=${input.focusKeyword||null},canonical_url=${input.canonicalUrl||null},updated_at=now() WHERE id=${input.id}`;await sql`DELETE FROM product_categories WHERE product_id=${input.id}`;for(const categoryId of input.categoryIds)await sql`INSERT INTO product_categories(product_id,category_id) VALUES(${input.id},${categoryId}) ON CONFLICT DO NOTHING`;}

export async function updateAdminVariants(productId:string,variants:Array<{id:string;name:string;sku:string;priceCents:number|null;compareAtPriceCents:number|null;stockQuantity:number;isActive:boolean}>,deleteIds:string[]=[]){const sql=getDb();if(deleteIds.length)await sql`DELETE FROM product_variants WHERE product_id=${productId} AND id=ANY(${deleteIds})`;for(const v of variants){if(v.id)await sql`UPDATE product_variants SET name=${v.name||null},sku=${v.sku||null},price_cents=${v.priceCents},compare_at_price_cents=${v.compareAtPriceCents},stock_quantity=${v.stockQuantity},is_active=${v.isActive},updated_at=now() WHERE id=${v.id} AND product_id=${productId}`;else await sql`INSERT INTO product_variants(id,product_id,name,sku,price_cents,compare_at_price_cents,stock_quantity,is_active,attributes) VALUES(${crypto.randomUUID()},${productId},${v.name||null},${v.sku||null},${v.priceCents},${v.compareAtPriceCents},${v.stockQuantity},${v.isActive},'{}'::jsonb)`;}}

export async function applyBulkProductAction(ids:string[],action:string){const sql=getDb();if(action==="activate")await sql`UPDATE products SET is_active=true,updated_at=now() WHERE id=ANY(${ids})`;if(action==="hide")await sql`UPDATE products SET is_active=false,updated_at=now() WHERE id=ANY(${ids})`;if(action==="feature")await sql`UPDATE products SET is_featured=true,updated_at=now() WHERE id=ANY(${ids})`;if(action==="unfeature")await sql`UPDATE products SET is_featured=false,updated_at=now() WHERE id=ANY(${ids})`;if(action==="hot")await sql`UPDATE products SET is_hot=true,badge='hot',updated_at=now() WHERE id=ANY(${ids})`;if(action==="unhot")await sql`UPDATE products SET is_hot=false,badge=CASE WHEN badge='hot' THEN NULL ELSE badge END,updated_at=now() WHERE id=ANY(${ids})`;}
