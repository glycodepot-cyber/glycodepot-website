import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
import { blogPosts } from "@/lib/content/blog";
import { listCategories,listProducts } from "@/lib/cart/client";
import { productPath,tagSlug } from "@/lib/seo/legacy-map";

export const revalidate=3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [catalog,categories]=await Promise.all([listProducts({pageSize:10000}),listCategories()]);
  const staticRoutes: MetadataRoute.Sitemap = [
    "/", "/about", "/services", "/services/custom-glycan-synthesis", "/blog",
    "/start-selling", "/contact", "/quote-request", "/order-tracking", "/products",
    "/legal/terms", "/legal/privacy", "/legal/cookies",
  ].map(path=>({url:`${SITE_URL}${path}`,changeFrequency:path==="/"?"daily":"monthly",priority:path==="/"?1:0.7}));
  const categoryRoutes: MetadataRoute.Sitemap=categories.map(c=>({url:`${SITE_URL}/products/${c.slug}`,changeFrequency:"weekly",priority:0.8}));
  const productRoutes: MetadataRoute.Sitemap=catalog.items.flatMap(product=>{
    const path=productPath(product,categories);
    return path?[{url:`${SITE_URL}${path}`,lastModified:product.updatedAt?new Date(product.updatedAt):undefined,changeFrequency:"weekly" as const,priority:0.6}]:[];
  });
  const tags=new Set(catalog.items.flatMap(p=>(p.tags??[]).map(tagSlug)));
  const tagRoutes:MetadataRoute.Sitemap=[...tags].filter(Boolean).map(slug=>({url:`${SITE_URL}/tags/${slug}`,changeFrequency:"weekly",priority:0.5}));
  const blogRoutes:MetadataRoute.Sitemap=blogPosts.map(post=>({url:`${SITE_URL}/blog/${post.slug}`,lastModified:new Date(post.publishedAt),changeFrequency:"monthly",priority:0.7}));
  return [...new Map([...staticRoutes,...categoryRoutes,...productRoutes,...tagRoutes,...blogRoutes].map(row=>[row.url,row])).values()];
}
