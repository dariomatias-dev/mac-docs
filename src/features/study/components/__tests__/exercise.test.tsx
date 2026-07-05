import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Answer, Exercise } from "../exercise";

describe("Exercise", () => {
  it("toggles the answer visibility on button click", async () => {
    render(
      <Exercise>
        <p>Pergunta</p>
        <Answer>Resposta</Answer>
      </Exercise>,
    );

    const button = screen.getByRole("button", { name: /ver resposta/i });
    expect(button).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(button);

    const toggled = screen.getByRole("button", { name: /ocultar resposta/i });
    expect(toggled).toHaveAttribute("aria-expanded", "true");
  });
});
