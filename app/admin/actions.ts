"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/admin/auth";
import {
  applyBulkProductAction,
  updateAdminProduct,
  updateAdminVariants,
} from "@/lib/admin/catalog";

function cents(value: FormDataEntryValue | null): number | null {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const amount = Number(text);
  if (!Number.isFinite(amount) || amount < 0) throw new Error("Invalid price");
  return Math.round(amount * 100);
}

export async function saveProduct(formData: FormData) {
  await requireStaff();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) throw new Error("Product ID and name are required");
  const stockQuantity = Math.max(
    0,
    Math.floor(Number(formData.get("stockQuantity") ?? 0)),
  );
  const categoryIds = formData
    .getAll("categoryIds")
    .map(String)
    .filter(Boolean);
  const primaryCategoryId =
    String(formData.get("primaryCategoryId") ?? "") || categoryIds[0] || null;
  if (primaryCategoryId && !categoryIds.includes(primaryCategoryId))
    categoryIds.push(primaryCategoryId);
  await updateAdminProduct({
    id,
    name,
    slug: String(formData.get("slug") ?? name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
    sku: String(formData.get("sku") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    unit: String(formData.get("unit") ?? "").trim(),
    priceCents: cents(formData.get("price")),
    compareAtPriceCents: cents(formData.get("compareAtPrice")),
    stockQuantity: Number.isFinite(stockQuantity) ? stockQuantity : 0,
    isRfq: formData.get("isRfq") === "on",
    isActive: formData.get("isActive") === "on",
    categoryIds,
    primaryCategoryId,
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean),
    badge: String(formData.get("badge") ?? "") || null,
    isFeatured: formData.get("isFeatured") === "on",
    isHot: formData.get("isHot") === "on",
    seoTitle: String(formData.get("seoTitle") ?? "").trim(),
    seoDescription: String(formData.get("seoDescription") ?? "").trim(),
    focusKeyword: String(formData.get("focusKeyword") ?? "").trim(),
    canonicalUrl: String(formData.get("canonicalUrl") ?? "").trim(),
  });
  const variantIds = formData.getAll("variantId").map(String);
  await updateAdminVariants(
    id,
    variantIds.map((variantId, index) => ({
      id: variantId,
      name: String(formData.get(`variantName:${index}`) ?? ""),
      sku: String(formData.get(`variantSku:${index}`) ?? ""),
      priceCents: cents(formData.get(`variantPrice:${index}`)),
      compareAtPriceCents: cents(
        formData.get(`variantCompareAtPrice:${index}`),
      ),
      stockQuantity: Math.max(
        0,
        Math.floor(Number(formData.get(`variantStock:${index}`) ?? 0)),
      ),
      isActive: formData.get(`variantActive:${index}`) === "on",
    })),
  );
  revalidatePath("/products");
  revalidatePath(`/admin/products/${id}`);
  redirect(`/admin/products/${id}?saved=1`);
}

export async function bulkUpdateProducts(formData: FormData) {
  await requireStaff();
  const ids = formData.getAll("productIds").map(String).filter(Boolean);
  const action = String(formData.get("bulkAction") ?? "");
  if (ids.length && action) await applyBulkProductAction(ids, action);
  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products?updated=1");
}
