import { describe, expect, it } from "vitest";

import { andMatrices, booleanProduct, orMatrices, type BitMatrix } from "../boolean-matrix-ops";

describe("orMatrices", () => {
  it("is 1 wherever either matrix is 1", () => {
    expect(
      orMatrices(
        [
          [1, 0],
          [0, 0],
        ],
        [
          [0, 0],
          [0, 1],
        ],
      ),
    ).toEqual([
      [1, 0],
      [0, 1],
    ]);
  });

  it("is 0 only where both matrices are 0", () => {
    expect(orMatrices([[0, 1]], [[0, 0]])).toEqual([[0, 1]]);
  });
});

describe("andMatrices", () => {
  it("is 1 only where both matrices are 1", () => {
    expect(
      andMatrices(
        [
          [1, 1],
          [0, 1],
        ],
        [
          [1, 0],
          [0, 1],
        ],
      ),
    ).toEqual([
      [1, 0],
      [0, 1],
    ]);
  });
});

describe("booleanProduct", () => {
  it("is 1 at (i,j) when some k has a[i][k] = b[k][j] = 1", () => {
    expect(
      booleanProduct(
        [
          [1, 0],
          [0, 1],
        ],
        [
          [1, 1],
          [0, 0],
        ],
      ),
    ).toEqual([
      [1, 1],
      [0, 0],
    ]);
  });

  it("swaps rows through a permutation matrix", () => {
    const permutation: BitMatrix = [
      [0, 1],
      [1, 0],
    ];
    expect(booleanProduct(permutation, permutation)).toEqual([
      [1, 0],
      [0, 1],
    ]);
  });
});
