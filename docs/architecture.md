<strong>Language:</strong> English | <a href="architecture.es.md">Español</a> | <a href="architecture.pt-BR.md">Português</a>

# Architecture

Feature first organization: each feature is self contained (components, hooks,
libs, types, tests). Only the genuinely shared code goes up to `shared/`.

```
src/
├── app/                  # thin routes, they only compose features
│   ├── layout.tsx
│   ├── page.tsx
│   ├── error.tsx  not-found.tsx  loading.tsx
│   ├── sitemap.ts  robots.ts  og/route.tsx
│   └── docs/[[...slug]]/
│       ├── page.tsx
│       ├── build-doc-view.ts   # composes content + navigation + toc
│       └── error.tsx  not-found.tsx  loading.tsx
│
├── features/
│   ├── annotations/      # per-page annotations (localStorage), export/import
│   ├── content/          # read, parse and render MDX, reading time, copy
│   ├── contributors/     # /contribuidores page: monitoring, material and code (GitHub API)
│   ├── navigation/       # sidebar, breadcrumb, prev/next, header, providers
│   ├── schedule/         # class schedule, "next class" card on the home page
│   ├── search/           # index and command menu dialog
│   ├── study/            # interactive MDX components and registry
│   ├── toc/              # table of contents and scroll spy
│   └── theme/            # theme provider and toggle
│
└── shared/
    ├── hooks/            # use-persisted-state, use-disclosure, use-copy, use-raf-scroll
    ├── lib/              # cn, site, content-config, env, json-ld, git-dates
    ├── components/       # cta-link (CtaLink/CtaButton)
    └── providers/        # active-mobile-sheet-provider (coordinates mobile sheets)

content/                  # content (.mdx) at the repository root
```

## Dependency rules

- Imports only go down: `app` then `features` then `shared`.
- `shared/` never imports from `features/`.
- `app/` and a feature may only reach another feature through its `index.ts`
  barrel, never a file inside it. A feature's own internal files (its own
  `lib/`, `components/`) are fair game for that same feature.
- Each feature exposes its public API through `index.ts`.
- Files in kebab-case, components in PascalCase, hooks named `useX`.
- All code in English, display text in Portuguese.

`eslint.config.mjs`'s `import/no-restricted-paths` is what actually enforces
the three rules above: `pnpm run lint` fails on a cross-boundary import this
document doesn't list as an exception below, so this section can't drift from
what's really allowed the way a comment-only convention could.

## Intentional exceptions

Each of these is also an explicit `except` entry in `eslint.config.mjs`, not
just a note here.

- `search` aggregates `navigation` (the tree) and `content` (the text); it is a
  top level feature whose job is precisely to combine the two.
- The `Header` (in `navigation`) uses the `ThemeToggle` from `theme`.
- `navigation` (mobile sidebar) and `annotations` (annotations panel) coordinate
  which mobile sheet is open through `ActiveMobileSheetProvider`, in `shared/`,
  so at most one stays open at a time.
- `annotations` reads `search/lib/search-shared.ts` directly instead of
  through `search`'s barrel: the barrel also re-exports `getSearchIndex`,
  which reads `content/` from disk, and `annotations`'s `"use client"` page
  must not pull that into a browser bundle.

## Rendering and routes

- The optional catch all route `app/docs/[[...slug]]` prerenders every page
  through `generateStaticParams` (pure SSG), with `generateMetadata` per page
  (title, description, canonical, Open Graph).
- Content is read from the file system at build time; nothing runs on the client
  except the interactive islands (search, sidebar, study components, table of
  contents, theme, annotations).
- `/contribuidores` fetches code contributors from the GitHub API at
  build/revalidation time (streamed via `Suspense`); monitoring and material
  contributors are hand-curated in `src/features/contributors/data/`.

## Data flow: a `.mdx` file to a rendered page and a search result

A single file under `content/` feeds two independent paths, both reading the
same file system at build time and never talking to each other directly:

1. **The page.** `content/lib/mdx.ts` walks `content/`, validates each file's
   frontmatter against `frontmatter-schema.ts` (the same schema
   `scripts/check-content.mjs` uses in CI, one source of truth, not two),
   and turns a file path into a `Doc` (slug, URL, frontmatter, raw MDX
   source). `app/docs/[[...slug]]/page.tsx` calls `getDocBySlug`, composes it
   with the sidebar tree and table of contents in `build-doc-view.ts`, and
   hands the raw MDX string to `MdxRenderer`, which compiles it with
   `next-mdx-remote/rsc` through the remark/rehype pipeline (GFM, math,
   heading IDs, KaTeX, pretty-code) and resolves any custom tag
   (`<MatrixCalculator>`, `<Quiz>`, ...) against `study/registry.ts`'s
   component map.
2. **The search entry.** `search/lib/search-index.ts` walks the same doc
   tree (`getSidebarTree`, itself built from `getAllDocs()`) completely
   separately, and for each page calls `getPagePlainText`, which strips the
   MDX down to plain text (stripping Markdown syntax and JSX tags,
   flattening LaTeX to readable text via `latex-to-text.ts`) and caps it at
   2000 characters. That produces the flat `SearchItem[]` served statically
   at `/search-index.json`, fetched lazily by `SearchDialog` and matched
   client side with Fuse.js. The rendered page and the search index can
   disagree in principle (e.g. a rendering bug in one pipeline but not the
   other) since they process the same source through genuinely different
   code paths; that's the tradeoff for the search index not depending on
   (and being far lighter than) the full MDX rendering pipeline.

## Decisions

- **Why SSG.** Every page here is the same for every visitor (course notes,
  not per-user content), and the one piece of real per-user state
  (annotations) already lives entirely client side. There's no request to
  render against, so paying for a server render on every visit would buy
  nothing; `generateStaticParams` prerendering every page at build time makes
  each one a static file cacheable at the edge.
- **Why `next-mdx-remote/rsc` instead of `@next/mdx`.** `@next/mdx` expects
  `.mdx` files colocated as route files under `app/`; this project's content
  lives in `content/` at the repository root, read as plain strings and
  compiled on demand, so the same file can back a page, a search-index
  entry, and (via `scripts/check-content.mjs`) a CI content check without
  three different loading mechanisms. `next-mdx-remote/rsc` compiles an MDX
  string with a custom remark/rehype pipeline and resolves an arbitrary
  components map (`study/registry.ts`) against it in a Server Component,
  which is exactly that shape.
- **Why `localStorage` for annotations.** This site has no accounts and no
  backend (see [security.md](security.md)'s stated scope): a personal
  per-page note is exactly the kind of state that doesn't justify standing
  up either. `localStorage` keeps annotations working offline, needs no
  privacy handling for server-stored user content, and costs nothing to
  host. The tradeoff, accepted deliberately: notes don't sync across
  devices or browsers, which is why the panel also offers an explicit
  export/import as JSON.
