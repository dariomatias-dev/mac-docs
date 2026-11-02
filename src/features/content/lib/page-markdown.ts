import { cache } from "react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";

import { SITE_URL } from "@/shared/lib/site";

import { mdastToMarkdown } from "./mdast-to-markdown";
import { getAllDocs } from "./mdx";

import type { Doc } from "../content.types";

const parser = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).use(remarkMath);

/**
 * Converts a page's MDX source to clean Markdown for the "copy" buttons:
 * course components become their Markdown equivalent and math stays as
 * `$...$`/`$$...$$` LaTeX, so pasting into an AI chat, Obsidian or Notion
 * keeps every formula intact instead of a lossy Unicode approximation.
 */
export const toMarkdown = cache((source: string): string =>
  mdastToMarkdown(parser.parse(source)),
);

export function getPageMarkdown(doc: Doc): string {
  const header = [`# ${doc.frontmatter.title}`];
  if (doc.frontmatter.description) header.push(`> ${doc.frontmatter.description}`);
  header.push(`Fonte: ${SITE_URL}${doc.url}`);
  return [...header, toMarkdown(doc.content)].filter(Boolean).join("\n\n");
}

export function getSectionMarkdown(groupSlug: string[]): string {
  const groupKey = groupSlug.join("/");
  const docs = getAllDocs().filter((doc) => {
    const dirSlug = doc.isSection ? doc.slug : doc.slug.slice(0, -1);
    return dirSlug.join("/") === groupKey;
  });
  return docs.map(getPageMarkdown).join("\n\n---\n\n");
}
