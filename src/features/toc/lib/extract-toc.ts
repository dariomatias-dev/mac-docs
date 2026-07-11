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

// Without an MDX parser, `<Tag>content</Tag>` shows up as three flat
// siblings — an opening "html" node, the plain text, and a closing
// "html" node — not a nested tree. So skipping inline JSX/HTML (e.g. a
// trailing <Badge>) means tracking depth across open/close tags, not
// just filtering "html"-typed children.
// Must match rehypeHeadingId's skip logic exactly, or the sidebar link
// and the real heading id (set at render time) drift apart.
function headingText(node: Heading): string {
  let text = "";
  let skipDepth = 0;

  for (const child of node.children) {
    if (child.type === "html") {
      const value = (child as { value: string }).value.trim();
      if (value.startsWith("</")) skipDepth = Math.max(0, skipDepth - 1);
      else if (!value.endsWith("/>")) skipDepth++;
      continue;
    }
    if (skipDepth > 0) continue;
    visit(child, (n) => {
      if (n.type === "text") text += (n as Text).value;
      if (n.type === "inlineCode") text += (n as InlineCode).value;
    });
  }

  return text.trim();
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
