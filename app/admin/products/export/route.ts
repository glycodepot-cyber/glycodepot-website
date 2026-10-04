import ExcelJS from "exceljs";
import { requireAdmin } from "@/lib/admin/auth";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  await requireAdmin();
  const sql = getDb();
  const products = await sql`SELECT p.id, p.sku, p.name, c.name AS category,
      p.price_cents, p.compare_at_price_cents, p.stock_quantity, p.unit,
      p.is_rfq, p.is_active, p.vendor, p.tags
    FROM products p
    LEFT JOIN categories c ON c.id = p.primary_category_id
    ORDER BY p.name`;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "GlycoDepot";
  const sheet = workbook.addWorksheet("Products", { views: [{ state: "frozen", ySplit: 1 }] });
  sheet.columns = [
    { header: "Product ID", key: "id", width: 18 },
    { header: "SKU", key: "sku", width: 24 },
    { header: "Name", key: "name", width: 48 },
    { header: "Category", key: "category", width: 30 },
    { header: "Price", key: "price", width: 14 },
    { header: "Compare-at Price", key: "compareAtPrice", width: 18 },
    { header: "Stock", key: "stock", width: 12 },
    { header: "Unit", key: "unit", width: 16 },
    { header: "RFQ", key: "rfq", width: 10 },
    { header: "Active", key: "active", width: 10 },
    { header: "Vendor", key: "vendor", width: 24 },
    { header: "Tags", key: "tags", width: 36 },
  ];
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A7A3E" } };
  sheet.autoFilter = { from: "A1", to: "L1" };

  for (const product of products) {
    sheet.addRow({
      id: String(product.id), sku: product.sku ?? "", name: product.name,
      category: product.category ?? "", price: product.price_cents == null ? "" : Number(product.price_cents) / 100,
      compareAtPrice: product.compare_at_price_cents == null ? "" : Number(product.compare_at_price_cents) / 100,
      stock: Number(product.stock_quantity), unit: product.unit ?? "", rfq: Boolean(product.is_rfq),
      active: Boolean(product.is_active), vendor: product.vendor ?? "",
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
    });
  }
  sheet.getColumn("price").numFmt = "$#,##0.00";
  sheet.getColumn("compareAtPrice").numFmt = "$#,##0.00";

  const data = new Uint8Array(await workbook.xlsx.writeBuffer());
  const date = new Date().toISOString().slice(0, 10);
  return new Response(data, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="glycodepot-products-${date}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
