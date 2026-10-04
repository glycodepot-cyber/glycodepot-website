"use server";

import ExcelJS from "exceljs";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { getDb } from "@/lib/db";

function value(cell: ExcelJS.Cell): unknown {
  const input = cell.value;
  if (input && typeof input === "object" && "result" in input) return input.result;
  if (input && typeof input === "object" && "richText" in input) return input.richText.map((part) => part.text).join("");
  if (input && typeof input === "object" && "text" in input) return input.text;
  return input;
}

function bool(input: unknown): boolean {
  return ["true", "yes", "1", "active"].includes(String(input ?? "").trim().toLowerCase());
}

function cents(input: unknown): number | null {
  if (input === null || input === undefined || input === "") return null;
  const number = Number(String(input).replace(/[$,]/g, ""));
  return Number.isFinite(number) && number >= 0 ? Math.round(number * 100) : null;
}

export async function importProducts(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || !file.name.toLowerCase().endsWith(".xlsx") || file.size > 15_000_000) {
    redirect("/admin/products?error=Choose+a+valid+XLSX+file+under+15MB");
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(Buffer.from(await file.arrayBuffer()) as never);
  const sheet = workbook.worksheets[0];
  if (!sheet) redirect("/admin/products?error=The+workbook+has+no+worksheet");

  const headers = new Map<string, number>();
  sheet.getRow(1).eachCell((cell, column) => headers.set(String(value(cell) ?? "").trim().toLowerCase(), column));
  const idColumn = headers.get("product id");
  if (!idColumn) redirect("/admin/products?error=Product+ID+column+is+required");

  const rows: Array<Record<string, unknown>> = [];
  sheet.eachRow((row, number) => {
    if (number === 1) return;
    const get = (name: string) => {
      const column = headers.get(name.toLowerCase());
      return column ? value(row.getCell(column)) : undefined;
    };
    const id = String(get("Product ID") ?? "").trim();
    if (!id) return;
    rows.push({
      id,
      sku: String(get("SKU") ?? "").trim() || null,
      name: String(get("Name") ?? "").trim(),
      price_cents: cents(get("Price")),
      compare_at_price_cents: cents(get("Compare-at Price")),
      stock_quantity: Math.max(0, Math.floor(Number(get("Stock") ?? 0))),
      unit: String(get("Unit") ?? "").trim() || null,
      is_rfq: bool(get("RFQ")),
      is_active: bool(get("Active")),
      vendor: String(get("Vendor") ?? "").trim() || null,
      tags: String(get("Tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
    });
  });

  const sql = getDb();
  let updated = 0;
  for (let index = 0; index < rows.length; index += 500) {
    const batch = rows.slice(index, index + 500);
    const result = await sql.query(`WITH changes AS (
      SELECT * FROM jsonb_to_recordset($1::jsonb) AS x(
        id text, sku text, name text, price_cents integer, compare_at_price_cents integer,
        stock_quantity integer, unit text, is_rfq boolean, is_active boolean, vendor text, tags text[]
      )
    )
    UPDATE products p SET sku = c.sku, name = CASE WHEN c.name = '' THEN p.name ELSE c.name END,
      price_cents = CASE WHEN c.is_rfq THEN NULL ELSE c.price_cents END,
      compare_at_price_cents = CASE WHEN c.is_rfq THEN NULL ELSE c.compare_at_price_cents END,
      stock_quantity = c.stock_quantity, unit = c.unit, is_rfq = c.is_rfq,
      is_active = c.is_active, vendor = c.vendor, tags = c.tags, updated_at = now()
    FROM changes c WHERE p.id = c.id RETURNING p.id`, [JSON.stringify(batch)]);
    updated += result.length;
  }

  redirect(`/admin/products?imported=${updated}&skipped=${Math.max(0, rows.length - updated)}`);
}
