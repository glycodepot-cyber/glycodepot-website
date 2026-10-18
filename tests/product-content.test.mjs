import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCT_ENRICHMENTS } from '../lib/content/product-enrichment.ts';
import { PROTECTED_SUGAR_NUCLEOTIDE_IDS } from '../lib/cart/price-policy.ts';
import { registerHooks } from 'node:module';
registerHooks({resolve(specifier,context,nextResolve){
  return nextResolve(['../site-url','../cart/price-policy'].includes(specifier) ? `${specifier}.ts` : specifier,context);
}});
const { productStructuredData, productDescription, serializeJsonLd, productBreadcrumbs } = await import('../lib/seo/product-data.ts');
const product={id:'test',sku:'GTRC-001',name:'Test',slug:'test',categories:['other'],images:[{src:'/test.png',alt:'Test'}],attributes:{'CAS reference (free acid)':'133-89-1'},price:null,variants:[]};

test('curated content covers exactly the approved priority list without commerce fields',()=>{
  assert.deepEqual(PRODUCT_ENRICHMENTS.map(p=>p.id).sort(),[...PROTECTED_SUGAR_NUCLEOTIDE_IDS].sort());
  for(const p of PRODUCT_ENRICHMENTS){
    assert.ok(p.description.length>250);
    assert.ok(p.references.length);
    for(const r of p.references)assert.equal(new URL(r.url).protocol,'https:');
    for(const k of ['price','stock','variants','slug','isRfq'])assert.equal(k in p,false);
    assert.doesNotMatch(p.description,/approximately|approximate formula|common estimate/i);
  }
  const xyl=PRODUCT_ENRICHMENTS.find(p=>p.id==='bprd_15183');
  assert.equal(xyl.attributes['CAS reference (disodium salt)'],'108320-89-4');
  assert.doesNotMatch(xyl.name,/108320-87-2/);
  assert.doesNotMatch(PRODUCT_ENRICHMENTS.find(p=>p.id==='bprd_15161').name,/4578-31-8|acetylglucose/);
});
test('pack offers reflect each actual price and stock; quote markers are omitted',()=>{
  const data=productStructuredData({...product,variants:[
    {id:'a',name:'10 mg',price:{amount:10,currency:'USD'},inStock:true},
    {id:'b',name:'25 mg',price:{amount:20,currency:'USD'},inStock:false},
    {id:'c',name:'50 mg',price:{amount:46.99,currency:'USD'},inStock:true},
    {id:'d',name:'100 mg',price:null,inStock:true},
  ]},'https://www.glycodepot.com/products/other/test');
  assert.equal(data.sku,'GTRC-001');
  assert.equal(data.offers.length,2);
  assert.deepEqual(data.offers.map(o=>o.price),['10.00','20.00']);
  assert.match(data.offers[1].availability,/OutOfStock$/);
  assert.equal(data.image[0],'https://www.glycodepot.com/test.png');
  assert.equal(data.additionalProperty[0].name,'CAS reference (free acid)');
  assert.equal(productStructuredData(product,'https://www.glycodepot.com/products/other/test').offers,undefined);
});
test('metadata is concise, breadcrumbs use www and JSON-LD cannot break out of a script',()=>{
  assert.ok(productDescription({...product,description:'<p>'+('long description '.repeat(40))+'</p>'}).length<=170);
  assert.doesNotMatch(serializeJsonLd({name:'</script><script>alert(1)</script>'}),/</);
  const crumbs=productBreadcrumbs({name:'Other',slug:'other'},'Test','https://www.glycodepot.com/products/other/test');
  assert.equal(crumbs.itemListElement.length,3);
  assert.equal(crumbs.itemListElement[0].item,'https://www.glycodepot.com/products');
});
