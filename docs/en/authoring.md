<strong>Language:</strong> English | <a href="../pt/authoring.md">Português</a>

# Authoring content (MDX)

## Folder structure

Content lives in `content/`, in three levels:

```
content/
  matematica-discreta/       # course (label in the sidebar)
    matrizes/                # group (collapsible dropdown)
      index.mdx              # group page (sets the title and order)
      operacoes.mdx          # page
      matrizes-booleanas.mdx # page
```

- **Course**: a top level folder. Its label comes from `COURSE_TITLES` in
  `src/features/navigation/lib/sidebar-tree.ts`, or from the folder name.
- **Group**: a subfolder with an `index.mdx`. The `index.mdx` sets the title and
  order.
- **Page**: any other `.mdx`. The `order` field defines the sequence.

Creating a `.mdx` file automatically generates its route (`/docs/...`), sidebar
item, breadcrumb, previous/next navigation, and search index entry.

## Frontmatter

Validated by `zod` at build time. Invalid frontmatter fails the build with a
clear error.

```yaml
---
title: Operações com matrizes # required
description: Addition, subtraction and multiplication. # optional
order: 1 # optional (orders the pages in a group)
prerequisites: # optional, each item must start with /docs/
  - /docs/matematica-discreta/matrizes
---
```

## Markdown and math

- Full GFM: tables, task lists, `~~strikethrough~~`, autolinks.
- KaTeX **inline** with `$...$` and **block** with `$$...$$`.
- `##` and `###` headings become the table of contents, with anchors.
- Do not use `#` (h1): the page title is already rendered from the frontmatter.

For the formula syntax, see:

- [KaTeX: Supported Functions](https://katex.org/docs/supported.html): full list of commands, symbols, and environments the renderer accepts.
- [KaTeX: Support Table](https://katex.org/docs/support_table.html): searchable table of every symbol and its command.
- [LaTeX/Mathematics (Wikibooks)](https://en.wikibooks.org/wiki/LaTeX/Mathematics): a broader guide to math notation in LaTeX.

## Study components

Available inside any `.mdx` file, receiving content through children. See the
reference in [components.md](components.md).
