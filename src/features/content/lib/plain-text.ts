import { cache } from "react";
import readingTime from "reading-time";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";

import { latexToPlainText } from "./latex-to-text";
import { remarkFlattenMdx } from "./remark-flatten-mdx";

import type { Doc } from "../content.types";
import type { Nodes, Root } from "mdast";

// Without remark-mdx, a component tag followed by text on the next line
// (`<Question>\nSabendo...`) parses as one raw HTML block and its whole
// paragraph is lost; remarkFlattenMdx then turns the components into
// plain mdast this module knows how to read.
const processor = unified()
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkFlattenMdx);

// Inline content of one block, with math rendered as readable Unicode
// (remark-math keeps it as LaTeX source otherwise).
function inlineText(node: Nodes): string {
  switch (node.type) {
    case "text":
    case "inlineCode":
      return node.value;
    case "inlineMath":
      return latexToPlainText(node.value);
    case "break":
      return "\n";
    case "image":
      return node.alt ?? "";
    default:
      return "children" in node ? node.children.map(inlineText).join("") : "";
  }
}

// One string per block, so paragraphs, headings and list items stay
// separate instead of gluing into "fim.Próximo título".
function blockTexts(node: Nodes): string[] {
  switch (node.type) {
    case "paragraph":
    case "heading":
      return [inlineText(node)];
    case "math":
      return [latexToPlainText(node.value, true)];
    case "code":
      return [node.value];
    case "tableRow":
      return [node.children.map(inlineText).join(" | ")];
    case "html":
    case "yaml":
    case "definition":
      return [];
    default:
      return "children" in node ? node.children.flatMap(blockTexts) : [];
  }
}

export const toPlainText = cache((markdown: string): string => {
  // runSync is typed with unist's generic Node; the tree is still mdast.
  const tree = processor.runSync(processor.parse(markdown)) as Root;
  return blockTexts(tree)
    .map((block) => block.trim())
    .filter(Boolean)
    .join("\n\n");
});

export function getPagePlainText(doc: Doc): string {
  const parts = [doc.frontmatter.title, doc.frontmatter.description, toPlainText(doc.content)];
  return parts.filter(Boolean).join("\n\n");
}

export function getReadingMinutes(content: string): number {
  const { minutes } = readingTime(toPlainText(content));
  return Math.max(1, Math.ceil(minutes));
}
