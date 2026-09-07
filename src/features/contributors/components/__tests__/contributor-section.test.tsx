import { render, screen } from "@testing-library/react";
import { Code2 } from "lucide-react";
import { describe, expect, it } from "vitest";

import { ContributorSection } from "../contributor-section";

describe("ContributorSection", () => {
  it("renders children in a grid when there are items", () => {
    render(
      <ContributorSection
        icon={Code2}
        title="Código"
        description="desc"
        emptyMessage="vazio"
        hasItems
      >
        <p>Item 1</p>
      </ContributorSection>,
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.queryByText("vazio")).not.toBeInTheDocument();
  });

  it("shows the empty message instead of children when there are no items", () => {
    render(
      <ContributorSection
        icon={Code2}
        title="Código"
        description="desc"
        emptyMessage="Não foi possível carregar."
        hasItems={false}
      >
        <p>Item 1</p>
      </ContributorSection>,
    );
    expect(screen.getByText("Não foi possível carregar.")).toBeInTheDocument();
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
  });

  it("renders the title and description", () => {
    render(
      <ContributorSection
        icon={Code2}
        title="Código"
        description="Por número de commits."
        emptyMessage="vazio"
        hasItems={false}
      >
        {null}
      </ContributorSection>,
    );
    expect(screen.getByRole("heading", { name: "Código" })).toBeInTheDocument();
    expect(screen.getByText("Por número de commits.")).toBeInTheDocument();
  });
});
