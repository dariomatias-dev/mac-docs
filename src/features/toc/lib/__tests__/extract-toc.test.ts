import { describe, expect, it } from "vitest";

import { extractToc } from "../extract-toc";

describe("extractToc", () => {
  it("collects h2 and h3 headings with slugged ids", () => {
    const toc = extractToc("## Limites laterais\n\n### Quando não existe\n");
    expect(toc).toEqual([
      { id: "limites-laterais", text: "Limites laterais", depth: 2 },
      { id: "quando-não-existe", text: "Quando não existe", depth: 3 },
    ]);
  });

  it("ignores h1 and deeper than h3", () => {
    const toc = extractToc("# Título\n\n## Seção\n\n#### Muito fundo\n");
    expect(toc.map((t) => t.text)).toEqual(["Seção"]);
  });

  it("includes inline code text in the heading", () => {
    const toc = extractToc("## Usando `useMemo`\n");
    expect(toc[0]).toEqual({ id: "usando-usememo", text: "Usando useMemo", depth: 2 });
  });

  it("returns an empty list when there are no headings", () => {
    expect(extractToc("Apenas um parágrafo.")).toEqual([]);
  });

  it("excludes a trailing inline JSX tag from the label and id", () => {
    // Must match rehypeHeadingId's real-render behavior exactly, or the
    // sidebar link and the actual heading id drift apart.
    const toc = extractToc("## Questão 7 <Badge>1,0 pt</Badge>\n");
    expect(toc).toEqual([{ id: "questão-7", text: "Questão 7", depth: 2 }]);
  });

  it("excludes a leading inline JSX tag from the label and id", () => {
    const toc = extractToc("## <Icon /> Questão 7\n");
    expect(toc).toEqual([{ id: "questão-7", text: "Questão 7", depth: 2 }]);
  });
});
