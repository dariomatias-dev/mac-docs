import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { getSidebarTree } from "@/features/navigation";

import Home from "../page";

describe("Home", () => {
  it("renders the hero heading and a CTA to the first topic", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Matemática discreta, do conceito à prova.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Começar agora/ })).toHaveAttribute(
      "href",
      "/docs/matematica-discreta/matrizes",
    );
  });

  it("links every module from the sidebar tree", () => {
    render(<Home />);

    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"));
    const groups = getSidebarTree().flatMap((course) => course.groups);
    for (const group of groups) {
      expect(hrefs).toContain(group.href);
    }
  });

  it("shows a formula tile per study module", () => {
    render(<Home />);

    const tiles = screen.getByRole("list", { name: "Módulos" });
    for (const title of ["Matrizes", "Conjuntos", "Relações", "Funções"]) {
      expect(tiles).toHaveTextContent(title);
    }
  });
});
