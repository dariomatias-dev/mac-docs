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

  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug ?? []);
  if (!doc) notFound();

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-10">
      <MdxRenderer source={doc.content} />
    </article>
  );
}
