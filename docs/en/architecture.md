<strong>Language:</strong> English | <a href="../pt/architecture.md">Português</a>

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
│   ├── content/          # read, parse and render MDX, reading time, copy
│   ├── navigation/       # sidebar, breadcrumb, prev/next, header, providers
│   ├── search/           # index and command menu dialog
│   ├── study/            # interactive MDX components and registry
│   ├── toc/              # table of contents and scroll spy
│   └── theme/            # theme provider and toggle
│
├── shared/
│   ├── hooks/            # use-persisted-state, use-disclosure, use-copy, use-raf-scroll
│   ├── lib/              # site, content-config, env
│   └── components/       # cta-link (CtaLink/CtaButton)
│
└── lib/
    └── utils.ts          # cn (clsx + tailwind-merge)

content/                  # content (.mdx) at the repository root
```

## Dependency rules

- Imports only go down: `app` then `features` then `shared`.
- Features do not import each other. When they need data from another feature,
  the composition happens in the `app` layer (for example, `build-doc-view.ts`
  combines `content`, `navigation` and `toc` to build the docs page).
- Each feature exposes its public API through `index.ts`.
- Files in kebab-case, components in PascalCase, hooks named `useX`.
- All code in English, display text in Portuguese.

## Intentional exceptions

- `search` aggregates `navigation` (the tree) and `content` (the text); it is a
  top level feature whose job is precisely to combine the two.
- The `Header` (in `navigation`) uses the `ThemeToggle` from `theme`.

## Rendering and routes

- The optional catch all route `app/docs/[[...slug]]` prerenders every page
  through `generateStaticParams` (pure SSG), with `generateMetadata` per page
  (title, description, canonical, Open Graph).
- Content is read from the file system at build time; nothing runs on the client
  except the interactive islands (search, sidebar, study components, table of
  contents, theme).
