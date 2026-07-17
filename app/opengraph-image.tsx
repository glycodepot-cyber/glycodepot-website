import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "GlycoDepot — Glycoscience reagents and services";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #16a34a 0%, #15803d 50%, #0f766e 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            GlycoDepot
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              marginTop: 40,
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            Your trusted source for glycoscience solutions
          </div>
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.9,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>3,500+ reagents · Custom synthesis · Expert services</span>
          <span style={{ fontWeight: 700 }}>glycodepot.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
