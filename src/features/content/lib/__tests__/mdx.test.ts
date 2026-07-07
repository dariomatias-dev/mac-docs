import { describe, expect, it } from "vitest";

import { getAllDocs, getAllSlugs, getDocBySlug } from "../mdx";

describe("mdx content reader", () => {
  it("reads every mdx file with a valid frontmatter", () => {
    const docs = getAllDocs();
    expect(docs.length).toBeGreaterThan(0);
    for (const doc of docs) {
      expect(doc.frontmatter.title).toBeTruthy();
      expect(doc.url.startsWith("/docs/")).toBe(true);
    }
  });

  it("maps a group index.mdx to its section url and marks it", () => {
    const doc = getDocBySlug(["matematica-discreta", "matrizes"]);
    expect(doc?.isSection).toBe(true);
    expect(doc?.url).toBe("/docs/matematica-discreta/matrizes");
  });

  it("finds a page by slug and returns null for a missing one", () => {
    expect(
      getDocBySlug(["matematica-discreta", "matrizes", "operacoes"])?.frontmatter.title,
    ).toBe("Operações com matrizes");
    expect(getDocBySlug(["nao", "existe"])).toBeNull();
  });

  it("lists slugs for every doc", () => {
    expect(getAllSlugs().length).toBe(getAllDocs().length);
  });
});
