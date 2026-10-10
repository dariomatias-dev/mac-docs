import { render, screen } from "@testing-library/react";
import { Calculator } from "lucide-react";
import { describe, expect, it } from "vitest";

import { Panel } from "../panel";

describe("Panel", () => {
  it("renders its title and content", () => {
    render(
      <Panel icon={Calculator} title="Calculadora">
        <p>Corpo</p>
      </Panel>,
    );
    expect(screen.getByText("Calculadora")).toBeInTheDocument();
    expect(screen.getByText("Corpo")).toBeInTheDocument();
  });

  it("renders a header action when given", () => {
    render(
      <Panel icon={Calculator} title="Calculadora" action={<button type="button">Gerar</button>}>
        <p>Corpo</p>
      </Panel>,
    );
    expect(screen.getByRole("button", { name: "Gerar" })).toBeInTheDocument();
  });
});
