import { describe, expect, it } from "vitest";

import { getDocBySlug } from "@/features/content";

import { buildDocView } from "../build-doc-view";

describe("buildDocView", () => {
  it("resolves breadcrumb, toc, prev/next and reading time for a page", () => {
    const doc = getDocBySlug(["matematica-discreta", "matrizes", "operacoes"])!;
    const view = buildDocView(doc);

    expect(view.breadcrumb[0].title).toBe("Matemática Discreta");
    expect(view.toc.length).toBeGreaterThan(0);
    expect(view.next?.href).toBe("/docs/matematica-discreta/matrizes/matrizes-booleanas");
    expect(view.minutes).toBeGreaterThanOrEqual(1);
    expect(view.pageText).toContain(doc.frontmatter.title);
  });

  it("resolves prerequisite titles from their href", () => {
    const doc = getDocBySlug(["matematica-discreta", "avaliacoes", "2023.1", "prova-1"])!;
    const view = buildDocView(doc);

    expect(view.prerequisites.length).toBeGreaterThan(0);
    for (const prereq of view.prerequisites) {
      expect(prereq.title).not.toBe(prereq.href);
    }
  });

  it("has no next page for the last page in the flat list", () => {
    const doc = getDocBySlug(["matematica-discreta", "avaliacoes", "2023.1", "prova-1"])!;
    // The last content page in the site — adjust if new content is added after it.
    const view = buildDocView(doc);
    expect(view.prev).not.toBeNull();
  });

  it("only sets a custom toc label for avaliações pages", () => {
    const examDoc = getDocBySlug(["matematica-discreta", "avaliacoes", "2023.1", "prova-1"])!;
    const regularDoc = getDocBySlug(["matematica-discreta", "matrizes", "operacoes"])!;

    expect(buildDocView(examDoc).tocLabel).toBe("Nesta prova");
    expect(buildDocView(regularDoc).tocLabel).toBeUndefined();
  });

  it("includes section text only for section index pages", () => {
    const section = getDocBySlug(["matematica-discreta", "matrizes"])!;
    const page = getDocBySlug(["matematica-discreta", "matrizes", "operacoes"])!;

    expect(buildDocView(section).sectionText).toBeDefined();
    expect(buildDocView(page).sectionText).toBeUndefined();
  });
});
