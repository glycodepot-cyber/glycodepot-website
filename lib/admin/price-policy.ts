import "server-only";
import { getDb } from "@/lib/db";
import { PROTECTED_SUGAR_NUCLEOTIDE_IDS } from "@/lib/cart/price-policy";

export const PRICE_POLICY_RUN = "rfq-99-20261017";

export async function getPricePolicyPreview() {
  const sql = getDb();
  const ids = [...PROTECTED_SUGAR_NUCLEOTIDE_IDS];
  const [protectedProducts, summary, auditTable] = await Promise.all([
    sql`SELECT id,name FROM products WHERE id=ANY(${ids}) ORDER BY name`,
    sql`SELECT
      (SELECT count(*)::int FROM products WHERE NOT(id=ANY(${ids}))) AS products,
      (SELECT count(*)::int FROM products WHERE NOT(id=ANY(${ids})) AND price_cents IS NOT NULL) AS priced_products,
      (SELECT count(*)::int FROM product_variants WHERE NOT(product_id=ANY(${ids})) AND price_cents IS NOT NULL) AS priced_variants,
      (SELECT count(*)::int FROM products WHERE NOT(id=ANY(${ids})) AND price_cents < 99) AS small_product_prices,
      (SELECT count(*)::int FROM product_variants WHERE NOT(product_id=ANY(${ids})) AND price_cents < 99) AS small_variant_prices`,
    sql`SELECT to_regclass('public.catalog_price_policy_audits') AS relation`,
  ]);
  const audit = auditTable[0]?.relation
    ? await sql`SELECT created_at,summary FROM catalog_price_policy_audits WHERE id=${PRICE_POLICY_RUN}`
    : [];
  return { protectedProducts, summary: summary[0], audit: audit[0] ?? null };
}

export async function applyRfqPricePolicy() {
  const sql = getDb();
  const ids = [...PROTECTED_SUGAR_NUCLEOTIDE_IDS];
  const protectedRows = await sql`SELECT id FROM products WHERE id=ANY(${ids})`;
  if (protectedRows.length !== 21) throw new Error("The 21 protected products must all exist before applying this policy.");
  await sql`CREATE TABLE IF NOT EXISTS catalog_price_policy_audits (
    id text PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now(),
    original_products jsonb NOT NULL, original_variants jsonb NOT NULL,
    protected_products jsonb NOT NULL, protected_variants jsonb NOT NULL,
    summary jsonb NOT NULL DEFAULT '{}'::jsonb
  )`;
  // One transaction stores the original prices before changing either table.
  // The unique run ID prevents an accidental repeat from lowering prices again.
  await sql.transaction([
    sql`INSERT INTO catalog_price_policy_audits(id,original_products,original_variants,protected_products,protected_variants)
      SELECT ${PRICE_POLICY_RUN},
      coalesce((SELECT jsonb_agg(jsonb_build_object('id',id,'price_cents',price_cents,'compare_at_price_cents',compare_at_price_cents) ORDER BY id) FROM products WHERE NOT(id=ANY(${ids}))),'[]'::jsonb),
      coalesce((SELECT jsonb_agg(jsonb_build_object('id',id,'product_id',product_id,'price_cents',price_cents,'compare_at_price_cents',compare_at_price_cents) ORDER BY id) FROM product_variants WHERE NOT(product_id=ANY(${ids}))),'[]'::jsonb),
      coalesce((SELECT jsonb_agg(jsonb_build_object('id',id,'price_cents',price_cents,'compare_at_price_cents',compare_at_price_cents) ORDER BY id) FROM products WHERE id=ANY(${ids})),'[]'::jsonb),
      coalesce((SELECT jsonb_agg(jsonb_build_object('id',id,'product_id',product_id,'price_cents',price_cents,'compare_at_price_cents',compare_at_price_cents) ORDER BY id) FROM product_variants WHERE product_id=ANY(${ids})),'[]'::jsonb)`,
    sql`UPDATE products SET
      price_cents=CASE WHEN price_cents IS NULL THEN NULL ELSE greatest(99, floor((price_cents-99)::numeric/100)::int*100+99) END,
      compare_at_price_cents=CASE WHEN compare_at_price_cents IS NULL THEN NULL ELSE greatest(99, floor((compare_at_price_cents-99)::numeric/100)::int*100+99) END,
      updated_at=now()
      WHERE NOT(id=ANY(${ids})) AND (price_cents IS NOT NULL OR compare_at_price_cents IS NOT NULL)`,
    sql`UPDATE product_variants SET
      price_cents=CASE WHEN price_cents IS NULL THEN NULL ELSE greatest(99, floor((price_cents-99)::numeric/100)::int*100+99) END,
      compare_at_price_cents=CASE WHEN compare_at_price_cents IS NULL THEN NULL ELSE greatest(99, floor((compare_at_price_cents-99)::numeric/100)::int*100+99) END,
      updated_at=now()
      WHERE NOT(product_id=ANY(${ids})) AND (price_cents IS NOT NULL OR compare_at_price_cents IS NOT NULL)`,
    sql`UPDATE catalog_price_policy_audits SET summary=jsonb_build_object(
      'pricedProducts',(SELECT count(*) FROM products WHERE NOT(id=ANY(${ids})) AND price_cents IS NOT NULL),
      'pricedVariants',(SELECT count(*) FROM product_variants WHERE NOT(product_id=ANY(${ids})) AND price_cents IS NOT NULL),
      'invalidProducts',(SELECT count(*) FROM products WHERE NOT(id=ANY(${ids})) AND price_cents IS NOT NULL AND mod(price_cents,100)<>99),
      'invalidVariants',(SELECT count(*) FROM product_variants WHERE NOT(product_id=ANY(${ids})) AND price_cents IS NOT NULL AND mod(price_cents,100)<>99),
      'protectedProductsUnchanged',protected_products=(SELECT jsonb_agg(j ORDER BY j->>'id') FROM (SELECT jsonb_build_object('id',id,'price_cents',price_cents,'compare_at_price_cents',compare_at_price_cents) AS j FROM products WHERE id=ANY(${ids}) ORDER BY id) s),
      'protectedVariantsUnchanged',protected_variants=(SELECT jsonb_agg(j ORDER BY j->>'id') FROM (SELECT jsonb_build_object('id',id,'product_id',product_id,'price_cents',price_cents,'compare_at_price_cents',compare_at_price_cents) AS j FROM product_variants WHERE product_id=ANY(${ids}) ORDER BY id) s)
    ) WHERE id=${PRICE_POLICY_RUN}`,
  ]);
}
