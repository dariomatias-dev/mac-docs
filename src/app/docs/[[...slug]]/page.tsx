import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MdxRenderer, getAllSlugs, getDocBySlug } from "@/features/content";
import { Breadcrumbs, PrevNextNav, getBreadcrumb, getFlatPageList } from "@/features/navigation";
import { MobileToc, TableOfContents, extractToc } from "@/features/toc";

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
  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
    },
    twitter: {
      card: "summary",
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
    },
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug ?? []);
  if (!doc) notFound();

  const breadcrumb = getBreadcrumb(doc.slug);
  const toc = extractToc(doc.content);
  const flat = getFlatPageList();
  const currentIndex = flat.findIndex((page) => page.href === doc.url);
  const prev = currentIndex > 0 ? flat[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < flat.length - 1 ? flat[currentIndex + 1] : null;

  return (
    <div className="mx-auto flex max-w-[1600px] gap-8 px-12 pt-12 pb-28">
      <article className="max-w-300 min-w-0 flex-1">
        <Breadcrumbs items={breadcrumb} />
        <h1 className="text-foreground mt-4 mb-6 text-4xl font-bold tracking-tight">
          {doc.frontmatter.title}
        </h1>
        <MobileToc items={toc} />
        <div className="prose prose-neutral dark:prose-invert mt-6 max-w-none">
          <MdxRenderer source={doc.content} />
        </div>
        <PrevNextNav prev={prev} next={next} />
      </article>

      <aside className="hidden w-72 shrink-0 xl:block">
        <div className="sticky top-28">
          <TableOfContents items={toc} />
        </div>
      </aside>
    </div>
  );
}
