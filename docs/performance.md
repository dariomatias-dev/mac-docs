<strong>Language:</strong> English | <a href="performance.pt-BR.md">Português</a> | <a href="performance.es.md">Español</a>

# Performance

Two automated checks watch performance: a hard bundle-size budget per
critical route, and Lighthouse CI, which reports without gating yet.

## Bundle size budget

`scripts/check-bundle-size.mjs` reads a real `next build` output: for each
route it checks, it parses that route's prerendered HTML for every
`<script src="/_next/static/chunks/*.js">` tag, sums the real on-disk size
of those files, and fails if the total exceeds the route's budget. Run it
with `pnpm run check:bundle-size` (it's part of `pnpm run verify` and the
CI `build` job, right after `next build`).

This measures per-route static output directly instead of parsing Next's
internal client-reference-manifest format, which isn't a stable contract to
depend on — this project's Next version has already renamed internals once
(see [dependencies.md](dependencies.md)).

### Current budgets

| Route                               | Budget  | Measured at last review |
| ----------------------------------- | ------- | ----------------------- |
| `/`                                 | 1050 KB | ~957 KB                 |
| `/docs/[[...slug]]` (plain content) | 1050 KB | ~978 KB                 |

These are a **floor against regressing past the measured baseline**, not a
target — same philosophy as the Vitest coverage thresholds in
`vitest.config.ts`. Lowering a budget is a deliberate choice that needs a
measurement to back it, same as raising one.

### What's actually in that weight, and where the next cut would come from

The baseline above already reflects one real fix made while setting this
budget up: `src/features/study/registry.ts` used to statically import every
interactive component (both matrix calculators, the boolean-matrix
calculator, the set calculator, quiz, step-by-step, the region diagram, the
pixel grid) into one object passed to `MdxRenderer` on **every** docs page.
Because all 73 pages share one route file
(`app/docs/[[...slug]]/page.tsx`), the bundler had no way to know which page
actually renders which MDX tag, so it shipped all of them — measured before
the fix as a single ~324 KB chunk (calculators + KaTeX) loaded even by a
page with no interactive content at all. Wrapping each in `next/dynamic()`
gives each its own chunk, fetched only when a page actually renders it —
confirmed by comparing the chunk list referenced by a calculator-heavy page
against a plain-prose one after the change.

What's left in the ~957-978 KB is mostly framework baseline (React, React
DOM, the Next.js runtime) plus KaTeX (~260 KB), which is still loaded
eagerly on **every** page regardless of whether that page contains any math
— confirmed on `plano-de-disciplina`, which has zero `$...$` in its source
and still ships the KaTeX chunk. That's the next real cut available here:
either detect math presence at build time (from the compiled MDX AST) and
only register `rehype-katex` / load `katex.css` for pages that need it, or
accept the eager load as a reasonable tradeoff for a math-heavy docs site
where most pages do have at least one formula. Nobody has made that call
yet — it's flagged here, not fixed here.

## Lighthouse CI

`lighthouserc.json` runs Lighthouse three times each against `/`, a content
page, and `/anotacoes`, on a real `next start` server. `pnpm run lighthouse`
runs it locally; CI runs it in a dedicated `lighthouse` job that downloads
the `build` job's artifact instead of rebuilding.

Every assertion in `lighthouserc.json` is `"warn"`, not `"error"`: it
reports a score without failing the job or the pipeline. This is
deliberate, not an oversight — per the plan this work came from, the
intent is to report for a couple of weeks, confirm the numbers hold
steady across real commits (Lighthouse scores have natural run-to-run
noise), and only then flip the categories that matter to `"error"` in a
follow-up change. Nobody should flip that switch without first looking at
a few weeks of actual `lighthouse` job output.

The `/anotacoes` SEO score is expected to sit below its budget: the page is
deliberately `robots: { index: false }` (personal, `localStorage`-backed,
nothing to index), and Lighthouse's SEO audit penalizes a noindex page by
design. That's documented directly in `lighthouserc.json` next to the URL
list, not just here.
