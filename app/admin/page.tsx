import Link from 'next/link';
import {getAdminSummary} from '@/lib/admin/catalog';
import {requireStaff} from '@/lib/admin/auth';
import {countAdminQuotes} from '@/lib/admin/orders';
export const dynamic='force-dynamic';
export default async function AdminPage(){
 const staff=await requireStaff();const [summary,quotes]=await Promise.all([getAdminSummary(),staff.role==='admin'?countAdminQuotes():Promise.resolve(null)]);
 const cards:Array<{label:string;value:number;href?:string}>=[
 {label:'Products',value:summary.products.count,href:'/admin/products'},
 {label:'Active',value:summary.products.active},{label:'Quote only',value:summary.products.rfq},
 {label:'Featured',value:summary.products.featured},{label:'Hot',value:summary.products.hot},
 {label:'Categories',value:summary.categories,href:'/admin/categories'},
 ...(staff.role==='admin'?[{label:'Orders',value:summary.orders,href:'/admin/orders'},{label:'Quote requests',value:quotes??0,href:'/admin/quotes'}]:[]),
 ];
 return <div><h1 className="text-3xl font-bold">Commerce dashboard</h1><p className="mt-2 text-gray-600">Products, inventory and incoming website sales in one GlycoDepot interface.</p><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(c=>{const content=<><div className="text-sm text-gray-500">{c.label}</div><div className="mt-2 text-3xl font-bold">{c.value}</div>{c.href?<div className="mt-3 text-sm font-medium text-green-800">View {c.label.toLowerCase()} →</div>:null}</>;return c.href?<Link key={c.label} href={c.href} className="rounded-xl border bg-white p-5 hover:border-green-800">{content}</Link>:<div key={c.label} className="rounded-xl border bg-white p-5">{content}</div>;})}</div><div className="mt-8 flex flex-wrap gap-3"><Link href="/admin/products" className="rounded-full bg-green-800 px-5 py-3 font-semibold text-white">Manage products</Link>{staff.role==='admin'?<><Link href="/admin/orders" className="rounded-full border border-green-800 bg-white px-5 py-3 font-semibold text-green-800">View orders</Link><Link href="/admin/quotes" className="rounded-full border border-green-800 bg-white px-5 py-3 font-semibold text-green-800">View quote requests</Link></>:null}</div></div>;
}
