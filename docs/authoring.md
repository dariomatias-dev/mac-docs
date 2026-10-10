<strong>Language:</strong> English | <a href="authoring.es.md">Español</a> | <a href="authoring.pt-BR.md">Português</a>

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
item, breadcrumb, previous/next navigation, and search index entry. A module's
`index.mdx` (a group directly under the course) also gets a "Tópicos deste
módulo" list of its pages, with their descriptions, after its content, so
don't add one by hand.

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
kind: resource # optional, only on a group's index.mdx (default: module)
---
```

`kind: resource` marks a group that is course material rather than a subject
(the course plan, the assessments). The sidebar keeps it out of "Conteúdo": on top
if it comes before the first subject (the course plan), under "Recursos"
otherwise, and it doesn't count in the module numbering shown in
the page header ("Módulo 1" is the first subject).

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
