import { describe, expect, it } from "vitest";

import { slugFromHref } from "../slug-from-href";

describe("slugFromHref", () => {
  it("strips the leading /docs/ segment", () => {
    expect(slugFromHref("/docs/matematica-discreta/matrizes")).toBe("matematica-discreta/matrizes");
  });

  it("strips a trailing slash", () => {
    expect(slugFromHref("/docs/matematica-discreta/matrizes/")).toBe(
      "matematica-discreta/matrizes",
    );
  });

  it("handles the docs root itself", () => {
    expect(slugFromHref("/docs")).toBe("");
    expect(slugFromHref("/docs/")).toBe("");
  });

  it("leaves a path without the /docs prefix unchanged", () => {
    expect(slugFromHref("/other/path")).toBe("/other/path");
  });
});
