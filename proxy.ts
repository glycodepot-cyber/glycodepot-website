import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { blogPosts } from "@/lib/content/blog";

const isProtectedRoute = createRouteMatcher(["/my-account/dashboard(.*)", "/admin(.*)"]);

const handleClerk = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect({ unauthenticatedUrl: new URL("/my-account", req.url).toString() });
  }
});

/**
 * Old WordPress blog posts were published at /YYYY/MM/DD/<slug>. Those URLs are
 * still in search indexes and 404 on the new site. Match the date path, then map
 * the trailing slug onto a current post by normalised name, so the old URLs pass
 * their standing on instead of throwing it away. No URLs are invented: a slug
 * that matches nothing still 404s.
 */
const datedPost = /^\/\d{4}\/\d{2}\/\d{2}\/([^/]+)\/?$/;
const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "").replace(/-(?:\d+)?$/, "");

function legacyBlogDestination(pathname: string): string | null {
  const match = datedPost.exec(pathname);
  if (!match) return null;
  const wanted = normalise(match[1]);
  if (!wanted) return null;
  const posts = blogPosts.map((p) => ({ slug: p.slug, key: normalise(p.slug) }));
  const exact = posts.find((p) => p.key === wanted);
  if (exact) return `/blog/${exact.slug}`;
  // A dated slug often carries extra words ("sugar-nucleotides-guide"); accept
  // the single best prefix match, and only when it is unambiguous.
  const partial = posts.filter((p) => p.key.startsWith(wanted) || wanted.startsWith(p.key));
  return partial.length === 1 ? `/blog/${partial[0].slug}` : null;
}

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  const publicRead = req.method === "GET" || req.method === "HEAD";
  const pathname = req.nextUrl.pathname;
  const legacy = /^\/(product|product-category|product-tag|shop)(\/|$)/.test(pathname);
  const privatePath = /^\/(api|admin|my-account|checkout)(\/|$)/.test(pathname);
  if (publicRead && !privatePath) {
    const target = req.nextUrl.clone();
    if (["glycodepot.com", "shukkoor.glycodepot.com"].includes(target.hostname)) {
      target.hostname = "www.glycodepot.com";
      target.protocol = "https:";
      return NextResponse.redirect(target, 301);
    }
    if (!legacy && pathname !== "/" && pathname.endsWith("/")) {
      target.pathname = pathname.replace(/\/+$/, "");
      return NextResponse.redirect(target, 301);
    }
    const blogDestination = legacyBlogDestination(pathname);
    if (blogDestination) {
      target.pathname = blogDestination;
      return NextResponse.redirect(target, 301);
    }
  }

  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    return NextResponse.next();
  }

  return handleClerk(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
