import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher(["/my-account/dashboard(.*)", "/admin(.*)"]);

const handleClerk = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect({ unauthenticatedUrl: new URL("/my-account", req.url).toString() });
  }
});

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
