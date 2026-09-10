import { describe, expect, it } from "vitest";

import { getAllDocs } from "@/features/content";
import { SITE_URL } from "@/shared/lib/site";

import sitemap from "../sitemap";

describe("sitemap", () => {
  it("includes the static routes and one entry per doc", () => {
    const result = sitemap();
    const docs = getAllDocs();

    expect(result[0]).toMatchObject({
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    });
    expect(result[1]).toMatchObject({
      url: `${SITE_URL}/contribuidores`,
      changeFrequency: "monthly",
      priority: 0.5,
    });
    expect(result).toHaveLength(2 + docs.length);
  });

  it("ranks section landing pages above leaf pages", () => {
    const result = sitemap();

    const section = result.find((entry) => entry.url === `${SITE_URL}/docs/matematica-discreta`);
    const leaf = result.find(
      (entry) => entry.url === `${SITE_URL}/docs/matematica-discreta/matrizes/operacoes`,
    );

    expect(section?.priority).toBe(0.8);
    expect(leaf?.priority).toBe(0.6);
  });
});
