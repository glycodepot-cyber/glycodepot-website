import "server-only";
import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/db";
import type { SalesPayload } from "@/lib/crm/client";
import { salesMessage } from "./sales-message";
import { sendSalesNotification } from "./notifications";

let ready: Promise<unknown> | undefined;
export async function drainSalesNotifications() {
  const sql = getDb();
  ready ??= sql`CREATE TABLE IF NOT EXISTS website_sales_emails (
    event_key text PRIMARY KEY, message jsonb NOT NULL, provider_id text,
    sent_at timestamptz, attempts integer NOT NULL DEFAULT 0,
    next_attempt_at timestamptz NOT NULL DEFAULT now(),
    lease_token uuid, locked_until timestamptz, last_error text
  )`.catch((error: unknown) => { ready = undefined; throw error; });
  await ready;
  const from = process.env.SALES_EMAIL_FROM_AT;
  if (!from || !Number.isFinite(Date.parse(from))) throw new Error("Email activation time is not configured");
  // Recover missed email captures from durable sales records. Do not mail old
  // requests or duplicate payment notifications on Stripe webhook retries.
  const sources = await sql`SELECT s.id, s.payload FROM website_sales_requests s
    WHERE s.created_at >= ${from}::timestamptz AND (
      NOT EXISTS (SELECT 1 FROM website_sales_emails e WHERE e.event_key = s.id::text || ':new')
      OR (s.payload->>'paid' = 'true' AND NOT EXISTS
        (SELECT 1 FROM website_sales_emails e WHERE e.event_key = s.id::text || ':paid')))
    ORDER BY s.created_at LIMIT 10`;
  for (const row of sources as Array<{id:string;payload:SalesPayload}>) {
    for (const payment of row.payload.paid ? [false, true] : [false]) {
      const message = salesMessage(row.payload, payment);
      await sql`INSERT INTO website_sales_emails(event_key, message)
        VALUES (${`${row.id}:${payment ? "paid" : "new"}`}, ${JSON.stringify(message)}::jsonb)
        ON CONFLICT (event_key) DO NOTHING`;
    }
  }
  const lease = randomUUID();
  const rows = await sql`UPDATE website_sales_emails SET lease_token = ${lease}::uuid,
    locked_until = now() + interval '5 minutes', attempts = attempts + 1
    WHERE event_key IN (SELECT event_key FROM website_sales_emails
      WHERE sent_at IS NULL AND next_attempt_at <= now()
        AND (locked_until IS NULL OR locked_until < now())
      ORDER BY next_attempt_at LIMIT 5 FOR UPDATE SKIP LOCKED)
    RETURNING event_key, message, attempts`;
  let emailAccepted = 0, emailFailed = 0;
  for (const row of rows as Array<{event_key:string;message:ReturnType<typeof salesMessage>;attempts:number}>) {
    try {
      const id = await sendSalesNotification({...row.message, idempotencyKey:`website-sales/${row.event_key}`});
      await sql`UPDATE website_sales_emails SET sent_at = now(), provider_id = ${id},
        locked_until = NULL, lease_token = NULL, last_error = NULL
        WHERE event_key = ${row.event_key} AND lease_token = ${lease}::uuid`;
      emailAccepted++;
    } catch {
      await sql`UPDATE website_sales_emails SET locked_until = NULL, lease_token = NULL,
        last_error = 'Email delivery failed',
        next_attempt_at = now() + ${Math.min(3600, 60 * 2 ** Math.min(row.attempts, 6))} * interval '1 second'
        WHERE event_key = ${row.event_key} AND lease_token = ${lease}::uuid`;
      emailFailed++;
    }
  }
  return {emailAccepted, emailFailed};
}
