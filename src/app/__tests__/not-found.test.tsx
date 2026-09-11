import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotFound from "../not-found";

describe("NotFound", () => {
  it("offers a way back to the home page and to the docs", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { name: "Página não encontrada" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Voltar ao início/ })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /Explorar a documentação/ })).toHaveAttribute(
      "href",
      "/docs/matematica-discreta",
    );
  });
});
