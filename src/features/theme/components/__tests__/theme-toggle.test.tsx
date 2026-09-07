import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const { useThemeMock } = vi.hoisted(() => ({ useThemeMock: vi.fn() }));
vi.mock("next-themes", () => ({ useTheme: useThemeMock }));

import { ThemeToggle } from "../theme-toggle";

describe("ThemeToggle", () => {
  it("switches from dark to light", async () => {
    const setTheme = vi.fn();
    useThemeMock.mockReturnValue({ resolvedTheme: "dark", setTheme });

    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole("button", { name: "Alternar tema" }));

    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("switches from light to dark", async () => {
    const setTheme = vi.fn();
    useThemeMock.mockReturnValue({ resolvedTheme: "light", setTheme });

    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole("button", { name: "Alternar tema" }));

    expect(setTheme).toHaveBeenCalledWith("dark");
  });
});
