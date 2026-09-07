<strong>Language:</strong> English | <a href="ci.es.md">Español</a> | <a href="ci.pt-BR.md">Português</a>

# Continuous Integration

Two principles run through every workflow here:

1. **A gate and a report are different things.** What actually fails a
   pull request lives in this repository (a script, a threshold): never
   only in an external service, so a fork PR without a secret configured
   never gets blocked over a missing token.
2. **The local gate mirrors CI.** `pnpm run verify` (see
   [contributing.md](contributing.md#the-local-gate)) runs the same checks
   `ci.yml` runs, in the same order. A green local run should mean a green
   CI run.

## `.github/workflows/ci.yml`

| Job               | Checks                                                                                                         | Gate or report?                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `quality`         | format, lint, types, content, docs locale parity                                                               | Gate, blocks merge                                                             |
| `unit`            | Vitest with coverage thresholds, then a Codecov upload                                                         | Tests gate; the upload is report only                                          |
| `build`           | `next build`, then the bundle-size budget                                                                      | Both gate; see [performance.md](performance.md)                                |
| `e2e`             | Playwright (smoke, navigation, search, annotations, study, seo, security, a11y; desktop and a mobile viewport) | Gate, blocks merge                                                             |
| `vulnerabilities` | `pnpm audit`, `osv-scanner` against the lockfile, `gitleaks` for committed secrets                             | Report only, never blocks a PR                                                 |
| `lighthouse`      | Lighthouse (performance, accessibility, SEO, best practices) against three pages                               | Report only: every assertion is `"warn"`, see [performance.md](performance.md) |

`build` uploads `.next` as an artifact; `e2e` and `lighthouse` both
download it instead of rebuilding, so the app is built exactly once per
run.

The `vulnerabilities` job is deliberately non-blocking: a new
high-severity advisory in an unrelated dev-tooling dependency shouldn't
hold every unrelated PR hostage until someone bumps a package they don't
directly control. Same reasoning for `lighthouse`: Lighthouse scores have
real run-to-run noise, so gating on them before confirming they're stable
would fail PRs for no actual regression.

## Other workflows

- **`codeql.yml`**: static analysis (JavaScript/TypeScript), on every PR,
  every push to `main`, and a weekly schedule so a query-pack update
  surfaces something even in a quiet week. Gates via GitHub's code
  scanning check.
- **`dependency-review.yml`**: on every PR, fails only on a _newly
  introduced_ high-or-above severity advisory or a disallowed license; an
  advisory already on `main` doesn't retroactively block an unrelated PR
  (that's what the `vulnerabilities` job reports on instead).
- **`release-please.yml`**: on push to `main`, keeps a standing release
  pull request with `CHANGELOG.md` and the `package.json` version bump.
  See the [README](../README.md#deployment) for how merging it cuts a
  release.

## Reproducing CI locally with `act`

[`nektos/act`](https://github.com/nektos/act) runs the GitHub Actions
workflow in Docker, using the image pinned in [`.actrc`](../.actrc):

```bash
act -l              # list the jobs and their dependency order
act -j quality       # run one job
act                  # run everything
```

`quality`, `unit`, and `vulnerabilities` run cleanly under `act`. `build`
and `e2e` currently don't complete end-to-end locally: `act`'s local
artifact server doesn't yet support the protocol
`actions/upload-artifact@v7` and `actions/download-artifact@v8` use
(tracked upstream as
[nektos/act#6022](https://github.com/nektos/act/issues/6022) and
[#6114](https://github.com/nektos/act/issues/6114)). The build step
itself still runs and its output is still correct; only the artifact
hand-off to the jobs that depend on it fails locally. Open a draft PR to
see those jobs run for real.

## Debugging a failed e2e run

`playwright.config.ts` sets `trace: "retain-on-failure"`; a failed CI run
uploads `playwright-report/` and `test-results/` as an artifact (see the
`e2e` job's "Upload Playwright report" step). Download it, then:

```bash
npx playwright show-trace path/to/trace.zip
```

That opens a timeline with a screenshot, the DOM, and network activity at
the point of failure, usually faster than trying to reproduce a
CI-only failure by re-reading the assertion.
