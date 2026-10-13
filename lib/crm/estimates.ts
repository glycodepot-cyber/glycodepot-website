import "server-only";
import {randomUUID} from "node:crypto";
import {getDb} from "@/lib/db";
import type {SalesPayload} from "./client";
import {GhlEstimateClient} from "./estimate-client";

let ready:Promise<unknown>|undefined;
export async function drainDraftEstimates() {
  if(process.env.GHL_ESTIMATES_ENABLED!=="true")return 0;
  const from=process.env.GHL_ESTIMATES_FROM_AT;
  if(!from||!Number.isFinite(Date.parse(from)))throw new Error("Estimate activation time is missing");
  const sql=getDb();
  ready??=sql`CREATE TABLE IF NOT EXISTS website_quote_estimates (
    request_id uuid PRIMARY KEY, estimate_id text UNIQUE, estimate_number text,
    attempts integer NOT NULL DEFAULT 0, next_attempt_at timestamptz NOT NULL DEFAULT now(),
    lease_token uuid,locked_until timestamptz,last_error text,created_at timestamptz NOT NULL DEFAULT now()
  )`.catch((error:unknown)=>{ready=undefined;throw error;});
  await ready;
  await sql`INSERT INTO website_quote_estimates(request_id)
    SELECT id FROM website_sales_requests WHERE created_at>=${from}::timestamptz
      AND payload->>'kind'='quote' AND payload->'quoteDetails' IS NOT NULL
      AND ghl_contact_id IS NOT NULL AND ghl_opportunity_id IS NOT NULL
    ON CONFLICT(request_id)DO NOTHING`;
  const lease=randomUUID();
  const rows=await sql`UPDATE website_quote_estimates SET attempts=attempts+1,
    lease_token=${lease}::uuid,locked_until=now()+interval '5 minutes'
    WHERE request_id IN (SELECT request_id FROM website_quote_estimates
      WHERE estimate_id IS NULL AND next_attempt_at<=now() AND (locked_until IS NULL OR locked_until<now())
      ORDER BY created_at LIMIT 3 FOR UPDATE SKIP LOCKED)
    RETURNING request_id,attempts`;
  const client=new GhlEstimateClient({token:process.env.GHL_API_TOKEN??"",locationId:process.env.GHL_LOCATION_ID??"",version:process.env.GHL_API_VERSION});
  let created=0;
  for(const row of rows as Array<{request_id:string;attempts:number}>) {
    try {
      const requests=await sql`SELECT payload,ghl_contact_id,ghl_opportunity_id FROM website_sales_requests WHERE id=${row.request_id}::uuid`;
      const source=(requests as Array<{payload:SalesPayload;ghl_contact_id:string;ghl_opportunity_id:string}>)[0];
      if(!source)throw new Error("Quote source is missing");
      const estimate=await client.ensureDraft(source.payload,source.ghl_contact_id,source.ghl_opportunity_id);
      await sql`UPDATE website_quote_estimates SET estimate_id=${estimate.id},estimate_number=${estimate.number??null},lease_token=NULL,locked_until=NULL,last_error=NULL WHERE request_id=${row.request_id}::uuid AND lease_token=${lease}::uuid`;
      created++;
    } catch(error) {
      const reason=error instanceof Error&&/^GHL HTTP \d{3}$/.test(error.message)?error.message:"Draft estimate is pending";
      await sql`UPDATE website_quote_estimates SET lease_token=NULL,locked_until=NULL,last_error=${reason},next_attempt_at=now()+${Math.min(3600,60*2**Math.min(row.attempts,6))}*interval '1 second' WHERE request_id=${row.request_id}::uuid AND lease_token=${lease}::uuid`;
    }
  }
  return created;
}
