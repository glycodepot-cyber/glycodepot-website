import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCT_ENRICHMENTS, productReferences } from '../lib/content/product-enrichment.ts';
import { PROTECTED_SUGAR_NUCLEOTIDE_IDS } from '../lib/cart/price-policy.ts';
import { registerHooks } from 'node:module';
registerHooks({resolve(specifier,context,nextResolve){
  return nextResolve(['../site-url','../cart/price-policy','./product-text','../content/chemistry-reference'].includes(specifier) ? `${specifier}.ts` : specifier,context);
}});
