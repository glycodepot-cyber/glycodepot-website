import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL } from "@/lib/site-url";
import {
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from "@/components/analytics/GoogleTagManager";
import { AttributionCapture } from "@/components/analytics/AttributionCapture";
import { GoogleAds } from "@/components/analytics/GoogleAds";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const nocotelTrafficBootstrap = `(function(){var d=document.documentElement;
var q=null;try{q=new URLSearchParams(location.search).get('click_id')}catch(e){}
q=!!q&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(q);
if(!q)d.style.opacity='0';
var t=setTimeout(function(){d.style.opacity=''},3000);
window.__v_cf=function(){clearTimeout(t);};
window.__v_uh=function(){clearTimeout(t);d.style.opacity='';};
var r='';try{r=document.referrer||''}catch(e){}
var s=document.createElement('script');s.async=true;
s.src='https://click.nocotel.com/glycodepot-site-traffic.js'+location.search+(r?(location.search?'&':'?')+'vt_ref='+encodeURIComponent(r):'');
s.onerror=window.__v_uh;document.head.appendChild(s)})();`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Bare default avoids the "GlycoDepot — ... · GlycoDepot" duplication.
    default: "GlycoDepot — Your Trusted Source for Glycoscience Solutions",
    template: "%s · GlycoDepot",
  },
  description:
    "High-quality glycoscience reagents, glycans, enzymes, and expert services. Building blocks, sugar nucleotides, glycan arrays, custom synthesis — sourced from expert labs to yours.",
  openGraph: {
    title: "GlycoDepot — Your Trusted Source for Glycoscience Solutions",
    description:
      "High-quality glycoscience reagents, glycans, enzymes, and expert services — sourced from expert labs to yours.",
    url: SITE_URL,
    siteName: "GlycoDepot",
    type: "website",
    locale: "en_US",
    // Image auto-discovered from app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: "GlycoDepot",
    description: "Your Trusted Source for Glycoscience Solutions.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkConfigured = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
  );

  const document = (
    <html lang="en" className={`${jost.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://click.nocotel.com" data-vpc="1" />
        <script
          data-vpc="1"
          dangerouslySetInnerHTML={{ __html: nocotelTrafficBootstrap }}
        />
      </head>
      <GoogleAds />
      <GoogleTagManager />
      <body className="min-h-full flex flex-col font-sans">
        <noscript>
          <img
            src="https://click.nocotel.com/glycodepot-site-traffic.gif"
            width="1"
            height="1"
            alt=""
            style={{ display: "none" }}
          />
        </noscript>
        <GoogleTagManagerNoScript />
        <AttributionCapture />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );

  if (!clerkConfigured) return document;

  return (
    <ClerkProvider afterSignOutUrl="/my-account">
      {document}
    </ClerkProvider>
  );
}
