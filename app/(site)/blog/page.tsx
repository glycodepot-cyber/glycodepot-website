import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { Section, Container } from "@/components/primitives";
import { blogPosts, blogCategories } from "@/lib/content/blog";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Glycoscience Blog — Research Insights & Product Guides",
  description:
    "Stay current with glycobiology research. GlycoDepot's blog covers sugar nucleotides, glycoenzymes, glycan arrays, HMOs, and the tools that power modern glycoscience.",
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: "Glycoscience Blog — GlycoDepot",
    description:
      "Practical guides, research insights, and product education from the GlycoDepot team.",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return (
    <>
      {/* Hero */}
      <div className="bg-[var(--color-brand)] text-white">
        <Container>
          <div className="py-16 sm:py-20 lg:py-24">
            <span className="inline-block rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white">
              Glycoscience Blog
            </span>
            <h1 className="type-display mt-4 max-w-2xl text-balance text-white">
              Research insights, product guides, and glycobiology education
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-white/80">
              Written by the GlycoDepot team for researchers, clinicians, and
              scientists working at the forefront of glycoscience.
            </p>
          </div>
        </Container>
      </div>

      <Section spacing="default">
        <Container>
          {/* Category pills */}
          <div className="mb-10 flex flex-wrap gap-2">
            <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-foreground)]">
              All Posts
            </span>
            {blogCategories.map((cat) => (
              <span
                key={cat}
                className="rounded-full border border-[var(--color-border)] px-3.5 py-1.5 text-xs font-medium text-[var(--color-muted-foreground)]"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Post grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 transition-shadow hover:shadow-[var(--shadow-md)]"
              >
                {/* Category + read time */}
                <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
                  <span className="flex items-center gap-1">
                    <Tag className="size-3" aria-hidden />
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" aria-hidden />
                    {post.readTime} min read
                  </span>
                </div>

                {/* Title */}
                <h2 className="mt-3 text-[17px] font-semibold leading-snug text-[var(--color-foreground)] group-hover:text-[var(--color-brand)]">
                  <Link href={`/blog/${post.slug}`} className="line-clamp-3">
                    {post.title}
                  </Link>
                </h2>

                {/* Excerpt */}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-muted-foreground)] line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                  <time
                    dateTime={post.publishedAt}
                    className="text-xs text-[var(--color-muted)]"
                  >
                    {formatDate(post.publishedAt)}
                  </time>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex items-center gap-1 text-xs font-semibold text-[var(--color-brand)] hover:underline"
                    aria-label={`Read ${post.title}`}
                  >
                    Read more <ArrowRight className="size-3" aria-hidden />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
