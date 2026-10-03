"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { updateAdminProduct } from "@/lib/admin/catalog";

function cents(value: FormDataEntryValue | null): number | null {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const amount = Number(text);
  if (!Number.isFinite(amount) || amount < 0) throw new Error("Invalid price");
  return Math.round(amount * 100);
}

export async function saveProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) throw new Error("Product ID and name are required");
  const stockQuantity = Math.max(0, Math.floor(Number(formData.get("stockQuantity") ?? 0)));
  await updateAdminProduct({
    id,
    name,
    sku: String(formData.get("sku") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    unit: String(formData.get("unit") ?? "").trim(),
    priceCents: cents(formData.get("price")),
    compareAtPriceCents: cents(formData.get("compareAtPrice")),
    stockQuantity: Number.isFinite(stockQuantity) ? stockQuantity : 0,
    isRfq: formData.get("isRfq") === "on",
    isActive: formData.get("isActive") === "on",
  });
  revalidatePath("/products");
  revalidatePath(`/admin/products/${id}`);
  redirect(`/admin/products/${id}?saved=1`);
}

