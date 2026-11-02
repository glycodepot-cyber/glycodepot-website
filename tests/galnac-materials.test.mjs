import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { canSelectVariant } from '../lib/cart/variant-availability.ts';
const products=JSON.parse(fs.readFileSync(new URL('../lib/content/galnac-products.json',import.meta.url)));
test('GalNAc catalog contains only requested families with unique identities and all pack sizes',()=>{
 assert.equal(products.length,25);
 assert.equal(new Set(products.map(p=>p.id)).size,25);
 assert.equal(new Set(products.map(p=>p.slug)).size,25);
 for(const p of products){
  assert.match(p.name,/GalNAc|NAG/i);
  assert.deepEqual(p.variants.map(v=>v.name),['1 g','10 g','100 g']);
  assert.equal(new Set(p.variants.map(v=>v.id)).size,3);
  assert.ok(fs.statSync(new URL('../public'+p.image,import.meta.url)).size>10000);
  assert.doesNotMatch(JSON.stringify(p),/https?:\/\/[^"\s]*(cosynbio|glycogene|biosynth)/i);
  const cas=p.attributes['CAS number'];
  if(/^\d/.test(cas)){
   const digits=cas.replaceAll('-','');let sum=0;
   [...digits.slice(0,-1)].reverse().forEach((d,i)=>sum+=Number(d)*(i+1));
   assert.equal(sum%10,Number(digits.at(-1)),p.name+' CAS checksum');
  }
 }
});
test('quote packs remain selectable without inventory while unavailable priced packs cannot be selected',()=>{
 assert.equal(canSelectVariant({price:null,inStock:false}),true);
 assert.equal(canSelectVariant({price:{amount:10,currency:'USD'},inStock:false}),false);
 assert.equal(canSelectVariant({price:{amount:10,currency:'USD'},inStock:true}),true);
});
