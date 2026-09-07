# Changelog

## About this file

From this point forward, `release-please` maintains this file automatically:
every merge to `main` updates a standing release pull request with the
entries generated from [Conventional Commits](https://www.conventionalcommits.org/)
since the last release, and merging that PR cuts the release, tags it, and
bumps the version in `package.json` to match. See
[docs/dependencies.md](docs/dependencies.md) for how dependency
updates flow through this same commit convention.

The project's actual history predates this file — 194 commits' worth,
already following Conventional Commits, but never rolled up into dated
release entries. Retrofitting that into accurate `## vX.Y.Z` sections isn't
something worth fabricating after the fact; `git log` is the honest source
for anything before the first automated entry below.
