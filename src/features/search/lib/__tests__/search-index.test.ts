import { describe, expect, it } from "vitest";

import { getSearchIndex } from "../search-index";

describe("getSearchIndex", () => {
  // Compiles every real MDX file in content/ to build the index, which is
  // slow enough under v8 coverage instrumentation to occasionally miss the
  // default 5s timeout even though it's not actually hanging.
  it("indexes groups and pages with body text", () => {
    const index = getSearchIndex();
    expect(index.length).toBeGreaterThan(0);

    const page = index.find((i) => i.href === "/docs/matematica-discreta/matrizes/operacoes");
    expect(page).toBeDefined();
    expect(page?.section).toContain("Matemática Discreta");
    expect(page?.text.length).toBeGreaterThan(0);
  }, 20000);

  it("caps each entry body length", () => {
    for (const item of getSearchIndex()) {
      expect(item.text.length).toBeLessThanOrEqual(2000);
    }
  }, 20000);
});
