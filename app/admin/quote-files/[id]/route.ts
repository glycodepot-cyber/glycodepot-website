import { requireAdmin } from "@/lib/admin/auth";
import { ensureSalesSchema } from "@/lib/crm/sales";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return new Response("Not found", { status: 404 });
  await ensureSalesSchema();
  const sql = getDb();
  const rows = await sql`SELECT filename, data_base64 FROM website_quote_files WHERE id = ${id}::uuid`;
  const file = (rows as Array<{filename: string; data_base64: string}>)[0];
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(Buffer.from(file.data_base64, "base64"), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.filename).replace(/['()*]/g, c => `%${c.charCodeAt(0).toString(16)}`)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
