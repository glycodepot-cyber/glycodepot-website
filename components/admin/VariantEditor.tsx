"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type Variant = { id:string; name:string|null; sku:string|null; price_cents:number|null; compare_at_price_cents:number|null; stock_quantity:number; is_active:boolean };
type Row = Variant & { clientKey:string; isNew?:boolean; deleted?:boolean };
const money=(v:number|null)=>v==null?"":(v/100).toFixed(2);

export function VariantEditor({variants}:{variants:Variant[]}) {
  const [rows,setRows]=useState<Row[]>(()=>variants.map(v=>({...v,clientKey:v.id})));
  const visible=rows.filter(v=>!v.deleted);
  const add=()=>{const clientKey=crypto.randomUUID();setRows(r=>[...r,{id:"",clientKey,name:"",sku:"",price_cents:null,compare_at_price_cents:null,stock_quantity:0,is_active:true,isNew:true}]);};
  const remove=(key:string)=>setRows(r=>r.flatMap(v=>v.clientKey!==key?[v]:v.isNew?[]:[{...v,deleted:true}]));
  return <section className="rounded-xl border bg-white p-6">
    {rows.filter(v=>v.deleted).map(v=><input key={v.clientKey} type="hidden" name="deleteVariantId" value={v.id}/>)}
    <div className="flex items-center justify-between gap-4"><div><h2 className="text-lg font-bold">Variations ({visible.length})</h2><p className="text-sm text-[var(--color-muted)]">Add, edit, disable, or delete purchasing options.</p></div><button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-[var(--color-brand)]"><Plus className="size-4"/>Add option</button></div>
    <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{["On","Variation","SKU","Price","Was","Stock",""].map(h=><th key={h} className="pb-2 pr-2">{h}</th>)}</tr></thead><tbody>{visible.map((v,i)=><tr key={v.clientKey} className="border-t"><td><input type="hidden" name="variantId" value={v.id}/><input type="checkbox" name={`variantActive:${i}`} defaultChecked={v.is_active}/></td><td><input className="w-32 rounded border p-1" name={`variantName:${i}`} required defaultValue={v.name??""}/></td><td><input className="w-36 rounded border p-1" name={`variantSku:${i}`} defaultValue={v.sku??""}/></td><td><input className="w-24 rounded border p-1" name={`variantPrice:${i}`} type="number" min="0" step=".01" defaultValue={money(v.price_cents)}/></td><td><input className="w-24 rounded border p-1" name={`variantCompareAtPrice:${i}`} type="number" min="0" step=".01" defaultValue={money(v.compare_at_price_cents)}/></td><td><input className="w-20 rounded border p-1" name={`variantStock:${i}`} type="number" min="0" defaultValue={v.stock_quantity}/></td><td><button type="button" onClick={()=>remove(v.clientKey)} aria-label={`Delete ${v.name||"variation"}`} className="rounded p-2 text-[var(--color-danger)] hover:bg-red-50"><Trash2 className="size-4"/></button></td></tr>)}</tbody></table></div>
  </section>;
}
