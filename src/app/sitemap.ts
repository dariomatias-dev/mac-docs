import type { MetadataRoute } from "next";

import { getAllDocs } from "@/features/content";
import { getGitDates, getLatestContentDate } from "@/shared/lib/git-dates";
import { SITE_URL } from "@/shared/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: getLatestContentDate(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/contribuidores`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const docRoutes: MetadataRoute.Sitemap = getAllDocs().map((doc) => ({
    url: `${SITE_URL}${doc.url}`,
    lastModified: getGitDates(doc.filePath)?.modified,
    changeFrequency: "monthly",
    // Section landing pages (course/topic index) rank slightly above leaf pages.
    priority: doc.slug.length <= 2 ? 0.8 : 0.6,
  }));

  return [...staticRoutes, ...docRoutes];
}
