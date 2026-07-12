import { describe, expect, it } from "vitest";

import { latexToPlainText } from "../latex-to-text";

describe("latexToPlainText", () => {
  it("converts common set/logic symbols to their real Unicode glyph", () => {
    expect(latexToPlainText("A \\subseteq B \\Leftrightarrow B \\supseteq A")).toBe(
      "A ⊆ B ⇔ B ⊇ A",
    );
  });

  it("converts set-builder notation with escaped braces, keeping \\text words intact", () => {
    expect(latexToPlainText("\\{x \\mid x \\in \\mathbb{N} \\text{ e } x < 0\\}")).toBe(
      "{ x ∣ x ∈ ℕ e x < 0 }",
    );
  });

  it("flattens a matrix environment into bracketed rows", () => {
    expect(latexToPlainText("\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}")).toBe("[1 2; 3 4]");
  });

  it("glues a multi-letter subscript back into one token", () => {
    expect(latexToPlainText("x_{ij} = 2")).toBe("x ij = 2");
  });

  it("handles quantifiers and implication", () => {
    expect(latexToPlainText("(\\forall x)(x \\in A \\Rightarrow x \\in B)")).toBe(
      "(∀ x) (x ∈ A ⇒ x ∈ B)",
    );
  });

  it("falls back to the literal command name for unsupported commands", () => {
    expect(latexToPlainText("\\unknowncommandxyz{x}")).toBe("\\unknowncommandxyz x");
  });

  it("collapses whitespace and trims", () => {
    expect(latexToPlainText("  A   \\in    B  ")).toBe("A ∈ B");
  });
});
