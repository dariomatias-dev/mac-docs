import { ArrowRight, Flag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Annotations } from "@/features/annotations";
import {
  CopyButtons,
  MathCopy,
  MdxRenderer,
  PageMeta,
  ReadingProgress,
  getAllSlugs,
  getDocBySlug,
} from "@/features/content";
import { Breadcrumbs, EditPageLink, PrevNextNav, type LessonContext } from "@/features/navigation";
import { mdxComponents } from "@/features/study";
import { MobileToc, TableOfContents } from "@/features/toc";
import { getGitDates } from "@/shared/lib/git-dates";
import { jsonLd } from "@/shared/lib/json-ld";
import { getReportIssueUrl } from "@/shared/lib/repo";
import { SITE_NAME, SITE_URL } from "@/shared/lib/site";

import { MODULE_TOPICS_ID, buildDocView } from "./build-doc-view";

import type { Metadata } from "next";

export const dynamicParams = false;

function lessonPositionLabel({ module, position }: LessonContext) {
  if (!position) return module.number !== null ? "Visão geral do módulo" : null;
  const { index, total, groupTitle, nested } = position;
  return nested ? `${groupTitle}: ${index} de ${total}` : `Tópico ${index} de ${total}`;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

type DocPageProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug ?? []);
  if (!doc) return {};

  const url = doc.url;
  const ogImage = `/og?${new URLSearchParams({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description ?? "",
  }).toString()}`;
  const dates = getGitDates(doc.filePath);

  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      locale: "pt_BR",
      url,
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
      publishedTime: dates?.created.toISOString(),
      modifiedTime: dates?.modified.toISOString(),
      images: [{ url: ogImage, width: 1200, height: 630, alt: doc.frontmatter.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
      images: [ogImage],
    },
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug ?? []);
  if (!doc) notFound();

  const {
    breadcrumb,
    toc,
    prev,
    next,
    lesson,
    moduleTopics,
    minutes,
    pageText,
    sectionText,
    prerequisites,
    tocLabel,
  } = buildDocView(doc);
  const slugPath = doc.slug.join("/");

  const courseHref = `/docs/${doc.slug[0]}`;
  const breadcrumbItems = [
    { title: "Início", href: "/" },
    ...breadcrumb.map((crumb) => ({ title: crumb.title, href: crumb.href ?? courseHref })),
    { title: doc.frontmatter.title, href: doc.url },
  ];

  return (
    // From xl the article sits in the middle track, centered in whatever
    // space the sidebar leaves; the left track gives way first so the
    // table of contents keeps its width when room runs short.
    <div className="mx-auto w-full max-w-480 px-5 pt-10 pb-28 sm:px-8 md:pt-12 lg:px-10 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,75rem)_minmax(20rem,1fr)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: breadcrumbItems.map((item, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: item.title,
                  item: `${SITE_URL}${item.href}`,
                })),
              },
              {
                "@type": "WebPage",
                name: doc.frontmatter.title,
                description: doc.frontmatter.description,
                url: `${SITE_URL}${doc.url}`,
                inLanguage: "pt-BR",
                isPartOf: { "@type": "WebSite", url: SITE_URL },
              },
            ],
          }),
        }}
      />
      <ReadingProgress />
      <article className="mx-auto max-w-300 min-w-0 xl:col-start-2 xl:mx-0 xl:max-w-none">
        <header className="border-border mb-10 border-b pb-6">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <Breadcrumbs items={breadcrumb} />
            {lesson && (lesson.module.number !== null || lesson.position) && (
              <p className="text-muted flex items-center gap-2 text-xs font-medium">
                {lesson.module.number !== null && (
                  <span className="bg-accent-soft text-accent rounded-chip px-2 py-0.5 font-semibold">
                    Módulo {lesson.module.number}
                  </span>
                )}
                {lessonPositionLabel(lesson)}
              </p>
            )}
          </div>
          <h1
            id="top"
            className="text-foreground mt-4 scroll-mt-20 text-[2.125rem] leading-[1.15] font-semibold tracking-[-0.035em] sm:text-[2.625rem] md:scroll-mt-8"
          >
            {doc.frontmatter.title}
          </h1>
          <p className="text-muted mt-3 text-lg leading-relaxed text-pretty">
            {doc.frontmatter.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <PageMeta minutes={minutes} prerequisites={prerequisites} />
            <div className="print:hidden">
              <CopyButtons pageText={pageText} sectionText={sectionText} />
            </div>
          </div>
        </header>
        <div className="print:hidden">
          <MobileToc items={toc} label={tocLabel} />
        </div>
        <div className="prose doc-prose max-w-none">
          <MdxRenderer source={doc.content} components={mdxComponents} />
          <MathCopy />
        </div>
        {moduleTopics.length > 0 && (
          <section aria-labelledby={MODULE_TOPICS_ID} className="mt-16">
            <h2
              id={MODULE_TOPICS_ID}
              className="text-foreground scroll-mt-20 text-2xl font-semibold tracking-tight md:scroll-mt-8"
            >
              Tópicos deste módulo
            </h2>
            <ol className="mt-6 grid gap-3 sm:grid-cols-2">
              {moduleTopics.map((topic, i) => (
                <li
                  key={topic.href}
                  className="group border-border bg-background hover:border-accent/40 hover:shadow-soft rounded-card relative flex gap-4 border p-5 transition-[border-color,box-shadow]"
                >
                  <span
                    aria-hidden="true"
                    className="bg-accent-soft text-accent rounded-chip flex h-7 w-7 shrink-0 items-center justify-center font-mono text-xs font-semibold"
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={topic.href}
                      className="text-foreground group-hover:text-accent after:rounded-card font-semibold transition-colors after:absolute after:inset-0"
                    >
                      {topic.title}
                    </Link>
                    {topic.description && (
                      <p className="text-muted mt-1 text-sm leading-relaxed">{topic.description}</p>
                    )}
                  </div>
                  <ArrowRight
                    aria-hidden="true"
                    className="text-muted group-hover:text-accent mt-1 h-4 w-4 shrink-0 transition-[color,translate] group-hover:translate-x-0.5"
                  />
                </li>
              ))}
            </ol>
          </section>
        )}
        <footer className="mt-20 space-y-8 print:hidden">
          <PrevNextNav prev={prev} next={next} />
          <div className="border-border flex flex-col gap-3 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted">
              Encontrou um erro nesta página?{" "}
              <a
                href={getReportIssueUrl(`${SITE_URL}${doc.url}`, doc.frontmatter.title)}
                target="_blank"
                rel="noreferrer"
                className="text-accent inline-flex items-center gap-1.5 font-medium underline-offset-4 hover:underline"
              >
                <Flag className="h-3.5 w-3.5" aria-hidden="true" />
                Reportar um problema
              </a>
            </p>
            <EditPageLink filePath={doc.filePath} />
          </div>
        </footer>
      </article>

      <aside className="hidden xl:col-start-3 xl:block xl:w-80 xl:pl-8 print:hidden">
        <div className="sticky top-12 max-h-[calc(100vh-4rem)] overflow-y-auto pb-6">
          <TableOfContents items={toc} label={tocLabel} />
        </div>
      </aside>

      <Annotations key={slugPath} slug={slugPath} />
    </div>
  );
}
