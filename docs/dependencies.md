<strong>Language:</strong> English | <a href="dependencies.pt-BR.md">Português</a> | <a href="dependencies.es.md">Español</a>

# Dependencies

Most dependencies use a caret range and get bumped freely. A few are pinned
exactly, for reasons worth knowing before "just" upgrading them:

| Package                  | Pin                                    | Why                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------ | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `next`                   | exact (`16.3.1`)                       | A pre-release major line with breaking changes vs. the version most tooling and AI assistants were trained on — see [`AGENTS.md`](../AGENTS.md). File conventions have already been renamed within this major line (e.g. `middleware.ts` is now `proxy.ts` — noticed while researching the CSP nonce guide in `node_modules/next/dist/docs/`), and an unplanned bump can silently reintroduce that kind of change. Bump deliberately, read the release notes, re-check `node_modules/next/dist/docs/` for anything renamed. |
| `eslint-config-next`     | exact, matching `next`'s exact version | Ships lint rules tied to `next`'s internals for that specific release. Bump it together with `next`, to the same version, not independently.                                                                                                                                                                                                                                                                                                                                                                                |
| `eslint-plugin-jsx-a11y` | exact (`6.10.2`)                       | Was already installed transitively through `eslint-config-next`; added as a direct, exact-pinned dependency (rather than a `^` range) so declaring it explicitly doesn't quietly resolve to a different version than the one this repo's a11y lint config — including the `no-noninteractive-tabindex` tuning in `eslint.config.mjs` — was actually written and tested against.                                                                                                                                             |

Everything else uses `^` and is intended to auto-update via Dependabot
(`.github/dependabot.yml`), grouped into one PR for patch/minor bumps per
ecosystem (`npm`, `github-actions`) and left ungrouped for majors, since a
major is the one that actually warrants a human reading a changelog.

## Triaging a Dependabot PR

1. If it's a **patch/minor group PR** (npm or GitHub Actions), the local
   gate is the real check: `pnpm run verify`. If it's green, merge — the
   whole point of the local gate is that it doesn't need re-deriving per
   dependency.
2. If it's a **major bump**, skim the package's changelog for breaking
   changes before merging, even if `pnpm run verify` passes; a major can
   break behavior the test suite doesn't exercise. `next` itself is
   excluded from Dependabot for exactly this reason (see the pin note
   above) — its own minor releases have renamed file conventions before.
3. If it touches one of the three pinned packages in the table, don't let
   Dependabot bump it directly — those are excluded from the automatic
   groups precisely so a person reads the "why" above first.
4. `pnpm audit`, `osv-scanner` and CodeQL (see `.github/workflows/`) all run
   independently of Dependabot and report without blocking; a Dependabot PR
   closing an advisory those flagged is the common case, not a coincidence.
