import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const { usePathnameMock, toggleMock } = vi.hoisted(() => ({
  usePathnameMock: vi.fn(),
  toggleMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({ usePathname: usePathnameMock }));
vi.mock("../../providers/sidebar-mobile-provider", () => ({
  useSidebarMobile: () => ({ open: false, toggle: toggleMock }),
}));

import { MobileMenuButton } from "../mobile-menu-button";

describe("MobileMenuButton", () => {
  it("renders nothing outside of /docs", () => {
    usePathnameMock.mockReturnValue("/anotacoes");
    const { container } = render(<MobileMenuButton />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the toggle button on a docs page", () => {
    usePathnameMock.mockReturnValue("/docs/matematica-discreta");
    render(<MobileMenuButton />);
    expect(screen.getByRole("button", { name: "Abrir menu" })).toBeInTheDocument();
  });

  it("calls toggle on click", async () => {
    usePathnameMock.mockReturnValue("/docs/matematica-discreta");
    render(<MobileMenuButton />);
    await userEvent.click(screen.getByRole("button"));
    expect(toggleMock).toHaveBeenCalledTimes(1);
  });
});
