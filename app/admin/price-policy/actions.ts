"use server";
import { requireAdmin } from "@/lib/admin/auth";
import { applyRfqPricePolicy } from "@/lib/admin/price-policy";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function applyPricePolicyAction() {
  await requireAdmin();
  await applyRfqPricePolicy();
  revalidatePath("/", "layout");
  redirect("/admin/price-policy");
}
