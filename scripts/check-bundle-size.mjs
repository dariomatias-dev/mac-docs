// Budgets the initial JS actually shipped for a route's first load: the set
// of /_next/static/chunks/*.js files referenced as <script src> in that
// route's prerendered HTML, summed by their real on-disk size. This reads
// the real static output rather than a manifest, since App Router's
// per-route client-reference manifest format isn't a stable, documented
// contract to parse against (and this project's Next version already has a
// history of renaming internals — see docs/dependencies.md). Run as a
// CLI against a real `.next` build, or import checkBundleSize() to test the
// parsing/summing logic against a fixture directory.

import fs from "node:fs";
import path from "node:path";

const SCRIPT_SRC = /<script[^>]*\bsrc="([^"]*\/_next\/static\/chunks\/[^"]+\.js)"/g;

function chunkSizesForRoute(buildDir, htmlPath) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const seen = new Set();
  let match;
  while ((match = SCRIPT_SRC.exec(html))) seen.add(match[1]);

  let totalBytes = 0;
  const missing = [];
  for (const src of seen) {
    // src is an absolute app URL like /_next/static/chunks/abc.js; the real
    // file lives under <buildDir>/static/chunks/abc.js.
    const relative = src.replace(/^\/_next\//, "");
    const filePath = path.join(buildDir, relative);
    if (!fs.existsSync(filePath)) {
      missing.push(src);
      continue;
    }
    totalBytes += fs.statSync(filePath).size;
  }

  return { totalBytes, chunkCount: seen.size, missing };
}

export function checkBundleSize({ buildDir, routes }) {
  const errors = [];
  const results = [];

  for (const route of routes) {
    if (!fs.existsSync(route.htmlPath)) {
      errors.push(`${route.name}: no build output at ${route.htmlPath} (run \`next build\` first)`);
      continue;
    }

    const { totalBytes, chunkCount, missing } = chunkSizesForRoute(buildDir, route.htmlPath);
    if (missing.length > 0) {
      errors.push(`${route.name}: referenced chunk(s) missing on disk: ${missing.join(", ")}`);
      continue;
    }

    const budgetBytes = route.budgetKB * 1024;
    const ok = totalBytes <= budgetBytes;
    results.push({ name: route.name, totalBytes, budgetBytes, chunkCount, ok });
    if (!ok) {
      errors.push(
        `${route.name}: ${(totalBytes / 1024).toFixed(1)}KB of initial JS exceeds the ` +
          `${route.budgetKB}KB budget (${chunkCount} chunks). See docs/performance.md.`,
      );
    }
  }

  return { errors, results };
}

const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;

if (isMain) {
  const buildDir = path.join(process.cwd(), ".next");
  // Budgets are a floor against regressing back past the measured baseline
  // (~957-978KB as of the calculator code-splitting in this same change),
  // not a target — see docs/performance.md for what's actually in that
  // weight and where the next real cut would come from.
  const routes = [
    {
      name: "/",
      htmlPath: path.join(buildDir, "server", "app", "index.html"),
      budgetKB: 1050,
    },
    {
      name: "/docs/[[...slug]] (plain content page)",
      htmlPath: path.join(
        buildDir,
        "server",
        "app",
        "docs",
        "matematica-discreta",
        "plano-de-disciplina.html",
      ),
      budgetKB: 1050,
    },
  ];

  const { errors, results } = checkBundleSize({ buildDir, routes });

  for (const r of results) {
    const status = r.ok ? "✓" : "✗";
    console.log(
      `${status} ${r.name}: ${(r.totalBytes / 1024).toFixed(1)}KB / ${(r.budgetBytes / 1024).toFixed(0)}KB (${r.chunkCount} chunks)`,
    );
  }

  if (errors.length > 0) {
    console.error(`\n✗ ${errors.length} bundle-size budget problem(s):\n`);
    for (const error of errors) console.error(`  ${error}`);
    console.error("");
    process.exit(1);
  }

  console.log("\n✓ All routes within their JS budget.");
}
