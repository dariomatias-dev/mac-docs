import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NumberMatrixGrid, resizeMatrix } from "../matrix-grid";

describe("NumberMatrixGrid", () => {
  it("renders whole numbers without decimals", () => {
    const { container } = render(<NumberMatrixGrid matrix={[[1, -2]]} />);
    const cells = Array.from(container.querySelectorAll(".font-mono")).map((el) => el.textContent);
    expect(cells).toEqual(["1", "-2"]);
  });

  it("renders non-integer values fixed to two decimal places", () => {
    const { container } = render(<NumberMatrixGrid matrix={[[1.5, 0.333]]} />);
    const cells = Array.from(container.querySelectorAll(".font-mono")).map((el) => el.textContent);
    expect(cells).toEqual(["1.50", "0.33"]);
  });
});

describe("resizeMatrix", () => {
  it("preserves existing values when growing rows and columns", () => {
    const result = resizeMatrix(
      [
        [1, 2],
        [3, 4],
      ],
      3,
      3,
      0,
    );
    expect(result).toEqual([
      [1, 2, 0],
      [3, 4, 0],
      [0, 0, 0],
    ]);
  });

  it("drops values outside the new, smaller shape", () => {
    const result = resizeMatrix(
      [
        [1, 2],
        [3, 4],
      ],
      1,
      1,
      0,
    );
    expect(result).toEqual([[1]]);
  });
});
