import { describe, expect, it } from "vitest";

import { SITE_DESCRIPTION, SITE_NAME } from "@/shared/lib/site";

import manifest from "../manifest";

describe("manifest", () => {
  it("describes the PWA using the shared site constants", () => {
    const result = manifest();

    expect(result.name).toBe(SITE_NAME);
    expect(result.short_name).toBe(SITE_NAME);
    expect(result.description).toBe(SITE_DESCRIPTION);
    expect(result.icons).toEqual([{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }]);
  });
});
