import {syncAuthorized} from "@/lib/crm/auth";
import {GhlEstimateClient} from "@/lib/crm/estimate-client";

export async function GET(request:Request) {
  if(!syncAuthorized(request.headers.get("authorization"),process.env.CRON_SECRET))return Response.json({error:"Unauthorized"},{status:401});
  try {
    const client=new GhlEstimateClient({token:process.env.GHL_API_TOKEN??"",locationId:process.env.GHL_LOCATION_ID??"",version:process.env.GHL_API_VERSION});
    return Response.json(await client.checkAccess(),{headers:{"Cache-Control":"no-store"}});
  } catch(error) {
    const message=error instanceof Error&&/^GHL HTTP \d{3}$/.test(error.message)?error.message:"Estimate access is unavailable";
    return Response.json({error:message},{status:503});
  }
}
