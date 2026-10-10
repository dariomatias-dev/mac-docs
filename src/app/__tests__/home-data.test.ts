import { describe, expect, it } from "vitest";

import type { Doc } from "@/features/content";

import { getInteractiveTools, getMaterialStats } from "../home-data";

describe("getMaterialStats", () => {
  it("counts the real course material", () => {
    const stats = getMaterialStats();
    expect(stats.modules).toBe(5);
    expect(stats.topics).toBeGreaterThan(0);
    expect(stats.exercises).toBeGreaterThan(0);
    expect(stats.assessments).toBeGreaterThan(0);
    expect(stats.questions).toBeGreaterThan(0);
  });
});

describe("getInteractiveTools", () => {
  it("links each tool to the page that embeds it", () => {
    const docs = [
      { url: "/docs/a", content: "<SetCalculator />", frontmatter: { title: "Página A" } },
      {
        url: "/docs/b",
        content: "<BooleanMatrixCalculator />",
        frontmatter: { title: "Página B" },
      },
    ] as unknown as Doc[];

    const tools = getInteractiveTools(docs);
    expect(tools.map((tool) => [tool.tag, tool.href])).toEqual([
      ["SetCalculator", "/docs/a"],
      ["BooleanMatrixCalculator", "/docs/b"],
    ]);
  });
});
