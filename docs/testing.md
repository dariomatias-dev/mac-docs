<strong>Language:</strong> English | <a href="testing.pt-BR.md">Português</a> | <a href="testing.es.md">Español</a>

# Testing

## What actually merits a test here

Coverage is a floor, not a goal — see the thresholds and their rationale
in `vitest.config.ts`. The judgment call that matters more than the
number is _what_ to test:

- **Real logic**: a computation, a branch, a piece of state that can be
  wrong. Matrix operations, the sort/filter logic in the annotations
  panel, a hook's error-recovery path (malformed `localStorage`, a failed
  write) — all worth a test.
- **Real user interaction**: click a button, expect a specific outcome.
  Component tests here render the real component and interact with it
  through Testing Library queries (`getByRole`, `getByText`), not by
  reaching into internals.
- **Genuine edge cases, not padding**: a validation boundary, an
  empty-list state, a race the code explicitly guards against. Adding a
  fourth near-identical test case for a fifth near-identical input isn't
  coverage, it's noise.

What's deliberately **not** chased:

- **Marker components that return `null`** (`Option`, `Step`,
  `Alternative` in the study components) — they exist only so
  `Children.toArray` can read their props; calling them directly asserts
  nothing real.
- **`mdx-renderer.tsx`** — `next-mdx-remote/rsc`'s `MDXRemote` is an async
  Server Component; Testing Library's client renderer can't mount it
  (`<MDXRemote> is an async Client Component` is the error you'll get).
  It's exercised for real by every page in `next build` and by the e2e
  a11y suite against real content instead.
- **Trivial pass-through wrappers** (`theme-provider.tsx` re-exporting
  `next-themes`'s provider) — there's no logic to get wrong.

## Test doubles

- **`vi.hoisted()` + `vi.mock()`** for hooks and modules a component
  depends on but isn't the thing under test — `next/navigation`'s
  `usePathname`, `next-themes`'s `useTheme`, a data-fetching function.
- **Real context providers over deep mocking, when they're cheap.**
  `ActiveMobileSheetProvider`, `SidebarCollapseProvider`, and
  `SidebarGroupsProvider` are wrapped around the component under test
  directly rather than mocked, since they're already independently
  tested and using the real thing catches integration bugs a mock
  can't.
- **`localStorage.clear()`** in `beforeEach` for anything backed by
  persisted state (annotations, sidebar collapse), so tests don't leak
  state into each other.
- **Fake timers (`vi.useFakeTimers()`)** for anything that debounces or
  auto-expires (the annotations undo window, a copy-button's "copied"
  reset). Prefer `fireEvent` over `userEvent` when timers are faked —
  `userEvent`'s internal delays fight `vi.useFakeTimers()` and can hang a
  test.
- **jsdom gaps are real and worth a comment, not a workaround.**
  `Element.prototype.scrollIntoView` doesn't exist in jsdom at all (see
  the polyfill in `vitest.setup.ts`); `scrollHeight` and layout-derived
  properties default to `0` (see the explicit stubs in `toc.test.tsx` and
  `reading-progress.test.tsx`). Don't let a jsdom limitation silently make
  a branch untestable-looking when it's actually just unstubbed.

## Running the suites

```bash
pnpm test              # Vitest in watch mode
pnpm run test:run       # Vitest once
pnpm run test:coverage  # Vitest once, with the coverage thresholds enforced
pnpm run test:e2e       # Playwright, against a built app
```

The scripts' own test file
(`scripts/__tests__/check-content.test.mjs`,
`scripts/__tests__/check-bundle-size.test.mjs`) run through the same
`test:*` commands — Vitest's `include` pattern in `vitest.config.ts`
covers `scripts/**/*.{test,spec}.mjs` too, not just `src/`.

## Debugging a failing test

For a unit/component test, Vitest's own `--reporter=verbose` and
`test.only` narrow things down quickly. For e2e, see
[ci.md](ci.md#debugging-a-failed-e2e-run) for how to pull a trace out of
a CI failure; locally, `pnpm exec playwright test --debug` opens the
Playwright inspector directly.
