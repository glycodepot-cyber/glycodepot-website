CREATE SEQUENCE IF NOT EXISTS glycodepot_order_number_seq START WITH 10001;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS order_number bigint,
  ADD COLUMN IF NOT EXISTS billing_address jsonb NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS requires_dry_ice boolean NOT NULL DEFAULT false;

ALTER TABLE orders
  ALTER COLUMN order_number SET DEFAULT nextval('glycodepot_order_number_seq');

UPDATE orders
SET order_number = nextval('glycodepot_order_number_seq')
WHERE order_number IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS orders_order_number_idx ON orders(order_number);
