import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { usePathnameMock, toggleMock, useSidebarMobileMock } = vi.hoisted(() => ({
  usePathnameMock: vi.fn(),
  toggleMock: vi.fn(),
  useSidebarMobileMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({ usePathname: usePathnameMock }));
vi.mock("../../providers/sidebar-mobile-provider", () => ({
  useSidebarMobile: useSidebarMobileMock,
}));

import { MobileMenuButton } from "../mobile-menu-button";

describe("MobileMenuButton", () => {
  beforeEach(() => {
    useSidebarMobileMock.mockReturnValue({ open: false, toggle: toggleMock });
  });

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

  it("shows the close label and icon state once the sidebar is open", () => {
    usePathnameMock.mockReturnValue("/docs/matematica-discreta");
    useSidebarMobileMock.mockReturnValue({ open: true, toggle: toggleMock });
    render(<MobileMenuButton />);
    expect(screen.getByRole("button", { name: "Fechar menu" })).toBeInTheDocument();
  });
});
