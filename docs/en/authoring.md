<strong>Language:</strong> English | <a href="../pt/authoring.md">Português</a>

# Authoring content (MDX)

## Folder structure

Content lives in `content/`, in three levels:

```
content/
  calculo-1/                 # course (uppercase label in the sidebar)
    limites/                 # group (collapsible dropdown)
      index.mdx              # group page (sets the title and order)
      conceito-intuitivo.mdx # page
      definicao-formal.mdx   # page
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
title: Conceito intuitivo # required
description: A first idea of a limit. # optional
order: 1 # optional (orders the pages in a group)
prerequisites: # optional, each item must start with /docs/
  - /docs/calculo-1/limites
---
```

## Markdown and math

- Full GFM: tables, task lists, `~~strikethrough~~`, autolinks.
- KaTeX **inline** with `$...$` and **block** with `$$...$$`.
- `##` and `###` headings become the table of contents, with anchors.
- Do not use `#` (h1): the page title is already rendered from the frontmatter.

## Study components

Available inside any `.mdx` file, receiving content through children. See the
reference in [components.md](components.md).
