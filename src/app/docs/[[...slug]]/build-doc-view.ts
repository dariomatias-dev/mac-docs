import {
  getDocBySlug,
  getPagePlainText,
  getReadingMinutes,
  getSectionPlainText,
  type Doc,
} from "@/features/content";
import {
  getBreadcrumb,
  getFlatPageList,
  getLessonContext,
  getModuleByHref,
} from "@/features/navigation";
import { extractToc } from "@/features/toc";

export const MODULE_TOPICS_ID = "topicos-do-modulo";

// Composes content, navigation and toc data for a doc page. Lives here
// (not in a feature) because it needs all three, and features don't import
// each other, so this kind of cross-feature composition only belongs in
// the app layer.
export function buildDocView(doc: Doc) {
  const breadcrumb = getBreadcrumb(doc.slug);
  // A module's opening page lists the module's topics after its own content.
  const moduleTopics = (getModuleByHref(doc.url)?.pages ?? []).map((page) => ({
    ...page,
    description: getDocBySlug(page.slug)?.frontmatter.description,
  }));
  const headings = [
    ...extractToc(doc.content),
    ...(moduleTopics.length > 0
      ? [{ id: MODULE_TOPICS_ID, text: "Tópicos deste módulo", depth: 2 as const }]
      : []),
  ];
  // The extracted headings start only at the first `##`, so the TOC has no
  // entry (and highlights nothing) while reading the intro under the H1.
  // Prepending the page title, pointed at the H1's id, covers that gap.
  const toc =
    headings.length > 0
      ? [{ id: "top", text: "Visão geral", depth: 2 as const }, ...headings]
      : headings;

  const flat = getFlatPageList();
  const currentIndex = flat.findIndex((page) => page.href === doc.url);
  const prevPage = currentIndex > 0 ? flat[currentIndex - 1] : null;
  const nextPage =
    currentIndex >= 0 && currentIndex < flat.length - 1 ? flat[currentIndex + 1] : null;
  // Prev/next cards name the module they lead into, so crossing into a new
  // module reads as such.
  const withModule = (page: typeof prevPage) =>
    page && { ...page, module: getLessonContext(page.href)?.module.title };

  const prerequisites = (doc.frontmatter.prerequisites ?? []).map((href) => ({
    href,
    title: flat.find((page) => page.href === href)?.title ?? href,
  }));

  return {
    breadcrumb,
    toc,
    prev: withModule(prevPage),
    next: withModule(nextPage),
    lesson: getLessonContext(doc.url),
    moduleTopics,
    minutes: getReadingMinutes(doc.content),
    pageText: getPagePlainText(doc),
    sectionText: doc.isSection ? getSectionPlainText(doc.slug) : undefined,
    prerequisites,
    tocLabel: doc.slug.includes("avaliacoes") ? "Nesta prova" : undefined,
  };
}
