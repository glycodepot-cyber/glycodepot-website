-- Bulk Supply: a new top-level category with five subcategories, and the first
-- two kilogram-scale products (N-Acetyl-D-Glucosamine and L-Fucose), each sold
-- by quote in 1 kg, 10 kg and 25 kg packs.
--
-- Bulk categories use their slug as their id so cart and quote links can build
-- the product URL without a lookup. Product ids use the "bulk_" prefix: ids
-- starting "gd_" are re-read by the admin overlay without their variants.
--
-- Idempotent: safe to run more than once. Long-form page content for these
-- products lives in lib/content/bulk-products.ts.

BEGIN;

INSERT INTO categories (id, slug, name, description, parent_id) VALUES
  ('bulk-supply', 'bulk-supply', 'Bulk Supply',
   'Kilogram-scale ingredients for API, cosmetic, nutraceutical, animal-nutrition and surfactant manufacturers, quoted in 1 kg, 10 kg and 25 kg packs.', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, slug, name, description, parent_id) VALUES
  ('bulk-apis', 'bulk-apis', 'APIs',
   'Active pharmaceutical ingredients and pharmaceutical intermediates in bulk pack sizes.', 'bulk-supply'),
  ('bulk-cosmetics', 'bulk-cosmetics', 'Cosmetics',
   'Cosmetic-grade actives and functional ingredients in bulk pack sizes.', 'bulk-supply'),
  ('bulk-nutraceuticals', 'bulk-nutraceuticals', 'Nutraceuticals',
   'Ingredients for dietary supplements and functional foods in bulk pack sizes.', 'bulk-supply'),
  ('bulk-animal-nutrition', 'bulk-animal-nutrition', 'Animal Nutrition',
   'Feed additives and pet-nutrition ingredients in bulk pack sizes.', 'bulk-supply'),
  ('bulk-surfactants', 'bulk-surfactants', 'Surfactants',
   'Sugar-based and specialty surfactants in bulk pack sizes.', 'bulk-supply')
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, slug, sku, name, short_description, description,
                      primary_category_id, unit, price_cents, currency,
                      stock_quantity, is_rfq, is_active, vendor, tags, attributes,
                      seo_title, seo_description, focus_keyword, canonical_url)
VALUES
  ('bulk_nag', 'n-acetyl-d-glucosamine-nag-bulk', 'GD-BULK-NAG',
   'N-Acetyl-D-Glucosamine (NAG) Bulk Powder, CAS 7512-17-6',
   'Cosmetic-grade N-acetyl-D-glucosamine (GlcNAc), ≥98% by HPLC. 1 kg, 10 kg and 25 kg packs, quoted with lot CoA.',
   'Fermentation-derived N-acetyl-D-glucosamine (NAG, GlcNAc), CAS 7512-17-6, assay ≥98% by HPLC, for cosmetic, nutraceutical and feed formulators. Supplied in 1 kg, 10 kg and 25 kg packs with a certificate of analysis for every lot.',
   'bulk-cosmetics', 'kg', NULL, 'USD', 0, true, true, 'GlycoDepot',
   ARRAY['bulk', 'cosmetic grade', 'NAG', 'GlcNAc'],
   '{"CAS number": "7512-17-6", "Molecular formula": "C8H15NO6", "Molecular weight": "221.21 g/mol", "Assay": "≥98% (HPLC)", "Grade": "Cosmetic grade", "Pack sizes": "1 kg, 10 kg, 25 kg"}'::jsonb,
   'N-Acetyl-D-Glucosamine (NAG) Bulk Powder, CAS 7512-17-6 | 1–25 kg',
   'Bulk N-Acetyl-D-Glucosamine (NAG, GlcNAc), CAS 7512-17-6, ≥98% by HPLC. Cosmetic-grade powder in 1 kg, 10 kg and 25 kg packs with lot CoA. Request a bulk quote.',
   'N-acetyl-D-glucosamine bulk', '/products/bulk-cosmetics/n-acetyl-d-glucosamine-nag-bulk'),
  ('bulk_l_fucose', 'l-fucose-bulk', 'GD-BULK-FUC',
   'L-Fucose Bulk Powder, CAS 2438-80-4',
   'Fermentation-derived L-Fucose (6-deoxy-L-galactose), ≥99% by HPLC. 1 kg, 10 kg and 25 kg packs, quoted with lot CoA.',
   'Fermentation-derived L-Fucose (6-deoxy-L-galactose), CAS 2438-80-4, assay ≥99% by HPLC, for cosmetic, nutraceutical and pharmaceutical manufacturers. Supplied in 1 kg, 10 kg and 25 kg packs with a certificate of analysis for every lot.',
   'bulk-nutraceuticals', 'kg', NULL, 'USD', 0, true, true, 'GlycoDepot',
   ARRAY['bulk', 'L-fucose', 'fucose'],
   '{"CAS number": "2438-80-4", "Molecular formula": "C6H12O5", "Molecular weight": "164.16 g/mol", "Assay": "≥99% (HPLC)", "Pack sizes": "1 kg, 10 kg, 25 kg"}'::jsonb,
   'L-Fucose Bulk Powder, CAS 2438-80-4 | 1 kg, 10 kg, 25 kg',
   'Bulk L-Fucose (6-deoxy-L-galactose), CAS 2438-80-4, ≥99% by HPLC, fermentation-derived. 1 kg, 10 kg and 25 kg packs with lot CoA for cosmetic, nutraceutical and pharma use.',
   'L-fucose bulk', '/products/bulk-nutraceuticals/l-fucose-bulk')
ON CONFLICT (id) DO NOTHING;

-- Each product lists in several categories; canonical_url above points every
-- one of those URLs at the primary-category page so search engines index one.
-- Every bulk product is also listed under the parent "Bulk Supply" category.
INSERT INTO product_categories (product_id, category_id) VALUES
  ('bulk_nag', 'bulk-supply'),
  ('bulk_nag', 'bulk-cosmetics'),
  ('bulk_nag', 'bulk-nutraceuticals'),
  ('bulk_nag', 'bulk-animal-nutrition'),
  ('bulk_l_fucose', 'bulk-supply'),
  ('bulk_l_fucose', 'bulk-cosmetics'),
  ('bulk_l_fucose', 'bulk-nutraceuticals'),
  ('bulk_l_fucose', 'bulk-apis')
ON CONFLICT DO NOTHING;

-- Quote-only packs: a NULL price is what makes the page show "Request a quote".
INSERT INTO product_variants (id, product_id, sku, name, price_cents, stock_quantity, is_active) VALUES
  ('bulk_nag_01kg', 'bulk_nag', 'GD-BULK-NAG-1KG', '1 KG', NULL, 0, true),
  ('bulk_nag_10kg', 'bulk_nag', 'GD-BULK-NAG-10KG', '10 KG', NULL, 0, true),
  ('bulk_nag_25kg', 'bulk_nag', 'GD-BULK-NAG-25KG', '25 KG', NULL, 0, true),
  ('bulk_l_fucose_01kg', 'bulk_l_fucose', 'GD-BULK-FUC-1KG', '1 KG', NULL, 0, true),
  ('bulk_l_fucose_10kg', 'bulk_l_fucose', 'GD-BULK-FUC-10KG', '10 KG', NULL, 0, true),
  ('bulk_l_fucose_25kg', 'bulk_l_fucose', 'GD-BULK-FUC-25KG', '25 KG', NULL, 0, true)
ON CONFLICT (id) DO NOTHING;

COMMIT;
