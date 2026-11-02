import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLegacyPath,legacyDestinationUrl,buildLegacyRedirectMap } from '../lib/seo/legacy-map.ts';
import { SITE_URL,canonicalSiteUrl } from '../lib/site-url.ts';

const categories=[{id:'other',slug:'other'},{id:'sugar',slug:'sugar-nucleotides'}];
const products=[{id:'p1',name:'PAPS',slug:'paps',primaryCategoryId:'other',categories:['other'],tags:['glycan labelling']},{id:'p2',name:'UDP-Glc.2Na',slug:'udp-glc-2na',primaryCategoryId:'sugar',categories:['sugar']}];

test('all canonical URLs use the selected www origin',()=>{
  assert.equal(SITE_URL,'https://www.glycodepot.com');
  assert.equal(canonicalSiteUrl('https://glycodepot.com/products/other/paps/?utm_source=x','/products/other/paps'),'https://www.glycodepot.com/products/other/paps');
  assert.equal(canonicalSiteUrl('https://unrelated.example/products/paps','/products/other/paps'),'https://www.glycodepot.com/products/other/paps');
  assert.equal(canonicalSiteUrl('/product/paps','/products/other/paps'),'https://www.glycodepot.com/products/other/paps');
});
test('legacy products route to their exact current primary category',()=>{
  assert.equal(resolveLegacyPath('/product/paps/',products,categories),'/products/other/paps');
  assert.equal(resolveLegacyPath('/product/udp-glc-2na/',products,categories),'/products/sugar-nucleotides/udp-glc-2na');
  assert.equal(resolveLegacyPath('/product/unknown/',products,categories),null);
  assert.equal(resolveLegacyPath('/product/paps/',[...products,{...products[0],id:'duplicate'}],categories),null);
  assert.equal(resolveLegacyPath('/product/%E0%A4%A',products,categories),null);
});
test('nested archives, groups, tag archives and pagination retain their meaning',()=>{
  assert.equal(resolveLegacyPath('/product-category/glycochemistry/sugar-nucleotides/page/5/',products,categories),'/products/sugar-nucleotides?page=5');
  assert.equal(resolveLegacyPath('/product-category/glyco-analysis/',products,categories),'/products?group=glycoanalysis');
  assert.equal(resolveLegacyPath('/product-tag/glycan-labelling/',products,categories),'/tags/glycan-labelling');
  assert.equal(resolveLegacyPath('/product-tag/nonexistent/',products,categories),null);
  assert.equal(resolveLegacyPath('/shop/',products,categories),'/products');
  assert.equal(resolveLegacyPath('/shop/page/2/',products,categories),'/products?page=2');
});
test('redirects preserve ad attribution and discard obsolete cart actions',()=>{
  const target=legacyDestinationUrl('/products','https://glycodepot.com/shop/?gclid=abc&utm_source=google&add-to-cart=99&s=PAPS&orderby=price',SITE_URL);
  assert.equal(target.origin,SITE_URL);
  assert.equal(target.searchParams.get('gclid'),'abc');
  assert.equal(target.searchParams.get('utm_source'),'google');
  assert.equal(target.searchParams.get('search'),'PAPS');
  assert.equal(target.searchParams.get('sort'),'price-asc');
  assert.equal(target.searchParams.has('add-to-cart'),false);
});
test('every exported map entry resolves to the same destination without duplicate sources',()=>{
  const map=buildLegacyRedirectMap(products,categories);
  assert.equal(new Set(map.map(row=>row.source)).size,map.length);
  for(const row of map) {
    assert.equal(row.status,301);
    assert.equal(resolveLegacyPath(row.source,products,categories),row.destination);
    assert.ok(row.destination.startsWith('/products')||row.destination.startsWith('/tags/'));
  }
});
