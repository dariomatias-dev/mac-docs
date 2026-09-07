import { describe, expect, it } from "vitest";

import { matrixToLatex } from "../matrix-latex";

describe("matrixToLatex", () => {
  it("wraps the matrix in \\begin{bmatrix}, columns joined by &, rows by \\\\", () => {
    expect(
      matrixToLatex([
        [1, 2],
        [3, 4],
      ]),
    ).toBe("\\begin{bmatrix} 1 & 2 \\\\ 3 & 4 \\end{bmatrix}");
  });

  it("handles a single row without a row separator", () => {
    expect(matrixToLatex([[5, 6, 7]])).toBe("\\begin{bmatrix} 5 & 6 & 7 \\end{bmatrix}");
  });

  it("handles negative numbers", () => {
    expect(matrixToLatex([[-1, 2]])).toBe("\\begin{bmatrix} -1 & 2 \\end{bmatrix}");
  });
});
