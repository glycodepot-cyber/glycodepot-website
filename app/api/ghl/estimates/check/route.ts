import {syncAuthorized} from "@/lib/crm/auth";
import {GhlEstimateClient} from "@/lib/crm/estimate-client";
import {getDb} from "@/lib/db";
import {drainDraftEstimates} from "@/lib/crm/estimates";

export async function GET(request:Request) {
  if(!syncAuthorized(request.headers.get("authorization"),process.env.CRON_SECRET))return Response.json({error:"Unauthorized"},{status:401});
  try {
    const client=new GhlEstimateClient({token:process.env.GHL_API_TOKEN??"",locationId:process.env.GHL_LOCATION_ID??"",version:process.env.GHL_API_VERSION});
    const access=await client.checkAccess();
    const sql=getDb();
    const recentQuotes=await sql`SELECT id,created_at,
      (payload->'quoteDetails' IS NOT NULL) AS structured,
      (ghl_contact_id IS NOT NULL AND ghl_opportunity_id IS NOT NULL) AS crm_synced
      FROM website_sales_requests WHERE payload->>'kind'='quote'
      ORDER BY created_at DESC LIMIT 10`;
    let estimates:unknown[]=[];
    const table=await sql`SELECT to_regclass('public.website_quote_estimates') AS name`;
    if(table[0]?.name)estimates=await sql`SELECT request_id,estimate_id,estimate_number,attempts,last_error,next_attempt_at FROM website_quote_estimates ORDER BY created_at DESC LIMIT 10`;
    const providerEstimates=await client.websiteEstimateStatuses(recentQuotes.map(row=>String(row.id)));
    return Response.json({...access,enabled:process.env.GHL_ESTIMATES_ENABLED==="true",from:process.env.GHL_ESTIMATES_FROM_AT??null,recentQuotes,estimates,providerEstimates},{headers:{"Cache-Control":"no-store"}});
  } catch(error) {
    const message=error instanceof Error&&/^GHL HTTP \d{3}$/.test(error.message)?error.message:"Estimate access is unavailable";
    return Response.json({error:message},{status:503});
  }
}

export async function POST(request:Request) {
  if(!syncAuthorized(request.headers.get("authorization"),process.env.CRON_SECRET))return Response.json({error:"Unauthorized"},{status:401});
  if(process.env.GHL_ESTIMATES_ENABLED!=="true")return Response.json({error:"Draft estimates are disabled"},{status:409});
  const body=await request.json().catch(()=>null) as {reference?:unknown}|null;
  if(typeof body?.reference!=="string"||!/^[-0-9a-f]{36}$/.test(body.reference))return Response.json({error:"Invalid quote reference"},{status:400});
  try {
    const sql=getDb();
    await sql`UPDATE website_quote_estimates SET next_attempt_at=now()
      WHERE request_id=${body.reference}::uuid AND estimate_id IS NULL
      AND (locked_until IS NULL OR locked_until<now())`;
    return Response.json({estimatesCreated:await drainDraftEstimates()},{headers:{"Cache-Control":"no-store"}});
  } catch {
    return Response.json({error:"Draft retry is unavailable"},{status:503});
  }
}
