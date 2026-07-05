import { describe, expect, it } from "vitest";

import { getBreadcrumb, getFlatPageList, getSidebarTree } from "../sidebar-tree";

describe("getSidebarTree", () => {
  it("groups content into courses with titled groups", () => {
    const tree = getSidebarTree();
    const calculo = tree.find((c) => c.slug[0] === "calculo-1");
    expect(calculo?.title).toBe("Cálculo 1");
    expect(calculo?.groups.map((g) => g.title)).toContain("Limites");
  });

  it("orders group pages by frontmatter order", () => {
    const tree = getSidebarTree();
    const limites = tree
      .find((c) => c.slug[0] === "calculo-1")
      ?.groups.find((g) => g.slug.join("/") === "calculo-1/limites");
    expect(limites?.pages.map((p) => p.title)).toEqual(["Conceito intuitivo", "Definição formal"]);
  });
});

describe("getBreadcrumb", () => {
  it("builds a course/group trail for a page", () => {
    const crumbs = getBreadcrumb(["calculo-1", "limites", "conceito-intuitivo"]);
    expect(crumbs.map((c) => c.title)).toEqual(["Cálculo 1", "Limites"]);
  });
});

describe("getFlatPageList", () => {
  it("lists pages in reading order across groups", () => {
    const flat = getFlatPageList().map((p) => p.href);
    const a = flat.indexOf("/docs/calculo-1/limites/conceito-intuitivo");
    const b = flat.indexOf("/docs/calculo-1/limites/definicao-formal");
    expect(a).toBeGreaterThanOrEqual(0);
    expect(b).toBeGreaterThan(a);
  });
});
