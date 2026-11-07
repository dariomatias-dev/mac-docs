import { describe, expect, it } from "vitest";

import { getDocBySlug } from "../mdx";
import { getPageMarkdown, getSectionMarkdown, toMarkdown } from "../page-markdown";

describe("toMarkdown", () => {
  it("keeps math as LaTeX and Markdown structure intact", () => {
    const md = toMarkdown("## Título\n\nSeja $x \\in \\mathbb{N}$.\n\n$$\n\\frac{1}{2}\n$$\n\n- item");
    expect(md).toContain("## Título");
    expect(md).toContain("$x \\in \\mathbb{N}$");
    expect(md).toContain("$$\n\\frac{1}{2}\n$$");
    expect(md).toContain("- item");
  });

  it("keeps text that sits on the line right after a component tag", () => {
    const md = toMarkdown("<Question>\nSabendo que $A$ é quadrada\n\n<Answer>\n$A = 1$\n</Answer>\n</Question>");
    expect(md).toBe("Sabendo que $A$ é quadrada\n\n**Resposta**\n\n$A = 1$");
  });

  it("labels resolutions and numbers untitled exercises in page order", () => {
    const md = toMarkdown(
      '<Exercise>\nUm\n</Exercise>\n\n<Exercise title="Desafio">\nDois\n</Exercise>\n\n<Exercise>\nTrês\n<Resolution>\nFeito\n</Resolution>\n</Exercise>',
    );
    expect(md).toContain("**Exercício 1**\n\nUm");
    expect(md).toContain("**Desafio**\n\nDois");
    expect(md).toContain("**Exercício 3**\n\nTrês\n\n**Resolução**\n\nFeito");
  });

  it("letters every alternative, one-line and multi-line alike", () => {
    const md = toMarkdown(
      "<Alternatives>\n  <Alternative>$a$</Alternative>\n  <Alternative>$b$</Alternative>\n  <Alternative>\n    $c$\n  </Alternative>\n  <Alternative correct>$d$</Alternative>\n</Alternatives>",
    );
    expect(md).toBe("- a) $a$\n- b) $b$\n- c) $c$\n- d) $d$");
  });

  it("turns badges, markers and callouts into readable Markdown", () => {
    const md = toMarkdown(
      '## Questão 1 <Badge>ITA (10,0 pts)</Badge>\n\n<Marker>a)</Marker> texto\n\n<Callout type="tip" title="Dica">\n  Conteúdo\n</Callout>',
    );
    expect(md).toContain("## Questão 1 · ITA (10,0 pts)");
    expect(md).toContain("**a)** texto");
    expect(md).toContain("> **Dica**\n>\n> Conteúdo");
  });

  it("writes pixel grids as rows of digits and videos as links", () => {
    const md = toMarkdown(
      '<div>\n  <PixelGrid columns="2" pattern="10 01" />\n</div>\n\n<YouTube id="abcdefghijk" title="Aula 1" />',
    );
    expect(md).toContain("```\n10\n01\n```");
    expect(md).toContain("[Aula 1](https://www.youtube.com/watch?v=abcdefghijk)");
  });

  it("drops interactive widgets and leaves no JSX behind", () => {
    const md = toMarkdown('Antes\n\n<SetCalculator />\n\n<span className="x">depois</span>');
    expect(md).toBe("Antes\n\ndepois");
  });
});

describe("getPageMarkdown", () => {
  it("starts with the title, description and source link", () => {
    const doc = getDocBySlug(["matematica-discreta", "conjuntos", "cardinalidade"])!;
    const md = getPageMarkdown(doc);
    expect(md.startsWith(`# ${doc.frontmatter.title}\n\n`)).toBe(true);
    expect(md).toContain(`> ${doc.frontmatter.description}`);
    expect(md).toMatch(/Fonte: \S+\/docs\/matematica-discreta\/conjuntos\/cardinalidade/);
  });
});

describe("getSectionMarkdown", () => {
  it("joins every page of a group under its own title", () => {
    const md = getSectionMarkdown(["matematica-discreta", "matrizes"]);
    expect(md).toContain("# Operações com matrizes");
    expect(md).toContain("# Matrizes booleanas");
    expect(md).toContain("\n\n---\n\n");
  });
});


describe("component Markdown edge cases", () => {
  it("keeps steps and collapsible content with their optional titles", () => {
    const md = toMarkdown('<StepByStep>\n<Step title="Fatorar">\nPrimeiro passo.\n</Step>\n<Step>\nSegundo passo.\n</Step>\n</StepByStep>\n\n<Collapsible title="Detalhes">\nExplicação.\n</Collapsible>');
    expect(md).toBe("**Resolução passo a passo**\n\n**Fatorar**\n\nPrimeiro passo.\n\nSegundo passo.\n\n**Detalhes**\n\nExplicação.");
  });

  it("omits executable MDX while preserving surrounding prose", () => {
    const md = toMarkdown('export const secret = "interno";\n\nAntes {secret} depois.\n\n{secret}');
    expect(md).toBe("Antes  depois.");
  });

  it("supports video URLs and a default title, omitting empty video IDs", () => {
    const md = toMarkdown('<YouTube id="https://youtu.be/abcdefghijk" />\n\n<YouTube id="  " />');
    expect(md).toBe("[Vídeo do YouTube](https://youtu.be/abcdefghijk)");
  });

  it("preserves inline pixel grids and defaults missing columns to a single row", () => {
    expect(toMarkdown('Grade: <PixelGrid pattern="10 01" />.')).toBe("Grade: `1001`.");
  });

  it("keeps untitled callout and collapsible content", () => {
    expect(toMarkdown('<Callout>\nUma dica.\n</Callout>\n\n<Collapsible>\nDetalhes.\n</Collapsible>')).toBe("> Uma dica.\n\nDetalhes.");
  });

  it("returns no section text for a nonexistent group", () => {
    expect(getSectionMarkdown(["nonexistent-course", "nonexistent-group"])).toBe("");
  });
});
