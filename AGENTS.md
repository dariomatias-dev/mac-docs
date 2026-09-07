<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes: APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project rules

- **Feature-first organization.** Code lives under `src/features/<name>/`
  (components, hooks, lib, types, tests colocated), not split by technical
  layer. Only genuinely shared code goes in `src/shared/`. See
  [docs/architecture.md](docs/architecture.md) for the full dependency
  rules (imports only flow `app` → `features` → `shared`, cross-feature
  imports only via a feature's `index.ts` barrel).
- **Barrel exports.** Each feature exposes its public API via `index.ts`.
  Reach into another feature's internals only through that barrel, never a
  deep import. `eslint.config.mjs`'s `import/no-restricted-paths`
  enforces this.
- **Language split.** All code (identifiers, comments) is in English.
  User-facing display text and `content/**/*.mdx` course content are in
  Portuguese. Repo documentation (`docs/`, root READMEs) ships in three
  languages as flat, suffixed files: `X.md` (English, default),
  `X.pt-BR.md`, `X.es.md`, never as per-language subfolders. Run
  `pnpm run check:docs-locales` after touching any doc to catch
  missing translations or structural drift between languages.
- **Tests colocated with their feature**, under that feature's own
  `__tests__/` directory, not in a top-level test tree.
- **Before shipping a change**, run `pnpm run verify` (the local gate) and
  propose a Conventional Commit; never run `git commit` directly.
