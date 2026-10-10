import { describe, expect, it } from "vitest";

import {
  getBreadcrumb,
  getFlatPageList,
  getLessonContext,
  getModuleByHref,
  getSidebarTree,
  titleCaseFallback,
} from "../sidebar-tree";

describe("titleCaseFallback", () => {
  it("capitalizes each hyphen-separated word", () => {
    expect(titleCaseFallback("tecnicas-de-demonstracao")).toBe("Tecnicas De Demonstracao");
  });

  it("leaves a single word capitalized with no hyphens to split on", () => {
    expect(titleCaseFallback("funcoes")).toBe("Funcoes");
  });
});

describe("getSidebarTree", () => {
  it("groups content into courses with titled groups", () => {
    const tree = getSidebarTree();
    const curso = tree.find((c) => c.slug[0] === "matematica-discreta");
    expect(curso?.title).toBe("Matemática Discreta");
    expect(curso?.groups.map((g) => g.title)).toContain("Matrizes");
  });

  it("marks course material groups as resources and subjects as modules", () => {
    const groups = getSidebarTree().find((c) => c.slug[0] === "matematica-discreta")!.groups;
    const kindOf = (title: string) => groups.find((g) => g.title === title)?.kind;
    expect(kindOf("Matrizes")).toBe("module");
    expect(kindOf("Plano de disciplina")).toBe("resource");
    expect(kindOf("Avaliações")).toBe("resource");
  });

  it("orders group pages by frontmatter order", () => {
    const tree = getSidebarTree();
    const matrizes = tree
      .find((c) => c.slug[0] === "matematica-discreta")
      ?.groups.find((g) => g.slug.join("/") === "matematica-discreta/matrizes");
    expect(matrizes?.pages.map((p) => p.title)).toEqual([
      "Operações com matrizes",
      "Determinantes",
      "Matriz inversa",
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

describe("getLessonContext", () => {
  it("places a page within its module", () => {
    const context = getLessonContext("/docs/matematica-discreta/matrizes/determinantes");
    expect(context?.module).toEqual({
      title: "Matrizes",
      href: "/docs/matematica-discreta/matrizes",
      number: 1,
    });
    expect(context?.position).toEqual({
      index: 2,
      total: 4,
      groupTitle: "Matrizes",
      nested: false,
    });
  });

  it("has no position on a module's own index page", () => {
    const context = getLessonContext("/docs/matematica-discreta/matrizes");
    expect(context?.module.title).toBe("Matrizes");
    expect(context?.position).toBeNull();
  });

  it("reports the subgroup for pages nested deeper in a module", () => {
    const context = getLessonContext("/docs/matematica-discreta/avaliacoes/2024.2/provas/prova-1");
    expect(context?.module.title).toBe("Avaliações");
    expect(context?.module.number).toBeNull();
    expect(context?.position).toMatchObject({ index: 1, groupTitle: "Provas", nested: true });
  });

  it("returns null for pages outside any module", () => {
    expect(getLessonContext("/docs/matematica-discreta/contribuicoes")).toBeNull();
  });
});

describe("getModuleByHref", () => {
  it("finds a module by its index page", () => {
    expect(getModuleByHref("/docs/matematica-discreta/matrizes")?.title).toBe("Matrizes");
  });

  it("returns null for a page that isn't a module index", () => {
    expect(getModuleByHref("/docs/matematica-discreta/matrizes/determinantes")).toBeNull();
  });
});
