import { getDocBySlug, getPagePlainText } from "@/features/content";
import { getSidebarTree, type SidebarGroup } from "@/features/navigation";

import type { SearchItem } from "./search-shared";

const MAX_TEXT = 2000;

function docText(slug: string[]): string {
  const doc = getDocBySlug(slug);
  if (!doc) return "";
  return getPagePlainText(doc).replace(/\s+/g, " ").slice(0, MAX_TEXT);
}

function collect(group: SidebarGroup, section: string, items: SearchItem[]) {
  items.push({ title: group.title, href: group.href, section, text: docText(group.slug) });

  const childSection = `${section} / ${group.title}`;
  for (const page of group.pages) {
    items.push({
      title: page.title,
      href: page.href,
      section: childSection,
      text: docText(page.slug),
    });
  }
  for (const sub of group.groups) collect(sub, childSection, items);
}

export function getSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  for (const course of getSidebarTree()) {
    for (const group of course.groups) collect(group, course.title, items);
  }
  return items;
}
