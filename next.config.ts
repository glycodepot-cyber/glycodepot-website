import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  poweredByHeader: false,
  compress: true,
  // Ensure the prebaked catalog ships with every serverless function bundle.
  // Next's file tracer can't see fs.readFile reads — declare explicitly.
  outputFileTracingIncludes: {
    "/**/*": ["./lib/data/catalog.json"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "glycodepot.com" },
      { protocol: "https", hostname: "www.glycodepot.com" },
      // BysonHub product image CDN — images served from their portal
      { protocol: "https", hostname: "*.bysonhub.com" },
      { protocol: "https", hostname: "api.bysonhub.com" },
      // Vercel Blob CDN (currently over quota — kept for future re-enable)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Cloudflare R2 public bucket CDN
      { protocol: "https", hostname: "*.r2.dev" },
      // BysonHub product images are stored in Supabase storage
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Content Security Policy.
          // - `'unsafe-inline'` on script/style is required for Next.js's
          //   inline runtime hydration scripts and Tailwind injected styles.
          // - Image hosts: own origin, the WP image CDN, data: for SVG placeholders.
          // - Connect-src includes the BysonHub API (for POST /orders) and
          //   Vercel Analytics. Add other origins here as integrations land.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // challenges.cloudflare.com = Clerk's Cloudflare Turnstile CAPTCHA.
              // Without it the bot-protection iframe fails → "CAPTCHA failed to load."
              // clerk.glycodepot.com / accounts.glycodepot.com = Clerk's production
              // custom domain (frontend API + account portal) — required once the
              // instance is bound to our own domain instead of *.clerk.accounts.dev.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://*.clerk.accounts.dev https://*.clerk.com https://clerk.glycodepot.com https://accounts.glycodepot.com https://challenges.cloudflare.com",
              // worker-src has no fallback to script-src's `blob:`-less list once
              // set elsewhere, but without an explicit entry browsers fall back to
              // script-src for workers — which lacks `blob:`. Cloudflare Turnstile
              // (Clerk's bot-protection challenge) spawns its worker from a blob:
              // URL, so without this it silently fails and sign-up/sign-in never
              // completes ("failed security validations").
              "worker-src 'self' blob:",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://glycodepot.com https://www.glycodepot.com https://placehold.co https://*.bysonhub.com https://api.bysonhub.com https://*.public.blob.vercel-storage.com https://*.r2.dev https://img.clerk.com https://*.supabase.co",
              "font-src 'self' data:",
              "connect-src 'self' https://api.bysonhub.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://*.clerk.accounts.dev https://*.clerk.com https://clerk.glycodepot.com https://accounts.glycodepot.com https://challenges.cloudflare.com",
              "frame-src https://*.clerk.accounts.dev https://*.clerk.com https://clerk.glycodepot.com https://accounts.glycodepot.com https://challenges.cloudflare.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
