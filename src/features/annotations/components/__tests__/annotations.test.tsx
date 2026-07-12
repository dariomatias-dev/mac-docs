import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { Annotations } from "../annotations";

describe("Annotations", () => {
  beforeEach(() => localStorage.clear());

  it("opens the panel from the floating button and hides the button while open", async () => {
    render(<Annotations slug="page-a" />);

    const openButton = screen.getByRole("button", { name: "Abrir anotações" });
    await userEvent.click(openButton);

    expect(screen.queryByRole("button", { name: "Abrir anotações" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fechar anotações" })).toBeInTheDocument();
  });

  it("shows no badge with zero annotations, and an updated count after adding one", async () => {
    render(<Annotations slug="page-b" />);

    expect(screen.queryByText("1")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Abrir anotações" }));
    await userEvent.type(screen.getByPlaceholderText(/escreva uma anotação/i), "minha nota");
    await userEvent.click(screen.getByRole("button", { name: "Adicionar" }));
    await userEvent.click(screen.getByRole("button", { name: "Fechar anotações" }));

    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
