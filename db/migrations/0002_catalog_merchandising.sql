ALTER TABLE products
  ADD COLUMN IF NOT EXISTS badge text,
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_hot boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS focus_keyword text,
  ADD COLUMN IF NOT EXISTS canonical_url text;

CREATE INDEX IF NOT EXISTS products_featured_idx ON products(is_featured) WHERE is_featured;
CREATE INDEX IF NOT EXISTS products_hot_idx ON products(is_hot) WHERE is_hot;
CREATE INDEX IF NOT EXISTS products_tags_idx ON products USING gin(tags);
