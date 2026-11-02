import test from 'node:test';
import assert from 'node:assert/strict';
import { applyPricePolicy, isQuotePriceCents, publicPrice, PROTECTED_SUGAR_NUCLEOTIDE_IDS } from '../lib/cart/price-policy.ts';

test('RFQ marker uses integer cents and restoring a normal price enables purchasing', () => {
  for (const cents of [99,4699,99999,null,-1,NaN]) assert.equal(isQuotePriceCents(cents),true);
  for (const cents of [4700,4701,4798,12000]) assert.equal(isQuotePriceCents(cents),false);
  assert.equal(publicPrice({amount:46.99,currency:'USD'}),null);
  assert.deepEqual(publicPrice({amount:47,currency:'USD'}),{amount:47,currency:'USD'});
});

test('catalog does not expose .99 prices or compare prices, and preserves normal packs', () => {
  const money=amount=>({amount,currency:'USD'});
  const product={id:'p1',price:money(46.99),compareAtPrice:money(60),variants:[
    {id:'v1',price:money(46.99),compareAtPrice:money(60)},
    {id:'v2',price:money(120),compareAtPrice:money(150)},
  ]};
  const result=applyPricePolicy(product);
  assert.equal(result.price.amount,120);
  assert.equal(result.compareAtPrice.amount,150);
  assert.equal(result.variants[0].price,null);
  assert.equal(result.variants[0].compareAtPrice,null);
  assert.equal(result.variants[1].price.amount,120);
  assert.equal(product.price.amount,46.99);
  const quoteOnly=applyPricePolicy({...product,variants:[product.variants[0]]});
  assert.equal(quoteOnly.price,null);
  assert.equal(quoteOnly.compareAtPrice,null);
});

test('the protected stock-list scope is exactly 21 unique products', () => {
  assert.equal(PROTECTED_SUGAR_NUCLEOTIDE_IDS.length,21);
  assert.equal(new Set(PROTECTED_SUGAR_NUCLEOTIDE_IDS).size,21);
  assert.ok(PROTECTED_SUGAR_NUCLEOTIDE_IDS.includes('bprd_12768'));
  assert.ok(!PROTECTED_SUGAR_NUCLEOTIDE_IDS.includes('bprd_12943'));
});
