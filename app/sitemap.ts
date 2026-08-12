import type { MetadataRoute } from "next";
import { guides } from "./content/guides";
import { bodySystems } from "./content/body-systems";
import { SITE_URL } from "./config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const routes = [
    "", "/science", "/science/how-detection-works", "/science/exposome",
    "/solutions", "/solutions/reduce-exposure", "/quick-action-card", "/resources",
    "/homo-plasticus", "/recommendations", "/about-dr-elie-haddad", "/media",
    "/media/press-kit", "/community", "/contact", "/editorial-policy",
    "/medical-disclaimer", "/affiliate-disclosure", "/privacy-policy",
    "/refunds-and-returns", "/terms", "/accessibility",
  ];
  return [
    ...routes.map((path, index) => ({
      url: `${base}${path}`,
      lastModified: new Date("2026-08-08"),
      changeFrequency: (index === 0 ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: index === 0 ? 1 : .7,
    })),
    ...bodySystems.map((item) => ({
      url: `${base}/science/body/${item.slug}`,
      lastModified: new Date(item.updatedDate),
      changeFrequency: "monthly" as const,
      priority: .82,
    })),
    ...guides.map((guide) => ({
      url: `${base}/resources/${guide.slug}`,
      lastModified: new Date(guide.updatedDate || guide.publishedDate || "2026-08-06"),
      changeFrequency: "monthly" as const,
      priority: .8,
    })),
  ];
}
