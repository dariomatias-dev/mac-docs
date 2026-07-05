import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MdxRenderer, getAllSlugs, getDocBySlug } from "@/features/content";

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

  return (
    <div className="mx-auto flex max-w-[1600px] gap-8 px-12 pt-12 pb-28">
      <article className="max-w-300 min-w-0 flex-1">
        <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight">
          {doc.frontmatter.title}
        </h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <MdxRenderer source={doc.content} />
        </div>
      </article>
    </div>
  );
}
