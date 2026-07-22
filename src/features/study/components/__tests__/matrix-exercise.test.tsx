import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { MatrixExercise } from "../matrix-exercise";

describe("MatrixExercise", () => {
  it("shows a two-matrix statement and reveals the answer on click", async () => {
    const { container } = render(<MatrixExercise operations={["add"]} />);

    expect(screen.getByText(/some as matrizes a e b/i)).toBeInTheDocument();
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

  it("shows only matrix A for a transpose question", () => {
    const { container } = render(<MatrixExercise operations={["transpose"]} />);

    expect(screen.getByText(/transposta de a/i)).toBeInTheDocument();
    const statement = container.querySelectorAll(".katex")[0];
    expect(statement.textContent).toContain("A");
    expect(statement.textContent).not.toContain("B");
  });

  it("re-generates a question and closes the answer on click", async () => {
    render(<MatrixExercise operations={["add"]} />);

    await userEvent.click(screen.getByRole("button", { name: /ver resposta/i }));
    expect(screen.getByText("Resposta")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /gerar nova questão/i }));

    expect(screen.getByRole("button", { name: /ver resposta/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
