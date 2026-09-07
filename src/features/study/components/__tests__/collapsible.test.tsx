import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Collapsible } from "../collapsible";

describe("Collapsible", () => {
  it("starts collapsed by default", () => {
    render(<Collapsible title="Mostrar mais">Detalhe</Collapsible>);
    expect(screen.getByRole("button", { name: "Mostrar mais" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("starts expanded when defaultOpen is true", () => {
    render(
      <Collapsible title="Mostrar mais" defaultOpen>
        Detalhe
      </Collapsible>,
    );
    expect(screen.getByRole("button", { name: "Mostrar mais" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("toggles aria-expanded on click, back and forth", async () => {
    render(<Collapsible title="Mostrar mais">Detalhe</Collapsible>);
    const button = screen.getByRole("button", { name: "Mostrar mais" });

    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});
