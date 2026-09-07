import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { checkBundleSize } from "../check-bundle-size.mjs";

let buildDir;

function writeChunk(name, sizeBytes) {
  const full = path.join(buildDir, "static", "chunks", name);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, "a".repeat(sizeBytes));
}

function writeHtml(relPath, scripts) {
  const full = path.join(buildDir, "server", "app", relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  const tags = scripts
    .map((src) => `<script src="/_next/static/chunks/${src}" async=""></script>`)
    .join("\n");
  fs.writeFileSync(full, `<!doctype html><html><body>${tags}</body></html>`);
}

beforeEach(() => {
  buildDir = fs.mkdtempSync(path.join(os.tmpdir(), "check-bundle-size-"));
});

afterEach(() => {
  fs.rmSync(buildDir, { recursive: true, force: true });
});

describe("checkBundleSize", () => {
  it("passes a route whose referenced chunks fit the budget", () => {
    writeChunk("a.js", 1024);
    writeChunk("b.js", 1024);
    writeHtml("index.html", ["a.js", "b.js"]);

    const { errors, results } = checkBundleSize({
      buildDir,
      routes: [
        { name: "/", htmlPath: path.join(buildDir, "server", "app", "index.html"), budgetKB: 5 },
      ],
    });

    expect(errors).toEqual([]);
    expect(results).toEqual([
      { name: "/", totalBytes: 2048, budgetBytes: 5 * 1024, chunkCount: 2, ok: true },
    ]);
  });

  it("flags a route whose referenced chunks exceed the budget", () => {
    writeChunk("big.js", 10 * 1024);
    writeHtml("index.html", ["big.js"]);

    const { errors, results } = checkBundleSize({
      buildDir,
      routes: [
        { name: "/", htmlPath: path.join(buildDir, "server", "app", "index.html"), budgetKB: 5 },
      ],
    });

    expect(results[0].ok).toBe(false);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/exceeds the 5KB budget/);
  });

  it("counts each referenced chunk only once even if it appears in multiple script tags", () => {
    writeChunk("shared.js", 1024);
    writeHtml("index.html", ["shared.js", "shared.js"]);

    const { results } = checkBundleSize({
      buildDir,
      routes: [
        { name: "/", htmlPath: path.join(buildDir, "server", "app", "index.html"), budgetKB: 5 },
      ],
    });

    expect(results[0].chunkCount).toBe(1);
    expect(results[0].totalBytes).toBe(1024);
  });

  it("errors when the route's HTML output doesn't exist", () => {
    const { errors, results } = checkBundleSize({
      buildDir,
      routes: [
        {
          name: "/missing",
          htmlPath: path.join(buildDir, "server", "app", "missing.html"),
          budgetKB: 5,
        },
      ],
    });

    expect(results).toEqual([]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/no build output/);
  });

  it("errors when a referenced chunk file is missing on disk", () => {
    writeHtml("index.html", ["ghost.js"]);

    const { errors, results } = checkBundleSize({
      buildDir,
      routes: [
        { name: "/", htmlPath: path.join(buildDir, "server", "app", "index.html"), budgetKB: 5 },
      ],
    });

    expect(results).toEqual([]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/missing on disk/);
    expect(errors[0]).toMatch(/ghost\.js/);
  });
});
