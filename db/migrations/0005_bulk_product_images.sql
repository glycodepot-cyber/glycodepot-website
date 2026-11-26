-- Product images for the Bulk Supply products added in 0004.
-- The images live in the repo under public/images/products/ and show each
-- compound's structure, drawn with RDKit from reference SMILES and checked
-- against reference stereochemistry. Deploy the images before running this.
-- Idempotent (UNIQUE (product_id, src)).

INSERT INTO product_images (product_id, src, alt, position) VALUES
  ('bulk_nag', '/images/products/bulk-n-acetyl-d-glucosamine.png',
   'N-Acetyl-D-Glucosamine (NAG) chemical structure, CAS 7512-17-6, C8H15NO6', 0),
  ('bulk_l_fucose', '/images/products/bulk-l-fucose.png',
   'L-Fucose chemical structure, CAS 2438-80-4, C6H12O5', 0)
ON CONFLICT (product_id, src) DO NOTHING;
