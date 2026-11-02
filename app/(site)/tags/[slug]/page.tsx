import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/primitives";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/home/ProductCard";
import { Pagination } from "@/components/site/catalog/Pagination";
import { listCategories, listProducts } from "@/lib/cart/client";
import { tagSlug } from "@/lib/seo/legacy-map";
import { SITE_URL } from "@/lib/site-url";

interface Props { params: Promise<{slug:string}>; searchParams: Promise<{page?:string}> }

async function labelFor(slug:string) {
  const catalog = await listProducts({tagSlug:slug,pageSize:1});
  return catalog.items[0]?.tags?.find(tag=>tagSlug(tag)===slug);
}

export async function generateMetadata({params}:Props):Promise<Metadata> {
  const {slug}=await params;
  const label=await labelFor(slug);
  return label ? {title:`${label} research products`,description:`Explore GlycoDepot research products tagged ${label}. Review available packs or request a quote.`,alternates:{canonical:`${SITE_URL}/tags/${slug}`}} : {title:"Tag not found",robots:{index:false}};
}

export default async function TagPage({params,searchParams}:Props) {
  const {slug}=await params;
  const {page:pageInput}=await searchParams;
  const page=Math.max(1,Math.floor(Number(pageInput)||1));
  const [result,categories,label]=await Promise.all([listProducts({tagSlug:slug,page,pageSize:12}),listCategories(),labelFor(slug)]);
  if(!label || !result.totalItems || page>result.totalPages) notFound();
  return <>
    <PageHero title={label} description="Research products in this collection. Select a product to review pack sizes, availability, and quotation options." breadcrumbs={[{label:"Products",href:"/products"},{label}]} />
    <Section spacing="default"><Container>
      <p className="mb-6 text-sm text-[var(--color-muted-foreground)]">{result.totalItems} research products</p>
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">{result.items.map(product=><ProductCard key={product.id} product={product} categorySlug={categories.find(c=>c.id===product.primaryCategoryId)?.slug ?? categories.find(c=>product.categories.includes(c.id))?.slug} />)}</div>
      <Pagination page={page} totalPages={result.totalPages} hrefFor={p=>p>1?`/tags/${slug}?page=${p}`:`/tags/${slug}`} />
    </Container></Section>
  </>;
}
