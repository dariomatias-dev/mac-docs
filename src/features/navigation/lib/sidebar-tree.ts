import { cache } from "react";

import { getAllDocs, type Doc } from "@/features/content";

import type { Crumb, SidebarCourse, SidebarGroup, SidebarPage } from "../navigation.types";

export function titleCaseFallback(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const COURSE_TITLES: Record<string, string> = {
  "matematica-discreta": "Matemática Discreta",
};

function courseTitle(dirName: string): string {
  return COURSE_TITLES[dirName] ?? titleCaseFallback(dirName);
}

function byOrderThenTitle<T extends { order: number; title: string }>(a: T, b: T): number {
  return a.order - b.order || a.title.localeCompare(b.title);
}

/** Directory a doc lives in: its own slug for a section (index.mdx), else its parent. */
function dirOf(doc: Doc): string[] {
  return doc.isSection ? doc.slug : doc.slug.slice(0, -1);
}

/** Distinct child-directory slugs one level below `parent`, derived from the doc set. */
function childDirs(docs: Doc[], parent: string[]): string[][] {
  const depth = parent.length;
  const key = parent.join("/");
  const keys = new Set<string>();

  for (const doc of docs) {
    const dir = dirOf(doc);
    if (dir.length > depth && dir.slice(0, depth).join("/") === key) {
      keys.add(dir.slice(0, depth + 1).join("/"));
    }
  }

  return [...keys].map((k) => k.split("/"));
}

function buildGroup(docs: Doc[], slug: string[]): SidebarGroup {
  const depth = slug.length;
  const key = slug.join("/");

  const section = docs.find((doc) => doc.isSection && doc.slug.join("/") === key);

  const pages: SidebarPage[] = docs
    .filter(
      (doc) =>
        !doc.isSection &&
        doc.slug.length === depth + 1 &&
        doc.slug.slice(0, depth).join("/") === key,
    )
    .map((doc) => ({
      title: doc.frontmatter.title,
      slug: doc.slug,
      href: doc.url,
      order: doc.frontmatter.order ?? 0,
    }))
    .sort(byOrderThenTitle);

  const groups: SidebarGroup[] = childDirs(docs, slug)
    .map((childSlug) => buildGroup(docs, childSlug))
    .sort(byOrderThenTitle);

  return {
    title: section?.frontmatter.title ?? titleCaseFallback(slug[depth - 1]),
    description: section?.frontmatter.description,
    kind: section?.frontmatter.kind ?? "module",
    slug,
    href: "/docs/" + key,
    order: section?.frontmatter.order ?? 0,
    pages,
    groups,
  };
}

export const getSidebarTree = cache((): SidebarCourse[] => {
  const docs = getAllDocs();

  const courseNames = new Set<string>();
  for (const doc of docs) courseNames.add(doc.slug[0]);

  return [...courseNames].map((name) => {
    const root = buildGroup(docs, [name]);
    return {
      title: courseTitle(name),
      slug: [name],
      href: root.href,
      order: 0,
      pages: root.pages,
      groups: root.groups,
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
    flat.push({ title: course.title, slug: course.slug, href: course.href, order: -1 });
    for (const group of course.groups) collect(group);
    flat.push(...course.pages);
  }
  return flat;
}

export type LessonContext = {
  /**
   * Top-level group the page belongs to. `number` is its 1-based position
   * among the course's subject modules, null for a resource group.
   */
  module: { title: string; href: string; number: number | null };
  /**
   * Where the page sits among its siblings: the group that lists it, and
   * whether that group is the module itself or a subgroup inside it. Null
   * for a group's own index page.
   */
  position: { index: number; total: number; groupTitle: string; nested: boolean } | null;
};

function findListingGroup(
  group: SidebarGroup,
  href: string,
): { group: SidebarGroup; index: number } | null {
  const index = group.pages.findIndex((page) => page.href === href);
  if (index >= 0) return { group, index };
  for (const sub of group.groups) {
    const found = findListingGroup(sub, href);
    if (found) return found;
  }
  return null;
}

/** Module and position of a docs page, for the lesson header and prev/next. */
export function getLessonContext(href: string): LessonContext | null {
  for (const course of getSidebarTree()) {
    const modules = course.groups.filter((group) => group.kind === "module");
    for (const group of course.groups) {
      if (href !== group.href && !href.startsWith(`${group.href}/`)) continue;
      const listing = findListingGroup(group, href);
      const number = group.kind === "module" ? modules.indexOf(group) + 1 : null;
      return {
        module: { title: group.title, href: group.href, number },
        position: listing
          ? {
              index: listing.index + 1,
              total: listing.group.pages.length,
              groupTitle: listing.group.title,
              nested: listing.group !== group,
            }
          : null,
      };
    }
  }
  return null;
}

/** Top-level group (module) whose index page is `href`, if any. */
export function getModuleByHref(href: string): SidebarGroup | null {
  for (const course of getSidebarTree()) {
    const match = course.groups.find((group) => group.href === href);
    if (match) return match;
  }
  return null;
}
