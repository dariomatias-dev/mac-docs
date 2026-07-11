import type { Element, Root } from "hast";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { describe, expect, it } from "vitest";

import { rehypeHeadingId } from "../rehype-heading-id";

// Mirrors mdx-renderer.tsx's real pipeline (remark-mdx parses `<Tag>` as
// JSX, not raw HTML) so this exercises the exact node shapes rehypeHeadingId
// has to handle in production.
async function headingIds(source: string): Promise<(string | undefined)[]> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkRehype, { passThrough: ["mdxJsxTextElement", "mdxJsxFlowElement"] })
    .use(rehypeHeadingId)
    .use(rehypeSlug);

  const hast = (await processor.run(processor.parse(source))) as Root;

  const ids: (string | undefined)[] = [];
  visit(hast, "element", (node: Element) => {
    if (/^h[1-6]$/.test(node.tagName)) ids.push(node.properties?.id as string | undefined);
  });
  return ids;
}

describe("rehypeHeadingId", () => {
  it("excludes a trailing inline JSX element from the id", async () => {
    const ids = await headingIds("## Questão 7 <Badge>1,0 pt</Badge>");
    expect(ids).toEqual(["questão-7"]);
  });

  it("excludes a leading inline JSX element from the id", async () => {
    const ids = await headingIds("## <Icon /> Questão 7");
    expect(ids).toEqual(["questão-7"]);
  });

  it("keeps the full text when there is no JSX", async () => {
    const ids = await headingIds("## Símbolos usados");
    expect(ids).toEqual(["símbolos-usados"]);
  });

  it("assigns unique ids to repeated headings, matching rehype-slug", async () => {
    const ids = await headingIds(
      "## Questão 1 <Badge>1,0 pt</Badge>\n\n## Questão 1 <Badge>2,0 pt</Badge>\n",
    );
    expect(ids).toEqual(["questão-1", "questão-1-1"]);
  });
});
