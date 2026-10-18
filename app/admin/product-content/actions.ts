"use server";
import { requireAdmin } from "@/lib/admin/auth";
import { applyProductContent } from "@/lib/admin/product-content";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function applyProductContentAction() {
  await requireAdmin();
  await applyProductContent();
  revalidatePath("/", "layout");
  redirect("/admin/product-content");
}
