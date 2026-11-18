import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
// product-text.ts imports ../content/chemistry-reference without an extension
// (the Next way); teach the test resolver the same convention.
registerHooks({ resolve(specifier, context, nextResolve) {
  return nextResolve(['../content/chemistry-reference'].includes(specifier) ? `${specifier}.ts` : specifier, context);
}});
const { isValidCas, productCasNumber, productTitle, productDescription, productSpecs } = await import('../lib/seo/product-text.ts');
const { resolveLegacyPath } = await import('../lib/seo/legacy-map.ts');

const base = { id: 'p', categories: ['c'], images: [], price: null };

test('CAS checksum accepts real numbers and rejects typos', () => {
  assert.equal(isValidCas('83-87-4'), true);        // beta-D-glucose pentaacetate
  assert.equal(isValidCas('3063-71-6'), true);      // CMP-Neu5Ac
  assert.equal(isValidCas('83-87-5'), false);
  assert.equal(isValidCas('12345'), false);
});

test('CAS comes only from the product\'s own slug or a labelled CAS in its description', () => {
  assert.equal(productCasNumber({ ...base, slug: 'penta-o-acetyl-d-glucopyranose-cas-83-87-4', name: 'X', variants: [] }), '83-87-4');
  assert.equal(productCasNumber({ ...base, slug: 'x', name: 'X', variants: [], description: 'Sialic acid donor. CAS No.: 3063-71-6.' }), '3063-71-6');
  assert.equal(productCasNumber({ ...base, slug: 'x', name: 'X', variants: [], description: 'Lot 3063-71-6 shipped' }), null);
  assert.equal(productCasNumber({ ...base, slug: 'x-cas-83-87-5', name: 'X', variants: [] }), null);
});

test('products that already carry CAS references are left alone', () => {
  const p = { ...base, slug: 'udp-gal-cas-83-87-4', name: 'UDP-Gal', variants: [], attributes: { 'CAS reference (free acid)': '2956-16-3' } };
  assert.equal(productCasNumber(p), null);
  assert.equal(productTitle(p), 'UDP-Gal');
});

test('title adds the CAS number unless an SEO title is set', () => {
  const p = { ...base, slug: 'glc-penta-cas-83-87-4', name: 'Glucose pentaacetate', variants: [] };
  assert.equal(productTitle(p), 'Glucose pentaacetate (CAS 83-87-4)');
  assert.equal(productTitle({ ...p, seoTitle: 'Custom' }), 'Custom');
  assert.equal(productSpecs({ ...p, sku: 'A1' })['CAS number'], '83-87-4');
});

test('empty products get a factual description built only from catalogue data', () => {
  const p = { ...base, slug: 'anhydro', name: '1-5-Anhydro-D-mannitol', sku: 'A9GD-1114',
    variants: [{ id: 'a', name: '100 MG', price: null, inStock: true }, { id: 'b', name: 'Other', price: null, inStock: true }] };
  assert.equal(productDescription(p), '1-5-Anhydro-D-mannitol, catalog no. A9GD-1114, for laboratory research. Available in 100 MG. Request a quote with lot-specific CoA from GlycoDepot.');
});

test('the indexed retired bulk-glycans tag redirects to its category', () => {
  assert.equal(resolveLegacyPath('/product-tag/bulk-supply-of-glycans/', [], []), '/products/n-glycans-bulk-supply');
});

test('verified chemistry fills the specs, the title and the description', () => {
  // Xylitol, CAS 87-99-0: present in the verified PubChem table.
  const p = { ...base, slug: 'xylitol-cas-87-99-0', name: 'Xylitol', variants: [], attributes: {} };
  const specs = productSpecs(p);
  assert.equal(specs['CAS number'], '87-99-0');
  assert.equal(specs['Molecular formula'], 'C5H12O5');
  assert.equal(specs['Molecular weight'], '152.15 g/mol');
  assert.equal(productTitle(p), 'Xylitol (CAS 87-99-0)');
  assert.match(productDescription(p), /C5H12O5/);
});

test('a CAS with no verified record adds no chemistry anywhere', () => {
  // Valid checksum, but not in the table: the page must stay silent.
  const p = { ...base, slug: 'mystery-cas-50-00-0', name: 'Mystery', variants: [], attributes: {} };
  const specs = productSpecs(p);
  assert.equal(specs['CAS number'], '50-00-0');
  assert.equal(specs['Molecular formula'], undefined);
  assert.equal(specs['Molecular weight'], undefined);
  assert.doesNotMatch(productDescription(p), /MW/);
});
