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
    const doc = getDocBySlug(["calculo-1", "limites"]);
    expect(doc?.isSection).toBe(true);
    expect(doc?.url).toBe("/docs/calculo-1/limites");
  });

  it("finds a page by slug and returns null for a missing one", () => {
    expect(getDocBySlug(["calculo-1", "limites", "definicao-formal"])?.frontmatter.title).toBe(
      "Definição formal",
    );
    expect(getDocBySlug(["nao", "existe"])).toBeNull();
  });

  it("lists slugs for every doc", () => {
    expect(getAllSlugs().length).toBe(getAllDocs().length);
  });
});
