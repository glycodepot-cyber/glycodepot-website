import { syncAuthorized } from "@/lib/crm/auth";
import { sendSalesNotification } from "@/lib/email/notifications";
import { Resend } from "resend";

export async function POST(request: Request) {
  if (!syncAuthorized(request.headers.get("authorization"), process.env.CRON_SECRET)) {
    return Response.json({error:"Unauthorized"}, {status:401});
  }
  try {
    const id = await sendSalesNotification({
      subject:"GlycoDepot — notification delivery test",
      text:"This is a notification delivery test. New quote requests, new orders, and verified payment events are configured to notify this inbox. No real order or payment is associated with this test.",
      idempotencyKey:`notification-test/${new Date().toISOString().slice(0,13)}`,
    });
    return Response.json({id, recipient:process.env.SALES_NOTIFICATION_EMAIL ?? "info@glycodepot.com"});
  } catch {
    return Response.json({error:"Email delivery test failed"}, {status:503});
  }
}

export async function GET(request: Request) {
  if (!syncAuthorized(request.headers.get("authorization"), process.env.CRON_SECRET)) {
    return Response.json({error:"Unauthorized"}, {status:401});
  }
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !/^[a-f0-9-]{36}$/.test(id)) return Response.json({error:"Invalid email ID"},{status:400});
  const { data, error } = await new Resend(process.env.RESEND_API_KEY).emails.get(id);
  if (error || !data) return Response.json({error:"Email status unavailable"},{status:503});
  return Response.json({id:data.id,status:data.last_event}, {headers:{"Cache-Control":"no-store"}});
}
