import type { MetadataRoute } from "next";
import prebakedCatalog from "@/lib/data/catalog.json";
import { SITE_URL } from "@/lib/site-url";
import { blogPosts } from "@/lib/content/blog";

interface CatalogProduct {
  slug: string;
  primaryCategoryId?: string;
}
interface CatalogCategory {
  id: string;
  slug: string;
}
interface PrebakedShape {
  generatedAt: string;
  products: CatalogProduct[];
  categories: CatalogCategory[];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const data = prebakedCatalog as PrebakedShape;
  const lastModified = new Date(data.generatedAt ?? Date.now());

  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/about",
    "/services",
    "/blog",
    "/start-selling",
    "/contact",
    "/quote-request",
    "/order-tracking",
    "/products",
    "/legal/terms",
    "/legal/privacy",
    "/legal/cookies",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "daily" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const categoriesById = new Map(data.categories.map((c) => [c.id, c]));

  const categoryRoutes: MetadataRoute.Sitemap = data.categories.map((c) => ({
    url: `${SITE_URL}/products/${c.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = data.products
    .map((p) => {
      const cat = p.primaryCategoryId
        ? categoriesById.get(p.primaryCategoryId)
        : undefined;
      if (!cat) return null;
      return {
        url: `${SITE_URL}/products/${cat.slug}/${p.slug}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
