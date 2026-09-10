import { describe, expect, it, vi } from "vitest";

import { getAllSlugs, getDocBySlug } from "@/features/content";

import DocPage, { generateMetadata, generateStaticParams } from "../page";

import type { ReactElement } from "react";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

type AnyElement = ReactElement<Record<string, unknown>>;

// Flatten a rendered element tree into a list of nodes for prop/text lookups.
function flatten(node: unknown, acc: AnyElement[] = []): AnyElement[] {
  if (Array.isArray(node)) {
    for (const child of node) flatten(child, acc);
    return acc;
  }
  if (!node || typeof node !== "object") return acc;
  const el = node as AnyElement;
  acc.push(el);
  if (el.props.children) flatten(el.props.children, acc);
  return acc;
}

async function renderDocPage(slug: string[]) {
  const ui = await DocPage({ params: Promise.resolve({ slug }) });
  return flatten(ui);
}

describe("DocPage", () => {
  it("renders the resolved doc with its title, breadcrumb, edit link and prev/next nav", async () => {
    const slug = ["matematica-discreta", "matrizes", "operacoes"];
    const doc = getDocBySlug(slug)!;
    const nodes = await renderDocPage(slug);

    const h1 = nodes.find((n) => n.type === "h1");
    expect(h1?.props.children).toBe(doc.frontmatter.title);

    // EditPageLink points at the resolved doc's source file.
    const edit = nodes.find((n) => n.props.filePath);
    expect(edit?.props.filePath).toBe(doc.filePath);

    // Breadcrumb trail reaches the course, prev/next nav wires a following page.
    const breadcrumb = nodes.find((n) => Array.isArray(n.props.items));
    const items = breadcrumb?.props.items as { title: string }[];
    expect(items[0].title).toBe("Matemática Discreta");

    const nav = nodes.find((n) => "prev" in n.props && "next" in n.props);
    const next = nav?.props.next as { href: string } | null;
    expect(next?.href).toBe("/docs/matematica-discreta/matrizes/determinantes");
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(renderDocPage(["nao", "existe"])).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

describe("generateStaticParams", () => {
  it("produces one param entry per known slug", () => {
    const params = generateStaticParams();
    expect(params).toEqual(getAllSlugs().map((slug) => ({ slug })));
  });
});

describe("generateMetadata", () => {
  it("builds title, description and OG/Twitter metadata for a known slug", async () => {
    const slug = ["matematica-discreta", "matrizes", "operacoes"];
    const doc = getDocBySlug(slug)!;

    const metadata = await generateMetadata({ params: Promise.resolve({ slug }) });

    expect(metadata.title).toBe(doc.frontmatter.title);
    expect(metadata.description).toBe(doc.frontmatter.description);
    expect(metadata.alternates).toEqual({ canonical: doc.url });
    expect(metadata.openGraph?.title).toBe(doc.frontmatter.title);
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("returns empty metadata for an unknown slug", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: ["nao", "existe"] }),
    });
    expect(metadata).toEqual({});
  });
});
