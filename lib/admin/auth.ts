import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

function adminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function requireAdmin(): Promise<{ userId: string; email: string }> {
  const { userId } = await auth();
  if (!userId) redirect("/my-account");
  const user = await currentUser();
  const email = user?.emailAddresses.find((item) => item.id === user.primaryEmailAddressId)?.emailAddress
    ?? user?.emailAddresses[0]?.emailAddress;
  if (!email || !adminEmails().has(email.toLowerCase())) redirect("/");
  return { userId, email };
}

