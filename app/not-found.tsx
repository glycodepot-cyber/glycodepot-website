import Link from "next/link";

export const metadata = {
  title: "Page not found",
};

/**
 * Root-level not-found. Catches paths outside the (site) route group too.
 * Kept minimal — no SiteHeader (which depends on the site layout) — so
 * Next can always render this page even for routes that never hit a layout.
 */
export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#f8f8f8",
          color: "#212529",
        }}
      >
        <main
          style={{
            textAlign: "center",
            maxWidth: 560,
            padding: "48px 24px",
          }}
        >
          <p
            style={{
              fontSize: 13,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#16a34a",
              fontWeight: 700,
              margin: 0,
            }}
          >
            404
          </p>
          <h1 style={{ fontSize: 40, margin: "16px 0 12px", lineHeight: 1.2 }}>
            We can&apos;t find that page
          </h1>
          <p style={{ fontSize: 16, color: "#5b6168", margin: "0 0 28px" }}>
            It may have been moved, renamed, or never existed. Try our catalog
            or talk to a specialist.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/products"
              style={{
                display: "inline-block",
                padding: "10px 22px",
                borderRadius: 999,
                backgroundColor: "#16a34a",
                color: "white",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Browse products
            </Link>
            <Link
              href="/contact"
              style={{
                display: "inline-block",
                padding: "10px 22px",
                borderRadius: 999,
                border: "1px solid #d5d8dc",
                color: "#212529",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Talk to a specialist
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
