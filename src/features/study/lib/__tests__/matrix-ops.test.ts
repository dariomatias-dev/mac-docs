import { describe, expect, it } from "vitest";

import { addMatrices, multiplyMatrices, scaleMatrix, subMatrices, transpose } from "../matrix-ops";

describe("addMatrices", () => {
  it("adds element-wise", () => {
    expect(
      addMatrices(
        [
          [1, 2],
          [3, 4],
        ],
        [
          [10, 20],
          [30, 40],
        ],
      ),
    ).toEqual([
      [11, 22],
      [33, 44],
    ]);
  });
});

describe("subMatrices", () => {
  it("subtracts element-wise", () => {
    expect(
      subMatrices(
        [
          [5, 5],
          [5, 5],
        ],
        [
          [1, 2],
          [3, 4],
        ],
      ),
    ).toEqual([
      [4, 3],
      [2, 1],
    ]);
  });
});

describe("scaleMatrix", () => {
  it("multiplies every element by the scalar", () => {
    expect(
      scaleMatrix(
        [
          [1, -2],
          [3, 4],
        ],
        -2,
      ),
    ).toEqual([
      [-2, 4],
      [-6, -8],
    ]);
  });

  it("returns a zero matrix when scaled by 0", () => {
    expect(scaleMatrix([[7, 8]], 0)).toEqual([[0, 0]]);
  });
});

describe("multiplyMatrices", () => {
  it("computes the standard matrix product", () => {
    // [1 2 3]   [ 7  8]   [1*7+2*9+3*11  1*8+2*10+3*12]   [ 58  64]
    // [4 5 6] x [ 9 10] = [4*7+5*9+6*11  4*8+5*10+6*12] = [139 154]
    //           [11 12]
    expect(
      multiplyMatrices(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        [
          [7, 8],
          [9, 10],
          [11, 12],
        ],
      ),
    ).toEqual([
      [58, 64],
      [139, 154],
    ]);
  });

  it("multiplies by the identity without changing the matrix", () => {
    const identity = [
      [1, 0],
      [0, 1],
    ];
    const a = [
      [3, 5],
      [-1, 2],
    ];
    expect(multiplyMatrices(a, identity)).toEqual(a);
  });
});

describe("transpose", () => {
  it("swaps rows and columns", () => {
    expect(
      transpose([
        [1, 2, 3],
        [4, 5, 6],
      ]),
    ).toEqual([
      [1, 4],
      [2, 5],
      [3, 6],
    ]);
  });

  it("is its own inverse", () => {
    const m = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    expect(transpose(transpose(m))).toEqual(m);
  });
});
