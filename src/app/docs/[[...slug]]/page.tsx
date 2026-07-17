import type { Metadata } from "next";
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
import { Breadcrumbs, EditPageLink, PrevNextNav } from "@/features/navigation";
import { mdxComponents } from "@/features/study";
import { MobileToc, TableOfContents } from "@/features/toc";
import { jsonLd } from "@/shared/lib/json-ld";
import { SITE_URL } from "@/shared/lib/site";

import { buildDocView } from "./build-doc-view";

export const dynamicParams = false;

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

  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
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

  const { breadcrumb, toc, prev, next, minutes, pageText, sectionText, prerequisites, tocLabel } =
    buildDocView(doc);
  const slugPath = doc.slug.join("/");

  const courseHref = `/docs/${doc.slug[0]}`;
  const breadcrumbItems = [
    { title: "Início", href: "/" },
    ...breadcrumb.map((crumb) => ({ title: crumb.title, href: crumb.href ?? courseHref })),
    { title: doc.frontmatter.title, href: doc.url },
  ];

  return (
    <div className="mx-auto flex max-w-[1600px] gap-8 px-6 pt-12 pb-28 sm:px-8 lg:px-10">
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
      <article className="max-w-300 min-w-0 flex-1">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <Breadcrumbs items={breadcrumb} />
          <CopyButtons pageText={pageText} sectionText={sectionText} />
        </div>
        <h1 className="text-foreground mb-2 text-4xl font-bold tracking-tight">
          {doc.frontmatter.title}
        </h1>
        <PageMeta minutes={minutes} prerequisites={prerequisites} />
        <MobileToc items={toc} label={tocLabel} />
        <div className="prose prose-neutral dark:prose-invert mt-6 max-w-none">
          <MdxRenderer source={doc.content} components={mdxComponents} />
          <MathCopy />
        </div>
        <EditPageLink filePath={doc.filePath} />
        <PrevNextNav prev={prev} next={next} />
      </article>

      <aside className="hidden w-72 shrink-0 xl:block">
        <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <TableOfContents items={toc} label={tocLabel} />
        </div>
      </aside>

      <Annotations key={slugPath} slug={slugPath} />
    </div>
  );
}
