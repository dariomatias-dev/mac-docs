import { describe, expect, it } from "vitest";

import { getSearchIndex } from "../search-index";

describe("getSearchIndex", () => {
  it("indexes groups and pages with body text", () => {
    const index = getSearchIndex();
    expect(index.length).toBeGreaterThan(0);

    const page = index.find((i) => i.href === "/docs/matematica-discreta/matrizes/operacoes");
    expect(page).toBeDefined();
    expect(page?.section).toContain("Matemática Discreta");
    expect(page?.text.length).toBeGreaterThan(0);
  });

  it("caps each entry body length", () => {
    for (const item of getSearchIndex()) {
      expect(item.text.length).toBeLessThanOrEqual(2000);
    }
  });
});
