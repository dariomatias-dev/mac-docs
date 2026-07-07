import { describe, expect, it } from "vitest";

import { getDocBySlug } from "../mdx";
import {
  getPagePlainText,
  getReadingMinutes,
  getSectionPlainText,
  toPlainText,
} from "../plain-text";

describe("toPlainText", () => {
  it("strips markdown syntax", () => {
    const text = toPlainText("# Título\n\nUm **negrito** e um [link](/docs/x).");
    expect(text).not.toContain("#");
    expect(text).not.toContain("**");
    expect(text).toContain("negrito");
    expect(text).toContain("link");
  });
});

describe("getReadingMinutes", () => {
  it("returns at least one minute", () => {
    expect(getReadingMinutes("uma frase curta")).toBeGreaterThanOrEqual(1);
  });

  it("grows with longer content", () => {
    const long = "palavra ".repeat(1000);
    expect(getReadingMinutes(long)).toBeGreaterThan(1);
  });
});

describe("getPagePlainText", () => {
  it("joins the title, description and body of a page", () => {
    const doc = getDocBySlug(["matematica-discreta", "conjuntos", "cardinalidade"])!;
    const text = getPagePlainText(doc);
    expect(text).toContain(doc.frontmatter.title);
    expect(text).toContain("cardinalidade");
  });
});

describe("getSectionPlainText", () => {
  it("concatenates every page in a group", () => {
    const text = getSectionPlainText(["matematica-discreta", "matrizes"]);
    expect(text).toContain("Operações com matrizes");
    expect(text).toContain("Matrizes booleanas");
  });
});
