import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { fileToDoc, getAllDocs, getAllSlugs, getDocBySlug, walk } from "../mdx";

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

describe("walk", () => {
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "mdx-walk-"));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("only collects .mdx files, skipping other files but recursing into subdirectories", () => {
    fs.writeFileSync(path.join(dir, "page.mdx"), "");
    fs.writeFileSync(path.join(dir, "README.md"), "");
    fs.writeFileSync(path.join(dir, ".DS_Store"), "");
    fs.mkdirSync(path.join(dir, "group"));
    fs.writeFileSync(path.join(dir, "group", "index.mdx"), "");

    const found = walk(dir).map((p) => path.relative(dir, p)).sort();

    expect(found).toEqual([path.join("group", "index.mdx"), "page.mdx"]);
  });
});

describe("fileToDoc", () => {
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "mdx-file-to-doc-"));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("throws a helpful error naming the file when frontmatter is invalid", () => {
    const filePath = path.join(dir, "broken.mdx");
    fs.writeFileSync(filePath, "---\norder: not-a-number\n---\nBody.");

    expect(() => fileToDoc(filePath)).toThrow(/broken\.mdx/);
  });
});
