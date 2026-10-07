import "server-only";

import { Resend } from "resend";

type Notification = {
  subject: string;
  text: string;
  replyTo?: string;
};

export async function sendSalesNotification({ subject, text, replyTo }: Notification) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY is not configured; notification skipped.");
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "GlycoDepot Staging <onboarding@resend.dev>",
    to: [process.env.SALES_NOTIFICATION_EMAIL ?? "glycodepot@gmail.com"],
    replyTo,
    subject,
    text,
  });
  if (error) console.error("[email] Notification failed:", error);
}
