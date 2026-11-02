CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  parent_id text REFERENCES categories(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  legacy_byson_id bigint UNIQUE,
  slug text NOT NULL UNIQUE,
  sku text,
  name text NOT NULL,
  short_description text,
  description text,
  primary_category_id text REFERENCES categories(id) ON DELETE SET NULL,
  unit text,
  price_cents integer,
  compare_at_price_cents integer,
  currency text NOT NULL DEFAULT 'USD',
  stock_quantity integer NOT NULL DEFAULT 0,
  is_rfq boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  vendor text,
  tags text[] NOT NULL DEFAULT '{}',
  attributes jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_categories (
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id text NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

CREATE TABLE IF NOT EXISTS product_variants (
  id text PRIMARY KEY,
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku text,
  name text,
  price_cents integer,
  compare_at_price_cents integer,
  stock_quantity integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  attributes jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_images (
  id bigserial PRIMARY KEY,
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  src text NOT NULL,
  alt text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  UNIQUE (product_id, src)
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id text,
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  subtotal_cents integer NOT NULL DEFAULT 0,
  shipping_cents integer NOT NULL DEFAULT 0,
  tax_cents integer NOT NULL DEFAULT 0,
  total_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  stripe_checkout_session_id text UNIQUE,
  stripe_payment_intent_id text,
  shipping_address jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id bigserial PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id text REFERENCES products(id) ON DELETE SET NULL,
  variant_id text REFERENCES product_variants(id) ON DELETE SET NULL,
  sku text,
  name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price_cents integer NOT NULL,
  line_total_cents integer NOT NULL
);

CREATE TABLE IF NOT EXISTS catalog_imports (
  id bigserial PRIMARY KEY,
  source_filename text NOT NULL,
  source_sha256 text NOT NULL,
  imported_products integer NOT NULL DEFAULT 0,
  imported_categories integer NOT NULL DEFAULT 0,
  notes jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_primary_category_idx ON products(primary_category_id);
CREATE INDEX IF NOT EXISTS products_active_idx ON products(is_active);
CREATE INDEX IF NOT EXISTS products_name_search_idx ON products USING gin (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS product_variants_product_idx ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS orders_customer_email_idx ON orders(lower(customer_email));
CREATE INDEX IF NOT EXISTS orders_clerk_user_idx ON orders(clerk_user_id);

