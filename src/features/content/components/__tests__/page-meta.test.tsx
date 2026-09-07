import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageMeta } from "../page-meta";

describe("PageMeta", () => {
  it("shows the reading time", () => {
    render(<PageMeta minutes={5} prerequisites={[]} />);
    expect(screen.getByText("5 min de leitura")).toBeInTheDocument();
  });

  it("hides the prerequisites section when there are none", () => {
    render(<PageMeta minutes={5} prerequisites={[]} />);
    expect(screen.queryByText("Pré-requisitos:")).not.toBeInTheDocument();
  });

  it("lists every prerequisite as a link", () => {
    render(
      <PageMeta
        minutes={5}
        prerequisites={[
          { href: "/docs/a", title: "Conjuntos" },
          { href: "/docs/b", title: "Relações" },
        ]}
      />,
    );

    expect(screen.getByText("Pré-requisitos:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Conjuntos" })).toHaveAttribute("href", "/docs/a");
    expect(screen.getByRole("link", { name: "Relações" })).toHaveAttribute("href", "/docs/b");
  });
});
