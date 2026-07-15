import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { ActiveMobileSheetProvider } from "@/shared/providers/active-mobile-sheet-provider";

import { Annotations } from "../annotations";

function renderAnnotations(slug: string) {
  return render(
    <ActiveMobileSheetProvider>
      <Annotations slug={slug} />
    </ActiveMobileSheetProvider>,
  );
}

describe("Annotations", () => {
  beforeEach(() => localStorage.clear());

  it("opens the panel from the floating button and hides the button while open", async () => {
    renderAnnotations("page-a");

    const openButton = screen.getByRole("button", { name: "Abrir anotações" });
    await userEvent.click(openButton);

    expect(screen.queryByRole("button", { name: "Abrir anotações" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fechar anotações" })).toBeInTheDocument();
  });

  it("shows no badge with zero annotations, and an updated count after adding one", async () => {
    renderAnnotations("page-b");

    expect(screen.queryByText("1")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Abrir anotações" }));
    await userEvent.type(screen.getByPlaceholderText(/escreva uma anotação/i), "minha nota");
    await userEvent.click(screen.getByRole("button", { name: "Adicionar" }));
    await userEvent.click(screen.getByRole("button", { name: "Fechar anotações" }));

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("toggles the panel with Ctrl/Cmd+Shift+A", async () => {
    renderAnnotations("page-c");

    await userEvent.keyboard("{Control>}{Shift>}a{/Shift}{/Control}");
    expect(screen.getByRole("button", { name: "Fechar anotações" })).toBeInTheDocument();

    await userEvent.keyboard("{Control>}{Shift>}a{/Shift}{/Control}");
    expect(screen.queryByRole("button", { name: "Fechar anotações" })).not.toBeInTheDocument();
  });
});
