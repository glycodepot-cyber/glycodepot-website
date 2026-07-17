import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Bare default avoids the "GlycoDepot — ... · GlycoDepot" duplication.
    default: "GlycoDepot — Your Trusted Source for Glycoscience Solutions",
    template: "%s · GlycoDepot",
  },
  description:
    "High-quality glycoscience reagents, glycans, enzymes, and expert services. Building blocks, sugar nucleotides, glycan arrays, custom synthesis — sourced from expert labs to yours.",
  alternates: { canonical: "/" },
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
  return (
    <ClerkProvider afterSignOutUrl="/my-account">
      <html lang="en" className={`${jost.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col font-sans">
          {children}
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
