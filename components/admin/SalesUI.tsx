import Link from 'next/link';
import {addressLines} from '@/lib/admin/order-format';
export function AddressCard({title,address}:{title:string;address:Record<string,unknown>|null|undefined}){
 const lines=addressLines(address);
 return <section className="rounded-xl border bg-white p-5"><h2 className="mb-3 text-lg font-semibold">{title}</h2>{lines.length?<address className="not-italic text-sm leading-6">{lines.map((line,i)=><div key={i}>{line}</div>)}</address>:<p className="text-sm text-gray-500">Not provided</p>}</section>;
}
export function SalesPagination({base,page,total,pageSize,search,status}:{base:string;page:number;total:number;pageSize:number;search:string;status?:string}){
 const pages=Math.max(1,Math.ceil(total/pageSize));
 const href=(n:number)=>{const p=new URLSearchParams();if(search)p.set('search',search);if(status)p.set('status',status);if(n>1)p.set('page',String(n));return base+(p.size?'?'+p.toString():'');};
 return <nav aria-label="Sales pagination" className="mt-5 flex items-center gap-5 text-sm">{page>1?<Link className="underline" href={href(page-1)}>Previous</Link>:null}<span>Page {page} of {pages}</span>{page<pages?<Link className="underline" href={href(page+1)}>Next</Link>:null}</nav>;
}
