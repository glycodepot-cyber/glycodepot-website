import 'server-only';
import {requireAdmin} from '@/lib/admin/auth';
import {getDb} from '@/lib/db';
import {ensureSalesSchema} from '@/lib/crm/sales';
import type {SalesPayload} from '@/lib/crm/client';
import {isOrderId} from './order-format';
export type AdminOrder = {
 id:string;order_number?:string|null;customer_name:string;customer_email:string;status:string;
 subtotal_cents:number;shipping_cents:number;tax_cents:number;total_cents:number;currency:string;
 created_at:string;updated_at:string;shipping_address:Record<string,unknown>;billing_address?:Record<string,unknown>;
 requires_dry_ice?:boolean;stripe_payment_intent_id?:string|null;stripe_checkout_session_id?:string|null;
 item_count?:number;
};
export type AdminOrderItem={id:number;name:string;sku:string|null;quantity:number;unit_price_cents:number;line_total_cents:number};
export type AdminQuote={id:string;payload:SalesPayload;created_at:string;version:number;delivered_version:number;ghl_opportunity_id:string|null};
const PAGE_SIZE=25;
export async function listAdminOrders(search='',status='',page=1){
 await requireAdmin();const sql=getDb();const q=`%${search.trim().replace(/^#(?=\d)/,'')}%`;const offset=(Math.max(1,page)-1)*PAGE_SIZE;
 const whereSearch=search.trim()==='';
 const [rows,counts]=await Promise.all([
  sql`SELECT o.*, (SELECT count(*)::int FROM order_items i WHERE i.order_id=o.id) AS item_count FROM orders o
   WHERE (${whereSearch} OR o.customer_name ILIKE ${q} OR o.customer_email ILIKE ${q} OR o.id::text ILIKE ${q} OR coalesce(to_jsonb(o)->>'order_number','') ILIKE ${q})
   AND (${status===''} OR o.status=${status}) ORDER BY o.created_at DESC,o.id DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
  sql`SELECT count(*)::int AS total FROM orders o WHERE (${whereSearch} OR o.customer_name ILIKE ${q} OR o.customer_email ILIKE ${q} OR o.id::text ILIKE ${q} OR coalesce(to_jsonb(o)->>'order_number','') ILIKE ${q}) AND (${status===''} OR o.status=${status})`,
 ]);
 return {rows:rows as AdminOrder[],total:Number(counts[0].total),page,pageSize:PAGE_SIZE};
}
export async function getAdminOrder(id:string){
 await requireAdmin();if(!isOrderId(id))return null;
 const sql=getDb();await ensureSalesSchema();
 const [orders,items,sales]=await Promise.all([
  sql`SELECT * FROM orders WHERE id=${id}::uuid`,
  sql`SELECT id,name,sku,quantity,unit_price_cents,line_total_cents FROM order_items WHERE order_id=${id}::uuid ORDER BY id`,
  sql`SELECT version,delivered_version,ghl_opportunity_id FROM website_sales_requests WHERE source_key=${'order:'+id}`,
 ]);
 if(!orders[0])return null;
 return {order:orders[0] as AdminOrder,items:items as AdminOrderItem[],crm:sales[0] as {version:number;delivered_version:number;ghl_opportunity_id:string|null}|undefined};
}
export async function listAdminQuotes(search='',page=1){
 await requireAdmin();await ensureSalesSchema();const sql=getDb();const q=`%${search.trim()}%`;const empty=search.trim()==='';const offset=(Math.max(1,page)-1)*PAGE_SIZE;
 const [rows,counts]=await Promise.all([
  sql`SELECT id,payload,created_at,version,delivered_version,ghl_opportunity_id FROM website_sales_requests
   WHERE payload->>'kind'='quote' AND (${empty} OR payload->>'name' ILIKE ${q} OR payload->>'email' ILIKE ${q} OR payload->>'company' ILIKE ${q} OR id::text ILIKE ${q})
   ORDER BY created_at DESC,id DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
  sql`SELECT count(*)::int AS total FROM website_sales_requests WHERE payload->>'kind'='quote' AND (${empty} OR payload->>'name' ILIKE ${q} OR payload->>'email' ILIKE ${q} OR payload->>'company' ILIKE ${q} OR id::text ILIKE ${q})`,
 ]);
 return {rows:rows as AdminQuote[],total:Number(counts[0].total),page,pageSize:PAGE_SIZE};
}
export async function getAdminQuote(id:string){
 await requireAdmin();if(!isOrderId(id))return null;await ensureSalesSchema();const sql=getDb();
 const [rows,files]=await Promise.all([
  sql`SELECT id,payload,created_at,version,delivered_version,ghl_opportunity_id FROM website_sales_requests WHERE id=${id}::uuid AND payload->>'kind'='quote'`,
  sql`SELECT id,filename,size_bytes FROM website_quote_files WHERE request_id=${id}::uuid ORDER BY position`,
 ]);
 return rows[0]?{quote:rows[0] as AdminQuote,files:files as Array<{id:string;filename:string;size_bytes:number}>}:null;
}
export async function countAdminQuotes(){
 await requireAdmin();await ensureSalesSchema();const sql=getDb();
 const rows=await sql`SELECT count(*)::int AS count FROM website_sales_requests WHERE payload->>'kind'='quote'`;
 return Number(rows[0].count);
}
