import {
  getPagePlainText,
  getReadingMinutes,
  getSectionPlainText,
  type Doc,
} from "@/features/content";
import { getBreadcrumb, getFlatPageList } from "@/features/navigation";
import { extractToc } from "@/features/toc";

// Composes content, navigation and toc data for a doc page. Lives here
// (not in a feature) because it needs all three, and features don't import
// each other, so this kind of cross-feature composition only belongs in
// the app layer.
export function buildDocView(doc: Doc) {
  const breadcrumb = getBreadcrumb(doc.slug);
  const toc = extractToc(doc.content);

  const flat = getFlatPageList();
  const currentIndex = flat.findIndex((page) => page.href === doc.url);
  const prev = currentIndex > 0 ? flat[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < flat.length - 1 ? flat[currentIndex + 1] : null;

  const prerequisites = (doc.frontmatter.prerequisites ?? []).map((href) => ({
    href,
    title: flat.find((page) => page.href === href)?.title ?? href,
  }));

  return {
    breadcrumb,
    toc,
    prev,
    next,
    minutes: getReadingMinutes(doc.content),
    pageText: getPagePlainText(doc),
    sectionText: doc.isSection ? getSectionPlainText(doc.slug) : undefined,
    prerequisites,
    tocLabel: doc.slug.includes("avaliacoes") ? "Nesta prova" : undefined,
  };
}
