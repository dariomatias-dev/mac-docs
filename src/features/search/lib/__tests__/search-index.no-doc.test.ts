import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/content", () => ({
  getDocBySlug: () => null,
  getPagePlainText: () => "should never be called",
}));
vi.mock("@/features/navigation", () => ({
  getSidebarTree: () => [
    {
      title: "Curso",
      slug: ["curso"],
      href: "/docs/curso",
      order: 0,
      pages: [],
      groups: [],
    },
  ],
}));

import { getSearchIndex } from "../search-index";

describe("getSearchIndex", () => {
  it("indexes a course with empty text when it has no matching doc", () => {
    const [item] = getSearchIndex();
    expect(item).toMatchObject({ title: "Curso", href: "/docs/curso", text: "" });
  });
});
