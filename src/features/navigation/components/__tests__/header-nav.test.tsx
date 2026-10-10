import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { usePathnameMock } = vi.hoisted(() => ({ usePathnameMock: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: usePathnameMock }));

import { HeaderNav } from "../header-nav";

describe("HeaderNav", () => {
  beforeEach(() => {
    usePathnameMock.mockReset();
  });

  it("links to the material, annotations and contributors pages", () => {
    usePathnameMock.mockReturnValue("/");
    render(<HeaderNav />);
    expect(screen.getByRole("link", { name: "Material" })).toHaveAttribute(
      "href",
      "/docs/matematica-discreta",
    );
    expect(screen.getByRole("link", { name: "Anotações" })).toHaveAttribute("href", "/anotacoes");
    expect(screen.getByRole("link", { name: "Contribuidores" })).toHaveAttribute(
      "href",
      "/contribuidores",
    );
  });

  it("marks the link for the current page", () => {
    usePathnameMock.mockReturnValue("/anotacoes");
    render(<HeaderNav />);
    expect(screen.getByRole("link", { name: "Anotações" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Material" })).not.toHaveAttribute("aria-current");
  });

  it("keeps a section link current on its nested pages", () => {
    usePathnameMock.mockReturnValue("/docs/matematica-discreta/matrizes");
    render(<HeaderNav />);
    expect(screen.getByRole("link", { name: "Material" })).toHaveAttribute("aria-current", "page");
  });
});
