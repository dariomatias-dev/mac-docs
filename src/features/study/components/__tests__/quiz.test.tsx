import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Option, Quiz } from "../quiz";

function renderQuiz() {
  return render(
    <Quiz question="Qual é a correta?">
      <Option>Errada</Option>
      <Option correct>Certa</Option>
    </Quiz>,
  );
}

describe("Quiz", () => {
  it("marks a wrong pick as incorrect", async () => {
    renderQuiz();
    await userEvent.click(screen.getByRole("button", { name: /Errada/ }));
    expect(screen.getByText(/tente entender o porquê/i)).toBeInTheDocument();
  });

  it("marks the correct pick as right", async () => {
    renderQuiz();
    await userEvent.click(screen.getByRole("button", { name: /Certa/ }));
    expect(screen.getByText("Correto!")).toBeInTheDocument();
  });

  it("locks the options after answering", async () => {
    renderQuiz();
    await userEvent.click(screen.getByRole("button", { name: /Certa/ }));
    expect(screen.getByRole("button", { name: /Errada/ })).toBeDisabled();
  });
});
