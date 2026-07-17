import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GlycoDepot — Glycoscience reagents and services",
    short_name: "GlycoDepot",
    description:
      "High-quality glycoscience reagents, glycans, enzymes, and expert services. Sourced from expert labs to yours.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#16a34a",
    orientation: "portrait",
    icons: [
      {
        src: "/Glycodepot_Logo.jpeg",
        sizes: "any",
        type: "image/jpeg",
      },
      {
        src: "/favicon.ico",
        sizes: "256x256",
        type: "image/x-icon",
      },
    ],
    categories: ["science", "shopping", "business"],
  };
}
