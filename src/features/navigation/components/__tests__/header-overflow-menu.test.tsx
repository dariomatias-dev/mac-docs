import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/anotacoes" }));

import { HeaderOverflowMenu } from "../header-overflow-menu";

describe("HeaderOverflowMenu", () => {
  it("starts closed", () => {
    render(<HeaderOverflowMenu />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mais opções" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("opens on click and lists both links", async () => {
    render(<HeaderOverflowMenu />);
    await userEvent.click(screen.getByRole("button", { name: "Mais opções" }));

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /anotações/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("menuitem", { name: /contribuidores/i })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("closes on Escape", async () => {
    render(<HeaderOverflowMenu />);
    await userEvent.click(screen.getByRole("button", { name: "Mais opções" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes on an outside click", async () => {
    render(
      <div>
        <div data-testid="outside" />
        <HeaderOverflowMenu />
      </div>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Mais opções" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("outside"));

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes after choosing a link", async () => {
    render(<HeaderOverflowMenu />);
    await userEvent.click(screen.getByRole("button", { name: "Mais opções" }));

    await userEvent.click(screen.getByRole("menuitem", { name: /contribuidores/i }));

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
