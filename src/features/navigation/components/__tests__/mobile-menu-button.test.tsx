import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { toggleMock, useSidebarMobileMock } = vi.hoisted(() => ({
  toggleMock: vi.fn(),
  useSidebarMobileMock: vi.fn(),
}));

vi.mock("../../providers/sidebar-mobile-provider", () => ({
  useSidebarMobile: useSidebarMobileMock,
}));

import { MobileMenuButton } from "../mobile-menu-button";

describe("MobileMenuButton", () => {
  beforeEach(() => {
    toggleMock.mockClear();
    useSidebarMobileMock.mockReturnValue({ open: false, toggle: toggleMock });
  });

  it("renders the toggle button", () => {
    render(<MobileMenuButton />);
    expect(screen.getByRole("button", { name: "Abrir menu" })).toBeInTheDocument();
  });

  it("calls toggle on click", async () => {
    render(<MobileMenuButton />);
    await userEvent.click(screen.getByRole("button"));
    expect(toggleMock).toHaveBeenCalledTimes(1);
  });

  it("reflects the drawer state through aria-expanded", () => {
    const { rerender } = render(<MobileMenuButton />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");

    useSidebarMobileMock.mockReturnValue({ open: true, toggle: toggleMock });
    rerender(<MobileMenuButton />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });
});
