import { describe, expect, it } from "vitest";

import { SITE_URL } from "@/shared/lib/site";

import robots from "../robots";

describe("robots", () => {
  it("allows crawling everything and points to the sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: `${SITE_URL}/sitemap.xml`,
    });
  });
});
