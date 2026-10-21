import 'server-only';
import { createHash } from 'node:crypto';
import { getDb } from '@/lib/db';
import products from '@/lib/content/galnac-products.json';
export const GALNAC_RUN = 'galnac-materials-20261021';
export const GALNAC_CATEGORY = { id: 'cat_aso_adc_materials', slug: 'aso-and-adc-materials', name: 'ASO and ADC materials', description: 'GalNAc ligands, phosphoramidites and protected linker intermediates for oligonucleotide conjugation research. Explore L96, NAG25, NAG37 and functional GalNAc building blocks. All products are available by quotation in 1 g, 10 g and 100 g packs. GalNAc conjugation is studied for receptor-mediated delivery to hepatocytes; these materials are synthesis building blocks, with specifications and lead times confirmed during quotation.' };
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
