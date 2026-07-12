import GithubSlugger from "github-slugger";
import { toString } from "hast-util-to-string";
import type { Element, Root, RootContent } from "hast";
import { visit } from "unist-util-visit";

const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

// Sets heading ids from text only, skipping inline JSX (e.g. a trailing
// <Badge>). Runs before rehype-slug so decorative/metadata content next
// to a heading doesn't bloat the id; rehype-slug leaves existing ids
// alone. extractToc must use the exact same skip logic, or the sidebar
// links and the real heading id drift apart.
export function rehypeHeadingId() {
  const slugger = new GithubSlugger();

  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (!HEADING_TAGS.has(node.tagName)) return;

      const text = (node.children as RootContent[])
        .filter((child) => !child.type.toLowerCase().includes("mdxjsx"))
        .map((child) => toString(child))
        .join("")
        .trim();
      if (!text) return;

      node.properties = node.properties ?? {};
      node.properties.id = slugger.slug(text);
    });
  };
}
