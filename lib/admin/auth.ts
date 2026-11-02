import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

function configuredEmails(
  key: "ADMIN_EMAILS" | "PRODUCT_MANAGER_EMAILS",
): Set<string> {
  return new Set(
    (process.env[key] ?? "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
}

export type StaffRole = "admin" | "product_manager";

export async function requireStaff(): Promise<{
  userId: string;
  email: string;
  role: StaffRole;
}> {
  const { userId } = await auth();
  if (!userId) redirect("/my-account");
  const user = await currentUser();
  const email =
    user?.emailAddresses.find((item) => item.id === user.primaryEmailAddressId)
      ?.emailAddress ?? user?.emailAddresses[0]?.emailAddress;
  const normalizedEmail = email?.toLowerCase();
  if (!email || !normalizedEmail) redirect("/");
  if (configuredEmails("ADMIN_EMAILS").has(normalizedEmail)) {
    return { userId, email, role: "admin" };
  }
  if (configuredEmails("PRODUCT_MANAGER_EMAILS").has(normalizedEmail)) {
    return { userId, email, role: "product_manager" };
  }
  redirect("/");
}

export async function requireAdmin(): Promise<{
  userId: string;
  email: string;
}> {
  const staff = await requireStaff();
  if (staff.role !== "admin") redirect("/admin/products");
  return { userId: staff.userId, email: staff.email };
}
