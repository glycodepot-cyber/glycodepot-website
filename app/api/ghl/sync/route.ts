import { syncAuthorized } from "@/lib/crm/auth";
import { drainWebsiteSales } from "@/lib/crm/sales";

export const maxDuration = 300;

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret?.trim()) return Response.json({ error: "Sync is not configured" }, { status: 503 });
  if (!syncAuthorized(request.headers.get("authorization"), secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    return Response.json(await drainWebsiteSales(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error("[ghl] Sales sync unavailable");
    return Response.json({ error: "Sales sync unavailable" }, { status: 503 });
  }
}

export const GET = POST;
