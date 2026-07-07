import { describe, expect, it } from "vitest";

import { getBreadcrumb, getFlatPageList, getSidebarTree } from "../sidebar-tree";

describe("getSidebarTree", () => {
  it("groups content into courses with titled groups", () => {
    const tree = getSidebarTree();
    const curso = tree.find((c) => c.slug[0] === "matematica-discreta");
    expect(curso?.title).toBe("Matemática Discreta");
    expect(curso?.groups.map((g) => g.title)).toContain("Matrizes");
  });

  it("orders group pages by frontmatter order", () => {
    const tree = getSidebarTree();
    const matrizes = tree
      .find((c) => c.slug[0] === "matematica-discreta")
      ?.groups.find((g) => g.slug.join("/") === "matematica-discreta/matrizes");
    expect(matrizes?.pages.map((p) => p.title)).toEqual([
      "Operações com matrizes",
      "Matrizes booleanas",
    ]);
  });
});

describe("getBreadcrumb", () => {
  it("builds a course/group trail for a page", () => {
    const crumbs = getBreadcrumb(["matematica-discreta", "matrizes", "operacoes"]);
    expect(crumbs.map((c) => c.title)).toEqual(["Matemática Discreta", "Matrizes"]);
  });
});

describe("getFlatPageList", () => {
  it("lists pages in reading order across groups", () => {
    const flat = getFlatPageList().map((p) => p.href);
    const a = flat.indexOf("/docs/matematica-discreta/matrizes/operacoes");
    const b = flat.indexOf("/docs/matematica-discreta/matrizes/matrizes-booleanas");
    expect(a).toBeGreaterThanOrEqual(0);
    expect(b).toBeGreaterThan(a);
  });
});
