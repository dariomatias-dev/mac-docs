import type { MetadataRoute } from "next";

import { getAllSlugs } from "@/features/content";
import { SITE_URL } from "@/shared/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ["/"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
  }));

  const docRoutes = getAllSlugs().map((slug) => ({
    url: `${SITE_URL}/docs/${slug.join("/")}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...docRoutes];
}
