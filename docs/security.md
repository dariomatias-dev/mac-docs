<strong>Language:</strong> English | <a href="security.pt-BR.md">Português</a> | <a href="security.es.md">Español</a>

# Security Policy

## Scope

This repository is a static documentation site (SSG, no user accounts, no
backend, no database). There is no login, no user data, and nothing to
exfiltrate beyond the site's own public content. Realistic concerns here are
things like: a dependency with a known vulnerability, a Content Security
Policy bypass, a cross-site scripting vector through rendered MDX content, or
a build/CI supply-chain issue: not account takeover or data breach, since
neither accounts nor stored user data exist.

## Supported versions

There's a single deployed version: whatever is on the `main` branch and live
in production. There's no version matrix or LTS branch to track.

## Reporting a vulnerability

Please don't open a public issue for a security report. Instead:

1. Prefer GitHub's private vulnerability reporting: **Security** tab →
   **Report a vulnerability**. If that option isn't visible on this
   repository, it hasn't been enabled yet. Use the email fallback below.
2. Fallback: email
   [dariomatias.dev@gmail.com](mailto:dariomatias.dev@gmail.com) with
   "SECURITY" in the subject line.

Include, as far as you can:

- What the vulnerability is and its potential impact.
- Steps to reproduce it (a URL, a payload, a request).
- The commit or deployed version you tested against.

## Response expectations

This is a personal project maintained by one person, not a company with a
security team: there's no guaranteed response-time SLA. Reports are taken
seriously and acknowledged as soon as reasonably possible, typically within a
few days.

## Disclosure

Please give a reasonable amount of time to address a confirmed issue before
any public disclosure. Credit is happily given in the fix's commit message or
release notes, if you'd like it.
