import { syncAuthorized } from "@/lib/crm/auth";
import { GhlSalesClient } from "@/lib/crm/client";

export async function GET(request: Request) {
  if (!syncAuthorized(request.headers.get("authorization"), process.env.CRON_SECRET)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const client = new GhlSalesClient({
      token: process.env.GHL_API_TOKEN ?? "",
      locationId: process.env.GHL_LOCATION_ID ?? "",
      pipelineName: process.env.GHL_PIPELINE_NAME ?? "Website Sales",
      version: process.env.GHL_API_VERSION,
    });
    return Response.json(await client.checkConnection(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error && /^GHL (HTTP \d{3}|website sales (pipeline|stage) is missing|configuration is incomplete)$/.test(error.message)
      ? error.message : "Connection check failed";
    return Response.json({ error: message }, { status: 503 });
  }
}
