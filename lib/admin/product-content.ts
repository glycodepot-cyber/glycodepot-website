import "server-only";
import { getDb } from "@/lib/db";
import { PRODUCT_ENRICHMENTS } from "@/lib/content/product-enrichment";

export const PRODUCT_CONTENT_RUN = "priority-chemistry-20261018";
const ids = PRODUCT_ENRICHMENTS.map(product=>product.id);

export async function getProductContentPreview() {
  const sql = getDb();
  const [products,table] = await Promise.all([
    sql`SELECT id,name,slug,attributes FROM products WHERE id=ANY(${ids}) AND is_active=true ORDER BY name`,
    sql`SELECT to_regclass('public.catalog_content_audits') AS relation`,
  ]);
  const audit = table[0]?.relation ? await sql`SELECT created_at,summary FROM catalog_content_audits WHERE id=${PRODUCT_CONTENT_RUN}` : [];
  return { products, audit:audit[0] ?? null };
}

export async function applyProductContent() {
  const sql = getDb();
  const rows = await sql`SELECT id FROM products WHERE id=ANY(${ids}) AND is_active=true`;
  if(rows.length!==21) throw new Error("All 21 active priority products must exist before this update.");
  await sql`CREATE TABLE IF NOT EXISTS catalog_content_audits (
    id text PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now(),
    original_products jsonb NOT NULL, original_variants jsonb NOT NULL,
    summary jsonb NOT NULL DEFAULT '{}'::jsonb
  )`;
  // Atomic archive + content-only update. Unique run ID rejects repeat application.
  await sql.transaction([
    sql`INSERT INTO catalog_content_audits(id,original_products,original_variants)
      SELECT ${PRODUCT_CONTENT_RUN},
      (SELECT jsonb_agg(to_jsonb(p) ORDER BY id) FROM products p WHERE id=ANY(${ids})),
      coalesce((SELECT jsonb_agg(to_jsonb(v) ORDER BY id) FROM product_variants v WHERE product_id=ANY(${ids})),'[]'::jsonb)`,
    ...PRODUCT_ENRICHMENTS.map(product=>sql`UPDATE products SET
      name=${product.name},short_description=${product.shortDescription},description=${product.description},
      seo_title=${product.seoTitle},seo_description=${product.seoDescription},focus_keyword=${product.name},
      attributes=coalesce((SELECT jsonb_object_agg(key,value) FROM jsonb_each(coalesce(attributes,'{}'::jsonb))
        WHERE lower(key) !~ '(cas|formula|molecular|iupac|inchi|smiles|synonym|supplied form|chemical handle|lot documentation|research use)'), '{}'::jsonb) || ${JSON.stringify(product.attributes)}::jsonb,
      updated_at=now() WHERE id=${product.id}`),
    sql`UPDATE catalog_content_audits SET summary=jsonb_build_object(
      'updatedProducts',(SELECT count(*) FROM products WHERE id=ANY(${ids})),
      'commerceUnchanged',
        (SELECT jsonb_agg(to_jsonb(p)-ARRAY['name','short_description','description','seo_title','seo_description','focus_keyword','attributes','updated_at'] ORDER BY id) FROM products p WHERE id=ANY(${ids}))=
        (SELECT jsonb_agg(p-ARRAY['name','short_description','description','seo_title','seo_description','focus_keyword','attributes','updated_at'] ORDER BY p->>'id') FROM jsonb_array_elements(original_products) p),
      'variantsUnchanged',original_variants=coalesce((SELECT jsonb_agg(to_jsonb(v) ORDER BY id) FROM product_variants v WHERE product_id=ANY(${ids})),'[]'::jsonb)
    ) WHERE id=${PRODUCT_CONTENT_RUN}`,
  ]);
}
