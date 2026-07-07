import { cache } from "react";

import readingTime from "reading-time";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import stripMarkdown from "strip-markdown";
import { unified } from "unified";

import type { Doc } from "../content.types";
import { getAllDocs } from "./mdx";

export const toPlainText = cache((markdown: string): string => {
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
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
