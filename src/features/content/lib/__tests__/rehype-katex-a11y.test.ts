import type { Element, Root } from "hast";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { describe, expect, it } from "vitest";

import { rehypeKatexA11y } from "../rehype-katex-a11y";

async function katexDisplayTabIndexes(source: string): Promise<unknown[]> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeKatexA11y);

  const hast = (await processor.run(processor.parse(source))) as Root;

  const values: unknown[] = [];
  visit(hast, "element", (node: Element) => {
    const classes = node.properties?.className;
    if (Array.isArray(classes) && classes.includes("katex-display")) {
      values.push(node.properties?.tabIndex);
    }
  });
  return values;
}

describe("rehypeKatexA11y", () => {
  it("makes every katex-display keyboard-focusable", async () => {
    const tabIndexes = await katexDisplayTabIndexes("$$\nA = B\n$$\n");
    expect(tabIndexes).toEqual([0]);
  });

  it("leaves non-display (inline) math untouched", async () => {
    const hast = (await unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeKatex)
      .use(rehypeKatexA11y)
      .run(
        unified().use(remarkParse).use(remarkMath).parse("Inline $x=1$ math.\n"),
      )) as Root;

    let sawKatex = false;
    let sawTabIndex = false;
    visit(hast, "element", (node: Element) => {
      const classes = node.properties?.className;
      if (Array.isArray(classes) && classes.includes("katex")) sawKatex = true;
      if (node.properties?.tabIndex !== undefined) sawTabIndex = true;
    });
    expect(sawKatex).toBe(true);
    expect(sawTabIndex).toBe(false);
  });
});
