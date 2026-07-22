import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { BooleanMatrixExercise } from "../boolean-matrix-exercise";

describe("BooleanMatrixExercise", () => {
  it("shows an OR statement and reveals the answer on click", async () => {
    const { container } = render(<BooleanMatrixExercise operations={["or"]} />);

    expect(screen.getByText(/calcule a ∨ b/i)).toBeInTheDocument();
    const statement = container.querySelectorAll(".katex")[0];
    expect(statement.textContent).toContain("A");
    expect(statement.textContent).toContain("B");

    const button = screen.getByRole("button", { name: /ver resposta/i });
    expect(button).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(button);

    expect(screen.getByRole("button", { name: /ocultar resposta/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByText("Resposta")).toBeInTheDocument();
  });

  it("shows a boolean-product statement", () => {
    render(<BooleanMatrixExercise operations={["multiply"]} />);

    expect(screen.getByText(/multiplicação booleana de matrizes/i)).toBeInTheDocument();
  });

  it("re-generates a question and closes the answer on click", async () => {
    render(<BooleanMatrixExercise operations={["and"]} />);

    await userEvent.click(screen.getByRole("button", { name: /ver resposta/i }));
    expect(screen.getByText("Resposta")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /gerar nova questão/i }));

    expect(screen.getByRole("button", { name: /ver resposta/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
