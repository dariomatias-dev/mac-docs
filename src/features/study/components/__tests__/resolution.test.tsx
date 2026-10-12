import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Resolution } from "../resolution";

describe("Resolution", () => {
  it("toggles the content visibility on button click", async () => {
    render(<Resolution>Passo a passo</Resolution>);

    const button = screen.getByRole("button", { name: /ver resolução/i });
    expect(button).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(button);

    const toggled = screen.getByRole("button", { name: /ocultar resolução/i });
    expect(toggled).toHaveAttribute("aria-expanded", "true");
  });

  it("names the method in the button label when given", async () => {
    render(<Resolution method="contradicao">Passo a passo</Resolution>);

    const button = screen.getByRole("button", { name: "Ver resolução por contradição" });
    await userEvent.click(button);

    expect(screen.getByRole("button", { name: "Ocultar resolução por contradição" })).toBeVisible();
  });

  it("marks its formulas to be skipped by the math copy button", () => {
    const { container } = render(<Resolution>Conteúdo</Resolution>);
    expect(container.querySelector(".no-math-copy")).not.toBeNull();
  });
});
