import { describe, expect, it } from "vitest";

import { getDocBySlug } from "../mdx";
import {
  getPagePlainText,
  getReadingMinutes,
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

  it("keeps blocks apart and keeps text right after a component tag", () => {
    const text = toPlainText("Intro.\n\n## Questão 1\n\n<Question>\nSabendo que $x \\in A$\n</Question>");
    expect(text).toBe("Intro.\n\nQuestão 1\n\nSabendo que x ∈ A");
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


describe("plain-text search representations", () => {
  it("preserves image descriptions, inline code, and hard line breaks", () => {
    expect(toPlainText("Use `A` e ![diagrama](./imagem.png)  \nna próxima linha.")).toBe(
      "Use A e diagrama\nna próxima linha.",
    );
  });

  it("keeps table cells separated and code blocks searchable", () => {
    const text = toPlainText("| Nome | Valor |\n| --- | --- |\n| A | 2 |\n\n```js\nconst x = 2;\n```");
    expect(text).toBe("Nome | Valor\n\nA | 2\n\nconst x = 2;");
  });

  it("keeps display math readable without exposing link definitions", () => {
    const text = toPlainText("$$\nx \\in A\n$$\n\n[Referência][ref]\n\n[ref]: https://example.com");
    expect(text).toBe("x ∈ A\n\nReferência");
  });

  it("omits images without descriptions and non-reading MDX expressions", () => {
    expect(toPlainText("![](./imagem.png)\n\n{1 + 2}\n\nTexto útil.")).toBe("Texto útil.");
  });
});
