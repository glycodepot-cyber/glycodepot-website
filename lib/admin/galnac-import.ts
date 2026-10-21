import 'server-only';
import { createHash } from 'node:crypto';
import { getDb } from '@/lib/db';
import products from '@/lib/content/galnac-products.json';
export const GALNAC_RUN = 'galnac-materials-20261021';
export const GALNAC_CATEGORY = { id: 'cat_aso_adc_materials', slug: 'aso-and-adc-materials', name: 'ASO and ADC materials', description: 'GalNAc ligands, phosphoramidites and protected linker intermediates for oligonucleotide conjugation research. Explore L96, NAG25, NAG37 and functional GalNAc building blocks. Lab to commercial scale supply, with 1 g, 10 g and 100 g packs and larger quantities on request. GalNAc conjugation is studied for receptor-mediated delivery to hepatocytes; these materials are synthesis building blocks, with specifications and delivery timelines tailored to your requirements.' };
export async function getGalnacPreview() {
 const sql=getDb();
 const existing=await sql`SELECT id,name,slug FROM products WHERE id=ANY(${products.map(p=>p.id)}) OR lower(name)=ANY(${products.map(p=>p.name.toLowerCase())})`;
 const audit=await sql`SELECT notes FROM catalog_imports WHERE source_filename=${GALNAC_RUN}`;
 return {existing,applied:audit.length>0};
}
export async function applyGalnacImport() {
 const sql=getDb(); const state=await getGalnacPreview();
 if(state.applied)return;
 if(state.existing.length)throw new Error('Existing matching products require reconciliation before import.');
 if(products.length!==25 || products.some(p=>p.variants.length!==3))throw new Error('Invalid GalNAc manifest');
 await sql.transaction([
 sql`INSERT INTO categories(id,slug,name,description) VALUES(${GALNAC_CATEGORY.id},${GALNAC_CATEGORY.slug},${GALNAC_CATEGORY.name},${GALNAC_CATEGORY.description})`,
 ...products.flatMap(p=>[
 sql`INSERT INTO products(id,slug,sku,name,short_description,description,primary_category_id,unit,price_cents,stock_quantity,is_rfq,is_active,tags,attributes,seo_title,seo_description,focus_keyword)
 VALUES(${p.id},${p.slug},${p.sku},${p.name},${p.shortDescription},${p.description},${GALNAC_CATEGORY.id},'g',NULL,0,true,true,${p.tags},${JSON.stringify(p.attributes)}::jsonb,${p.seoTitle},${p.seoDescription},${p.name})`,
 sql`INSERT INTO product_categories(product_id,category_id) VALUES(${p.id},${GALNAC_CATEGORY.id})`,
 sql`INSERT INTO product_images(product_id,src,alt,position) VALUES(${p.id},${p.image},${p.name+' chemical structure'},0)`,
 ...p.variants.map(v=>sql`INSERT INTO product_variants(id,product_id,sku,name,price_cents,stock_quantity,is_active) VALUES(${v.id},${p.id},${v.sku},${v.name},NULL,0,true)`)
 ]),
 sql`INSERT INTO catalog_imports(source_filename,source_sha256,imported_products,imported_categories,notes) VALUES(${GALNAC_RUN},${createHash("sha256").update(JSON.stringify(products)).digest("hex")},25,1,'{"products":25,"quoteOnly":25,"variants":75,"packSizes":["1 g","10 g","100 g"]}'::jsonb)`
 ]);
}

export const GALNAC_COPY_RUN = 'galnac-scale-copy-20261021';
export async function isGalnacCopyApplied() {
 const sql = getDb();
 const rows = await sql`SELECT id FROM catalog_imports WHERE source_filename=${GALNAC_COPY_RUN}`;
 return rows.length > 0;
}
export async function applyGalnacScaleCopy() {
 const sql = getDb();
 if (await isGalnacCopyApplied()) return;
 const ids = products.map(p => p.id);
 const found = await sql`SELECT id FROM products WHERE id=ANY(${ids})`;
 if (found.length !== 25) throw new Error('All 25 GalNAc products must exist before updating copy.');
 await sql.transaction([
  sql`INSERT INTO catalog_imports(source_filename,source_sha256,imported_products,imported_categories,notes)
   VALUES(${GALNAC_COPY_RUN},${createHash('sha256').update(JSON.stringify(products)).digest('hex')},25,1,
    jsonb_build_object('original_products',(SELECT jsonb_agg(to_jsonb(p)) FROM products p WHERE id=ANY(${ids})),
    'original_category',(SELECT to_jsonb(c) FROM categories c WHERE id=${GALNAC_CATEGORY.id})))`,
  ...products.map(p => sql`UPDATE products SET short_description=${p.shortDescription},description=${p.description},seo_description=${p.seoDescription},
   attributes=coalesce(attributes,'{}'::jsonb) || ${JSON.stringify({'CAS number':p.attributes['CAS number'],'Supply scale':p.attributes['Supply scale'],Availability:p.attributes.Availability})}::jsonb,
   updated_at=now() WHERE id=${p.id}`),
  sql`UPDATE categories SET description=${GALNAC_CATEGORY.description},updated_at=now() WHERE id=${GALNAC_CATEGORY.id}`,
 ]);
}
