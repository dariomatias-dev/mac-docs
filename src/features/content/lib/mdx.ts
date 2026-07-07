import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

import matter from "gray-matter";

import { CONTENT_DIR } from "@/shared/lib/content-config";

import type { Doc } from "../content.types";
import { frontmatterSchema } from "./frontmatter-schema";

const MDX_EXTENSION = ".mdx";
const SECTION_FILE = "index";

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    if (entry.isFile() && entry.name.endsWith(MDX_EXTENSION)) return [fullPath];
    return [];
  });
}

function fileToSlug(filePath: string): string[] {
  const relative = path.relative(CONTENT_DIR, filePath).slice(0, -MDX_EXTENSION.length);
  const parts = relative.split(path.sep);
  if (parts[parts.length - 1] === SECTION_FILE) parts.pop();
  return parts;
}

function slugToUrl(slug: string[]): string {
  return slug.length ? `/docs/${slug.join("/")}` : "/docs";
}

function fileToDoc(filePath: string): Doc {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    const relative = path.relative(process.cwd(), filePath);
    throw new Error(`Frontmatter inválido em ${relative}:\n${parsed.error.message}`);
  }

  const slug = fileToSlug(filePath);

  return {
    slug,
    url: slugToUrl(slug),
    frontmatter: parsed.data,
    content,
    filePath,
    isSection: path.basename(filePath, MDX_EXTENSION) === SECTION_FILE,
  };
}

export const getAllDocs = cache((): Doc[] => {
  return walk(CONTENT_DIR).map(fileToDoc);
});

export function getAllSlugs(): string[][] {
  return getAllDocs().map((doc) => doc.slug);
}

const docBySlug = cache(() => new Map(getAllDocs().map((doc) => [doc.slug.join("/"), doc])));

export function getDocBySlug(slug: string[]): Doc | null {
  return docBySlug().get(slug.join("/")) ?? null;
}
