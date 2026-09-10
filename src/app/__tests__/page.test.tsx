import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { getSidebarTree } from "@/features/navigation";

import Home from "../page";

describe("Home", () => {
  it("renders the hero heading and a CTA to the first topic", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Documentação interativa de Matemática Aplicada à Computação",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Começar agora/ })).toHaveAttribute(
      "href",
      "/docs/matematica-discreta/matrizes",
    );
  });

  it("lists every module from the sidebar tree with a link to its href", () => {
    render(<Home />);

    const table = within(screen.getByRole("table"));
    const modules = getSidebarTree().flatMap((course) => course.groups);
    for (const mod of modules) {
      expect(table.getByRole("link", { name: mod.title })).toHaveAttribute("href", mod.href);
    }
  });
});
