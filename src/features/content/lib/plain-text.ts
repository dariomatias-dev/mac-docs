import { cache } from "react";

import type { Root } from "mdast";
import readingTime from "reading-time";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import stripMarkdown from "strip-markdown";
import { unified } from "unified";
import { visit } from "unist-util-visit";

import type { Doc } from "../content.types";
import { getAllDocs } from "./mdx";
import { latexToPlainText } from "./latex-to-text";

// remark-math parses `$..$`/`$$..$$` into "math"/"inlineMath" nodes instead
// of plain text; without this, stripMarkdown has no markdown syntax to
// strip there and raw LaTeX source leaks into search results / copied text.
function remarkMathToText() {
  return (tree: Root) => {
    visit(tree, (node, index, parent) => {
      if (!parent || index === undefined) return;
      if (node.type !== "math" && node.type !== "inlineMath") return;
      const value = "value" in node && typeof node.value === "string" ? node.value : "";
      const displayMode = node.type === "math";
      parent.children[index] = { type: "text", value: latexToPlainText(value, displayMode) };
    });
  };
}

export const toPlainText = cache((markdown: string): string => {
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkMathToText)
    .use(stripMarkdown)
    .use(remarkStringify)
    .processSync(markdown);
  return String(file).trim();
});

export function getPagePlainText(doc: Doc): string {
  const parts = [doc.frontmatter.title, doc.frontmatter.description, toPlainText(doc.content)];
  return parts.filter(Boolean).join("\n\n");
}

export function getSectionPlainText(groupSlug: string[]): string {
  const groupKey = groupSlug.join("/");
  const docs = getAllDocs().filter((doc) => {
    const dirSlug = doc.isSection ? doc.slug : doc.slug.slice(0, -1);
    return dirSlug.join("/") === groupKey;
  });
  return docs.map(getPagePlainText).join("\n\n---\n\n");
}

export function getReadingMinutes(content: string): number {
  const { minutes } = readingTime(toPlainText(content));
  return Math.max(1, Math.ceil(minutes));
}
