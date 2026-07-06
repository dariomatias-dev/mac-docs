import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

import matter from "gray-matter";

import { CONTENT_DIR } from "@/shared/lib/content-config";

import type { Crumb, SidebarCourse, SidebarGroup, SidebarPage } from "../navigation.types";

type Frontmatter = { title?: string; description?: string; order?: number };

function readFrontmatter(filePath: string): Frontmatter {
  const raw = fs.readFileSync(filePath, "utf-8");
  return matter(raw).data as Frontmatter;
}

function titleCaseFallback(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const COURSE_TITLES: Record<string, string> = {
  "calculo-1": "Cálculo 1",
  "calculo-2": "Cálculo 2",
  "calculo-3": "Cálculo 3",
  referencia: "Referência",
};

function courseTitle(dirName: string): string {
  return COURSE_TITLES[dirName] ?? titleCaseFallback(dirName);
}

function byOrderThenTitle<T extends { order: number; title: string }>(a: T, b: T): number {
  return a.order - b.order || a.title.localeCompare(b.title);
}

function buildGroup(dirPath: string, slug: string[]): SidebarGroup {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const dirName = slug[slug.length - 1];

  const hasIndex = entries.some((e) => e.isFile() && e.name === "index.mdx");
  const indexData = hasIndex ? readFrontmatter(path.join(dirPath, "index.mdx")) : undefined;

  const pages: SidebarPage[] = entries
    .filter((e) => e.isFile() && e.name.endsWith(".mdx") && e.name !== "index.mdx")
    .map((file) => {
      const name = file.name.replace(/\.mdx$/, "");
      const pageSlug = [...slug, name];
      const data = readFrontmatter(path.join(dirPath, file.name));
      return {
        title: data.title ?? titleCaseFallback(name),
        slug: pageSlug,
        href: "/docs/" + pageSlug.join("/"),
        order: data.order ?? 0,
      };
    })
    .sort(byOrderThenTitle);

  const groups: SidebarGroup[] = entries
    .filter((e) => e.isDirectory())
    .map((dir) => buildGroup(path.join(dirPath, dir.name), [...slug, dir.name]))
    .sort(byOrderThenTitle);

  return {
    title: indexData?.title ?? titleCaseFallback(dirName),
    description: indexData?.description,
    slug,
    href: "/docs/" + slug.join("/"),
    order: indexData?.order ?? 0,
    pages,
    groups,
  };
}

export const getSidebarTree = cache((): SidebarCourse[] => {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((courseDir) => {
      const courseSlug = [courseDir.name];
      const coursePath = path.join(CONTENT_DIR, courseDir.name);
      const groups = fs
        .readdirSync(coursePath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((group) => buildGroup(path.join(coursePath, group.name), [...courseSlug, group.name]))
        .sort(byOrderThenTitle);

      return {
        title: courseTitle(courseDir.name),
        slug: courseSlug,
        order: 0,
        groups,
      };
    });
});

function findTrail(
  groups: SidebarGroup[],
  targetSlug: string[],
  trail: SidebarGroup[] = [],
): SidebarGroup[] | null {
  const target = targetSlug.join("/");
  for (const group of groups) {
    const groupKey = group.slug.join("/");
    if (groupKey === target) return trail;
    if (target.startsWith(groupKey + "/")) {
      const deeper = findTrail(group.groups, targetSlug, [...trail, group]);
      return deeper ?? [...trail, group];
    }
  }
  return null;
}

export function getBreadcrumb(slug: string[]): Crumb[] {
  const tree = getSidebarTree();
  const course = tree.find((c) => c.slug[0] === slug[0]);
  if (!course) return [];

  const crumbs: Crumb[] = [{ title: course.title }];
  const trail = findTrail(course.groups, slug) ?? [];
  for (const group of trail) crumbs.push({ title: group.title, href: group.href });
  return crumbs;
}

export function getFlatPageList(): SidebarPage[] {
  const flat: SidebarPage[] = [];

  function collect(group: SidebarGroup) {
    flat.push({ title: group.title, slug: group.slug, href: group.href, order: -1 });
    flat.push(...group.pages);
    for (const sub of group.groups) collect(sub);
  }

  for (const course of getSidebarTree()) {
    for (const group of course.groups) collect(group);
  }
  return flat;
}
