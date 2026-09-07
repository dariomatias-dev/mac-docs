import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { MatrixCalculator } from "../matrix-calculator";

// NumberMatrixGrid renders each cell as a plain, unlabeled div; read them in
// row-major DOM order rather than guessing at ambiguous text queries.
function readMatrixCells(root: ParentNode): string[] {
  return Array.from(root.querySelectorAll(".font-mono.text-xs")).map((el) => el.textContent ?? "");
}

function resultRegion(container: HTMLElement): HTMLElement {
  return container.querySelector('[aria-live="polite"]')!;
}

describe("MatrixCalculator", () => {
  it("computes A + B for the default matrices and expression", () => {
    const { container } = render(<MatrixCalculator />);
    // A = [[1,2],[2,3]], B = [[-1,2],[0,-2]] -> A + B = [[0,4],[2,1]]
    expect(readMatrixCells(resultRegion(container))).toEqual(["0", "4", "2", "1"]);
  });

  it("shows a dimension-mismatch error instead of a result", async () => {
    const { container } = render(<MatrixCalculator />);

    // Give matrix B (2x2) an extra column, breaking A + B's shared order.
    const colsSelectors = screen.getAllByRole("button", { name: "colunas" });
    await userEvent.click(colsSelectors[1]);
    await userEvent.click(screen.getByRole("option", { name: "3" }));

    expect(screen.getByText(/precisam ter a mesma ordem/i)).toBeInTheDocument();
    expect(readMatrixCells(resultRegion(container))).toEqual([]);
  });

  it("removing the only step leaves the seed matrix as the result", async () => {
    const { container } = render(<MatrixCalculator />);

    await userEvent.click(screen.getByRole("button", { name: "Remover passo" }));

    // Seed A = [[1,2],[2,3]] is symmetric on its own, once the "+ B" step
    // that made the result asymmetric ([[0,4],[2,1]]) is gone.
    expect(await screen.findByText("Matriz simétrica")).toBeInTheDocument();
    expect(readMatrixCells(resultRegion(container))).toEqual(["1", "2", "2", "3"]);
  });

  it("flags a non-commuting product when the step becomes multiplication", async () => {
    render(<MatrixCalculator />);

    await userEvent.click(screen.getByRole("button", { name: "Operador" }));
    await userEvent.click(screen.getByRole("option", { name: "×" }));

    expect(screen.getByText(/não é comutativa/i)).toBeInTheDocument();
  });

  it("adding a matrix introduces the next letter", async () => {
    render(<MatrixCalculator />);
    expect(screen.queryByText("C")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Adicionar matriz" }));

    expect(screen.getByText("C")).toBeInTheDocument();
  });

  it("switches a step to scalar multiplication and applies the default factor", async () => {
    const { container } = render(<MatrixCalculator />);

    await userEvent.click(screen.getByRole("button", { name: "Operador" }));
    await userEvent.click(screen.getByRole("option", { name: "escalar ×" }));

    // Seed A = [[1,2],[2,3]], default scalar factor is 2 -> 2A = [[2,4],[4,6]]
    expect(readMatrixCells(resultRegion(container))).toEqual(["2", "4", "4", "6"]);
  });

  it("recomputes when the scalar factor is edited", async () => {
    const { container } = render(<MatrixCalculator />);

    await userEvent.click(screen.getByRole("button", { name: "Operador" }));
    await userEvent.click(screen.getByRole("option", { name: "escalar ×" }));

    const scalarField = screen
      .getAllByRole("spinbutton")
      .find((el) => !el.hasAttribute("aria-label"))!;
    await userEvent.clear(scalarField);
    await userEvent.type(scalarField, "3");

    // 3A = [[3,6],[6,9]]
    expect(readMatrixCells(resultRegion(container))).toEqual(["3", "6", "6", "9"]);
  });

  it("editing a matrix cell recomputes the result", async () => {
    const { container } = render(<MatrixCalculator />);

    const cell = screen.getAllByRole("spinbutton", { name: "Elemento linha 1, coluna 1" })[0];
    await userEvent.clear(cell);
    await userEvent.type(cell, "9");

    // A = [[9,2],[2,3]], B = [[-1,2],[0,-2]] -> A + B = [[8,4],[2,1]]
    expect(readMatrixCells(resultRegion(container))).toEqual(["8", "4", "2", "1"]);
  });

  it("resizing a matrix's rows changes its shape without breaking the calculator", async () => {
    render(<MatrixCalculator />);

    const rowSelectors = screen.getAllByRole("button", { name: "linhas" });
    await userEvent.click(rowSelectors[0]);
    await userEvent.click(screen.getByRole("option", { name: "3" }));

    expect(
      screen.getByRole("spinbutton", { name: "Elemento linha 3, coluna 1" }),
    ).toBeInTheDocument();
  });

  it("removes an unused matrix from the expression", async () => {
    render(<MatrixCalculator />);

    await userEvent.click(screen.getByRole("button", { name: "Adicionar matriz" }));
    expect(screen.getByText("C")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Remover matriz C" }));
    expect(screen.queryByText("C")).not.toBeInTheDocument();
  });

  it("does not offer to remove a matrix that is used in the expression", () => {
    render(<MatrixCalculator />);
    expect(screen.queryByRole("button", { name: /Remover matriz [AB]/ })).not.toBeInTheDocument();
  });

  it("switching a step's target matrix recomputes against the new operand", async () => {
    const { container } = render(<MatrixCalculator />);

    await userEvent.click(screen.getByRole("button", { name: "Adicionar matriz" }));
    await userEvent.click(screen.getByRole("button", { name: "Matriz" }));
    await userEvent.click(screen.getByRole("option", { name: "C" }));

    // C starts as the zero matrix, so A + C should equal A = [[1,2],[2,3]].
    expect(readMatrixCells(resultRegion(container))).toEqual(["1", "2", "2", "3"]);
  });
});
