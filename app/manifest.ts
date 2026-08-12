import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Say No to Plastic",
    short_name: "Say No to Plastic",
    description: "Physician-led science, practical exposure reduction, and the book Homo Plasticus.",
    start_url: "/",
    display: "standalone",
    background_color: "#07111d",
    theme_color: "#07111d",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
