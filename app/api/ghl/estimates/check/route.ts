import {syncAuthorized} from "@/lib/crm/auth";
import {GhlEstimateClient} from "@/lib/crm/estimate-client";
import {getDb} from "@/lib/db";

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
    return Response.json({...access,enabled:process.env.GHL_ESTIMATES_ENABLED==="true",from:process.env.GHL_ESTIMATES_FROM_AT??null,recentQuotes,estimates},{headers:{"Cache-Control":"no-store"}});
  } catch(error) {
    const message=error instanceof Error&&/^GHL HTTP \d{3}$/.test(error.message)?error.message:"Estimate access is unavailable";
    return Response.json({error:message},{status:503});
  }
}
