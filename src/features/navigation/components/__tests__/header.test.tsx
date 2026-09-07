import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActiveMobileSheetProvider } from "@/shared/providers/active-mobile-sheet-provider";

import { Header } from "../header";

import type { ReactNode } from "react";

vi.mock("next/navigation", () => ({ usePathname: () => "/docs/matrizes" }));
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn(), resolvedTheme: "light" }),
}));

function renderHeader(props: { search?: ReactNode; searchMobile?: ReactNode } = {}) {
  return render(
    <ActiveMobileSheetProvider>
      <Header {...props} />
    </ActiveMobileSheetProvider>,
  );
}

describe("Header", () => {
  it("renders the logo, nav links, and controls", () => {
    renderHeader();

    expect(screen.getByRole("link", { name: /macdocs — página inicial/i })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: /anotações/i })).toHaveAttribute("href", "/anotacoes");
    expect(screen.getByRole("link", { name: /contribuidores/i })).toHaveAttribute(
      "href",
      "/contribuidores",
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com",
    );
  });

  it("does not render a desktop search slot or mobile search bar by default", () => {
    renderHeader();
    expect(screen.queryByText("busca desktop")).not.toBeInTheDocument();
    expect(screen.queryByText("busca mobile")).not.toBeInTheDocument();
  });

  it("renders the desktop search slot when given", () => {
    renderHeader({ search: <div>busca desktop</div> });
    expect(screen.getByText("busca desktop")).toBeInTheDocument();
  });

  it("renders the mobile search slot when given", () => {
    renderHeader({ searchMobile: <div>busca mobile</div> });
    expect(screen.getByText("busca mobile")).toBeInTheDocument();
  });
});
