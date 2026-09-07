import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Breadcrumbs } from "../breadcrumbs";

describe("Breadcrumbs", () => {
  it("renders nothing for an empty trail", () => {
    const { container } = render(<Breadcrumbs items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a single crumb without a leading separator", () => {
    render(<Breadcrumbs items={[{ title: "Matemática Discreta", href: "/docs/a" }]} />);
    expect(screen.getByText("Matemática Discreta")).toBeInTheDocument();
    expect(screen.queryByText("›")).not.toBeInTheDocument();
  });

  it("separates multiple crumbs and links every one that has an href", () => {
    render(
      <Breadcrumbs
        items={[
          { title: "Matemática Discreta", href: "/docs/a" },
          { title: "Matrizes", href: "/docs/a/b" },
          { title: "Operações" },
        ]}
      />,
    );

    expect(screen.getAllByText("›")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Matemática Discreta" })).toHaveAttribute(
      "href",
      "/docs/a",
    );
    expect(screen.getByRole("link", { name: "Matrizes" })).toHaveAttribute("href", "/docs/a/b");
    expect(screen.queryByRole("link", { name: "Operações" })).not.toBeInTheDocument();
    expect(screen.getByText("Operações")).toBeInTheDocument();
  });
});
