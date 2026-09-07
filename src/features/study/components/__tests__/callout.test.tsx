import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Callout } from "../callout";

describe("Callout", () => {
  it("defaults to the tip type with its Portuguese label", () => {
    render(<Callout>Conteúdo</Callout>);
    expect(screen.getByText("Dica")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });

  it("shows the label for a given type", () => {
    render(<Callout type="caution">Conteúdo</Callout>);
    expect(screen.getByText("Cuidado")).toBeInTheDocument();
  });

  it("uses a custom title instead of the type's default label when given", () => {
    render(
      <Callout type="definition" title="Título customizado">
        Conteúdo
      </Callout>,
    );
    expect(screen.getByText("Título customizado")).toBeInTheDocument();
    expect(screen.queryByText("Definição")).not.toBeInTheDocument();
  });
});
