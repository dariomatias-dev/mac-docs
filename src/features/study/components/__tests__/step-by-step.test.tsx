import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Step, StepByStep } from "../step-by-step";

function ThreeSteps() {
  return (
    <StepByStep title="Resolução">
      <Step title="Passo um">Conteúdo 1</Step>
      <Step title="Passo dois">Conteúdo 2</Step>
      <Step title="Passo três">Conteúdo 3</Step>
    </StepByStep>
  );
}

describe("StepByStep", () => {
  it("shows only the first step and a 1/N progress count", () => {
    render(<ThreeSteps />);

    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo 1")).toBeInTheDocument();
    expect(screen.queryByText("Conteúdo 2")).not.toBeInTheDocument();
  });

  it("reveals the next step on each click, without a restart button yet", () => {
    render(<ThreeSteps />);
    expect(screen.queryByRole("button", { name: /recomeçar/i })).not.toBeInTheDocument();
  });

  it("reveals one more step per click and shows Concluído on the last one", async () => {
    render(<ThreeSteps />);
    const next = () => screen.getByRole("button", { name: /próximo passo/i });

    await userEvent.click(next());
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo 2")).toBeInTheDocument();

    await userEvent.click(next());
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo 3")).toBeInTheDocument();
    expect(screen.getByText("Concluído")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /próximo passo/i })).not.toBeInTheDocument();
  });

  it("restarts back to the first step", async () => {
    render(<ThreeSteps />);
    await userEvent.click(screen.getByRole("button", { name: /próximo passo/i }));

    await userEvent.click(screen.getByRole("button", { name: /recomeçar/i }));

    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /recomeçar/i })).not.toBeInTheDocument();
  });
});
