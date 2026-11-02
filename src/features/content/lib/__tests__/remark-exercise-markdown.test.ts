import remarkMath from "remark-math";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { describe, expect, it } from "vitest";

import { remarkExerciseMarkdown, type ExerciseMarkdownOptions } from "../remark-exercise-markdown";

import type { Root } from "mdast";

type Jsx = { type: string; name: string; attributes: { name: string; value: string }[] };

// Runs the plugin and returns each Exercise/Question's injected prop.
function copyTexts(source: string, options?: ExerciseMarkdownOptions): string[] {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkMath)
    .use(remarkExerciseMarkdown, options);
  const tree = processor.runSync(processor.parse(source)) as Root;
  return (tree.children as unknown as Jsx[])
    .filter((node) => node.type === "mdxJsxFlowElement")
    .map((node) => node.attributes.find((a) => a.name === "copyMarkdown")?.value ?? "");
}

describe("remarkExerciseMarkdown", () => {
  it("numbers exercises in page order and keeps math as LaTeX", () => {
    const [first, titled, third] = copyTexts(
      '<Exercise>\nCalcule $x^{2}$.\n\n<Answer>\n$4$\n</Answer>\n</Exercise>\n\n<Exercise title="Desafio">\nDois\n</Exercise>\n\n<Exercise>\nTrês\n</Exercise>',
      { title: "Função polinomial" },
    );
    expect(first).toBe(
      "# Exercício 1 · Função polinomial\n\nCalcule $x^{2}$.\n\n**Resposta**\n\n$4$",
    );
    expect(titled).toMatch(/^# Desafio · Função polinomial/);
    expect(third).toMatch(/^# Exercício 3 · /);
  });

  it("labels a question with the heading right before it", () => {
    const [question] = copyTexts(
      "## Questão 2 <Badge>ITA (10,0 pts)</Badge>\n\n<Question>\nSeja $A$.\n</Question>",
    );
    expect(question).toBe("# Questão 2 · ITA (10,0 pts)\n\nSeja $A$.");
  });

  it("leaves the tree being rendered untouched", () => {
    const processor = unified().use(remarkParse).use(remarkMdx).use(remarkExerciseMarkdown);
    const tree = processor.runSync(
      processor.parse("<Exercise>\n<Answer>\nok\n</Answer>\n</Exercise>"),
    ) as Root;
    const [exercise] = tree.children as unknown as { children: Jsx[] }[];
    expect(exercise.children[0]).toMatchObject({ type: "mdxJsxFlowElement", name: "Answer" });
  });
});
