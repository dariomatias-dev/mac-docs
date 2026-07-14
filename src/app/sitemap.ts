import type { MetadataRoute } from "next";

import { getAllSlugs } from "@/features/content";
import { SITE_URL } from "@/shared/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
  ];

  const docRoutes: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${SITE_URL}/docs/${slug.join("/")}`,
    lastModified: now,
    changeFrequency: "monthly",
    // Section landing pages (course/topic index) rank slightly above leaf pages.
    priority: slug.length <= 2 ? 0.8 : 0.6,
  }));

  return [...staticRoutes, ...docRoutes];
}
