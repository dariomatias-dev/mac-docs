import path from "node:path";

import { describe, expect, it } from "vitest";

import { CONTENT_DIR, getEditUrl, REPO_BRANCH, REPO_URL } from "../content-config";

describe("CONTENT_DIR", () => {
  it("points at <cwd>/content", () => {
    expect(CONTENT_DIR).toBe(path.join(process.cwd(), "content"));
  });
});

describe("getEditUrl", () => {
  it("builds a GitHub edit URL relative to the repository root", () => {
    const file = path.join(process.cwd(), "content", "matematica-discreta", "index.mdx");
    expect(getEditUrl(file)).toBe(
      `${REPO_URL}/edit/${REPO_BRANCH}/content/matematica-discreta/index.mdx`,
    );
  });

  it("normalizes path separators to forward slashes", () => {
    // Emulates a Windows-style absolute path without depending on the host OS.
    const file = ["content", "matrizes", "operacoes.mdx"].join(path.sep);
    expect(getEditUrl(path.join(process.cwd(), file))).toBe(
      `${REPO_URL}/edit/${REPO_BRANCH}/content/matrizes/operacoes.mdx`,
    );
  });
});
