import { afterEach, describe, expect, it, vi } from "vitest";

import { randomBitMatrix, randomInt, randomMatrix } from "../random";

describe("randomInt", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns min when Math.random() is 0", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(randomInt(3, 9)).toBe(3);
  });

  it("returns max when Math.random() approaches 1", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999999);
    expect(randomInt(3, 9)).toBe(9);
  });

  it("stays within [min, max] across the full range of Math.random()", () => {
    for (let i = 0; i < 10; i++) {
      vi.spyOn(Math, "random").mockReturnValue(i / 10);
      const n = randomInt(0, 5);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(5);
    }
  });
});

describe("randomMatrix", () => {
  afterEach(() => vi.restoreAllMocks());

  it("builds a matrix with the requested number of rows and columns", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const m = randomMatrix(2, 3, 7, 7);
    expect(m).toEqual([
      [7, 7, 7],
      [7, 7, 7],
    ]);
  });

  it("fills every entry from randomInt(min, max)", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999999);
    expect(randomMatrix(1, 2, -1, 1)).toEqual([[1, 1]]);
  });
});

describe("randomBitMatrix", () => {
  afterEach(() => vi.restoreAllMocks());

  it("produces only 0s when Math.random() is always below 0.5", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.1);
    expect(randomBitMatrix(2, 2)).toEqual([
      [0, 0],
      [0, 0],
    ]);
  });

  it("produces only 1s when Math.random() is at or above 0.5", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    expect(randomBitMatrix(2, 2)).toEqual([
      [1, 1],
      [1, 1],
    ]);
  });

  it("builds the requested shape", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(randomBitMatrix(3, 1)).toEqual([[0], [0], [0]]);
  });
});
