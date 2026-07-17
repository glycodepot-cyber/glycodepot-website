import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { Section, Container, BrandButton } from "@/components/primitives";
import { blogPosts, getBlogPost, type ContentBlock } from "@/lib/content/blog";
import { SITE_URL } from "@/lib/site-url";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      url: `${SITE_URL}/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderBlock(block: ContentBlock, i: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          key={i}
          className="mt-10 text-2xl font-bold tracking-tight text-[var(--color-foreground)] first:mt-0"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          key={i}
          className="mt-7 text-lg font-semibold text-[var(--color-foreground)]"
        >
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p key={i} className="mt-4 leading-relaxed text-[var(--color-muted-foreground)]">
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul key={i} className="mt-4 space-y-2 pl-5">
          {block.items.map((item, j) => (
            <li
              key={j}
              className="list-disc leading-relaxed text-[var(--color-muted-foreground)]"
            >
              {item}
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <div
          key={i}
          className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-brand)]/20 bg-[var(--color-brand-soft)] px-6 py-5"
        >
          <p className="text-sm leading-relaxed text-[var(--color-brand)]">
            {block.text}
          </p>
        </div>
      );
    default:
      return null;
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Organization", name: post.author },
    datePublished: post.publishedAt,
    publisher: {
      "@type": "Organization",
      name: "GlycoDepot",
      url: SITE_URL,
    },
    url: `${SITE_URL}/blog/${post.slug}`,
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header band */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <Container>
          <div className="flex items-center gap-2 py-4 text-sm text-[var(--color-muted-foreground)]">
            <Link href="/" className="hover:text-[var(--color-brand)]">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[var(--color-brand)]">
              Blog
            </Link>
            <span>/</span>
            <span className="line-clamp-1 text-[var(--color-foreground)]">
              {post.title}
            </span>
          </div>
        </Container>
      </div>

      <Section spacing="default">
        <Container>
          <div className="mx-auto max-w-[var(--container-prose)]">
            {/* Back link */}
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-brand)]"
            >
              <ArrowLeft className="size-4" aria-hidden /> All posts
            </Link>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-muted)]">
              <span className="flex items-center gap-1">
                <Tag className="size-3" aria-hidden />
                {post.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" aria-hidden />
                {post.readTime} min read
              </span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </div>

            {/* Title */}
            <h1 className="type-h1 mt-4 text-balance text-[var(--color-foreground)]">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="mt-5 text-lg leading-relaxed text-[var(--color-muted-foreground)]">
              {post.excerpt}
            </p>

            <hr className="my-8 border-[var(--color-border)]" />

            {/* Body */}
            <div className="prose-content text-[15px]">
              {post.body.map((block, i) => renderBlock(block, i))}
            </div>

            {/* Tags */}
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs text-[var(--color-muted-foreground)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <hr className="my-10 border-[var(--color-border)]" />

            {/* CTA */}
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-brand)]/20 bg-[var(--color-brand-soft)] p-6 text-center sm:p-8">
              <p className="text-sm font-semibold text-[var(--color-brand)]">
                Looking for research-grade glycoscience products?
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                Browse the GlycoDepot catalogue for sugar nucleotides,
                glycoenzymes, oligosaccharides, glycan arrays, and more.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <BrandButton href="/products">Browse Products</BrandButton>
                <Link
                  href="/contact"
                  className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
                >
                  Talk to an Expert
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <Section spacing="tight" tone="surface">
          <Container>
            <h2 className="type-h2 mb-8 text-center">More from the Blog</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="group block rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 transition-shadow hover:shadow-[var(--shadow-md)]"
                >
                  <span className="text-xs text-[var(--color-muted)]">
                    {rp.category}
                  </span>
                  <h3 className="mt-2 text-[15px] font-semibold leading-snug text-[var(--color-foreground)] line-clamp-2 group-hover:text-[var(--color-brand)]">
                    {rp.title}
                  </h3>
                  <p className="mt-2 text-xs text-[var(--color-muted-foreground)] line-clamp-2">
                    {rp.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
