import GithubSlugger from "github-slugger";
import type { Heading, InlineCode, Text } from "mdast";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export type TocItem = {
  id: string;
  text: string;
  depth: 2 | 3;
};

function headingText(node: Heading): string {
  let text = "";
  visit(node, (child) => {
    if (child.type === "text") text += (child as Text).value;
    if (child.type === "inlineCode") text += (child as InlineCode).value;
  });
  return text;
}

export function extractToc(markdown: string): TocItem[] {
  const tree = unified().use(remarkParse).parse(markdown);
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  visit(tree, "heading", (node: Heading) => {
    if (node.depth !== 2 && node.depth !== 3) return;
    const text = headingText(node);
    if (!text) return;
    items.push({ id: slugger.slug(text), text, depth: node.depth as 2 | 3 });
  });

  return items;
}
