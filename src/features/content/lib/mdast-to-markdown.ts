import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

import { remarkFlattenMdx } from "./remark-flatten-mdx";

import type { Root } from "mdast";

// remark-gfm and remark-math register the serializers for tables and math;
// remarkFlattenMdx turns course components into plain Markdown first.
const processor = unified()
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkFlattenMdx)
  .use(remarkStringify, { bullet: "-", emphasis: "_", rule: "-", fences: true });

/**
 * Serializes a remark-mdx tree as clean Markdown, with math kept as
 * `$...$`/`$$...$$` LaTeX. Works on a copy, so the caller's tree (e.g. the
 * one being compiled for rendering) is left untouched.
 */
export function mdastToMarkdown(tree: Root): string {
  const copy = processor.runSync(structuredClone(tree)) as Root;
  return processor.stringify(copy).trim();
}
