import "server-only";

import { Resend } from "resend";

type Notification = {
  subject: string;
  text: string;
  replyTo?: string;
  idempotencyKey?: string;
};

export async function sendSalesNotification({ subject, text, replyTo, idempotencyKey }: Notification) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Email service is not configured");
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) throw new Error("Email sender is not configured");
  const { data, error } = await resend.emails.send({
    from,
    to: [process.env.SALES_NOTIFICATION_EMAIL ?? "info@glycodepot.com"],
    replyTo,
    subject,
    text,
  }, idempotencyKey ? { idempotencyKey } : undefined);
  if (error || !data?.id) throw new Error("Email provider rejected notification");
  return data.id;
}
