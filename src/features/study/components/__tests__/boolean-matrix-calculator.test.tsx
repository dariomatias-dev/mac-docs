import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { BooleanMatrixCalculator } from "../boolean-matrix-calculator";

// The result grid's cells carry no accessible label, only their digit as
// plain text, so we read them in row-major DOM order from the aria-live
// region instead of guessing at ambiguous text queries.
function readResultGrid(container: HTMLElement): string[] {
  const region = container.querySelector('[aria-live="polite"]')!;
  return Array.from(region.querySelectorAll("div")).flatMap((el) =>
    el.children.length === 0 && /^[01]$/.test(el.textContent ?? "") ? [el.textContent!] : [],
  );
}

describe("BooleanMatrixCalculator", () => {
  it("computes the boolean OR of the default matrices", () => {
    const { container } = render(<BooleanMatrixCalculator />);
    // A = [[1,0],[0,1]], B = [[1,1],[0,0]] -> OR = [[1,1],[0,1]]
    expect(readResultGrid(container)).toEqual(["1", "1", "0", "1"]);
  });

  it("recomputes with AND when the operation changes", async () => {
    const { container } = render(<BooleanMatrixCalculator />);
    await userEvent.click(screen.getByRole("button", { name: /produto booleano/i }));
    // AND = [[1,0],[0,0]]
    expect(readResultGrid(container)).toEqual(["1", "0", "0", "0"]);
  });

  it("computes the boolean matrix product", async () => {
    const { container } = render(<BooleanMatrixCalculator />);
    await userEvent.click(screen.getByRole("button", { name: /produto de matrizes/i }));
    // A ⊙ B: row0=[1,0]->row0 of B=[1,1]; row1=[0,1]->row1 of B=[0,0]
    expect(readResultGrid(container)).toEqual(["1", "1", "0", "0"]);
  });

  it("toggling a cell in A updates that cell's own accessible label", async () => {
    render(<BooleanMatrixCalculator />);
    const cell = screen.getByRole("button", {
      name: "Alternar elemento linha 2, coluna 2, valor atual 1",
    });

    await userEvent.click(cell);

    // Re-check the SAME element (not re-query by name: matrix B already has
    // an unrelated cell with the post-toggle label, which would collide).
    expect(cell).toHaveAttribute(
      "aria-label",
      "Alternar elemento linha 2, coluna 2, valor atual 0",
    );
  });

  it("shows an error instead of a result when OR/AND get mismatched orders", async () => {
    render(<BooleanMatrixCalculator />);

    const rowSelectors = screen.getAllByRole("button", { name: "linhas" });
    await userEvent.click(rowSelectors[0]); // opens Matrix A's row-count dropdown
    await userEvent.click(screen.getByRole("option", { name: "3" }));

    expect(screen.getByText(/precisam ter a mesma ordem/i)).toBeInTheDocument();
  });

  it("shows a column/row-mismatch error for the matrix product", async () => {
    render(<BooleanMatrixCalculator />);
    await userEvent.click(screen.getByRole("button", { name: /produto de matrizes/i }));

    const colSelectors = screen.getAllByRole("button", { name: "colunas" });
    await userEvent.click(colSelectors[0]); // Matrix A's column count
    await userEvent.click(screen.getByRole("option", { name: "3" }));

    expect(
      screen.getByText(/nº de colunas de a \(3\) precisa ser igual ao nº de linhas de b \(2\)/i),
    ).toBeInTheDocument();
  });

  it("resizing a matrix's columns preserves existing cell values and pads with zero", async () => {
    render(<BooleanMatrixCalculator />);

    const colSelectors = screen.getAllByRole("button", { name: "colunas" });
    await userEvent.click(colSelectors[1]); // Matrix B's column count
    await userEvent.click(screen.getByRole("option", { name: "3" }));

    // B grew from [[1,1],[0,0]] to [[1,1,0],[0,0,0]]; the new column is 0.
    expect(
      screen.getByRole("button", { name: "Alternar elemento linha 1, coluna 3, valor atual 0" }),
    ).toBeInTheDocument();
  });
});
