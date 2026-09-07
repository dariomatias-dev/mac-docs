<strong>Language:</strong> English | <a href="contributing.es.md">Español</a> | <a href="contributing.pt-BR.md">Português</a>

# Contributing

This is a personal course-notes project (see the [README](../README.md)),
maintained mostly by one person. Content corrections, bug reports, and small
fixes are genuinely welcome; larger feature proposals are easier to land if
opened as an issue first, since the site's scope is intentionally narrow.

## Setup

```bash
git clone https://github.com/dariomatias-dev/mac-docs.git
cd mac-docs
pnpm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL
pnpm run dev                  # http://localhost:3000
```

Node version is pinned in [`.nvmrc`](../.nvmrc); `nvm use` (or equivalent)
picks it up automatically.

## Before opening a pull request

- [ ] The change is scoped to one concern (content fix, feature, refactor,
      not a mix).
- [ ] `pnpm run verify` passes locally (see [The local gate](#the-local-gate)
      below).
- [ ] Tests were added or updated for behavior that can regress.
- [ ] Content changes were proofread; see
      [Authoring content](authoring.md) for the MDX conventions this project
      follows.
- [ ] The commit message follows
      [Conventional Commits](https://www.conventionalcommits.org/) (enforced
      by commitlint; see [Commits](#commits) below).

## The local gate

```bash
pnpm run verify         # full gate: everything CI runs, including e2e
pnpm run verify --fast  # skips build and e2e: what pre-push runs
```

[`scripts/verify.sh`](../scripts/verify.sh) runs the same checks as
[CI](../.github/workflows/ci.yml), in the same order. A green
`pnpm run verify` locally means CI should also be green. If it isn't, that's
a bug in the gate, not a coincidence to shrug off.

See [ci.md](ci.md) for the full job-by-job breakdown (gate vs. report),
what the other workflows (CodeQL, dependency review, release-please,
Lighthouse) do, how to reproduce a run locally with `act`, and how to
debug a failed e2e run from its uploaded trace.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/), enforced by a
`commit-msg` hook (`@commitlint/config-conventional`). Header line ≤ 72
characters (`commitlint.config.mjs`). Common types used in this repo:
`feat`, `fix`, `docs`, `test`, `ci`, `chore`, `refactor`, `perf`.

```
fix(avaliacoes): correct the sign in question 12's proof
```

## Dependency updates

Dependabot opens weekly PRs, grouped by patch/minor per ecosystem so there's
one to review instead of a dozen. See [dependencies.md](dependencies.md) for
which packages are pinned exactly (and excluded from the automatic group)
and how to triage a Dependabot PR.

## Branches

There's no enforced naming scheme. Branch off `main`, open a pull request
against `main`, and let the [PR template](../.github/pull_request_template.md)
guide the description.

## Working with an AI agent

If you're using an AI coding agent (Claude Code or similar) on this repo,
read [`AGENTS.md`](../AGENTS.md) first: it carries repository-specific
rules the agent needs that don't belong in this human-facing guide.
