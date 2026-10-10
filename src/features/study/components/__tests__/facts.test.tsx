import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Facts, parseFacts } from "../facts";

const list = (
  <ul>
    <li>
      <strong>Curso:</strong> Análise e Desenvolvimento de Sistemas
    </li>
    <li>
      <strong>Pré-requisito:</strong> Nenhum
    </li>
  </ul>
);

describe("parseFacts", () => {
  it("splits each item into its bold label and the value after it", () => {
    expect(parseFacts(list)).toEqual([
      { label: "Curso", value: ["Análise e Desenvolvimento de Sistemas"] },
      { label: "Pré-requisito", value: ["Nenhum"] },
    ]);
  });

  it("gives up on lists that aren't in the label: value shape", () => {
    expect(
      parseFacts(
        <ul>
          <li>Item solto</li>
        </ul>,
      ),
    ).toEqual([]);
  });
});

describe("Facts", () => {
  it("renders each fact as a labelled term", () => {
    render(<Facts>{list}</Facts>);
    const terms = screen.getAllByRole("term");
    expect(terms.map((term) => term.textContent)).toEqual(["Curso", "Pré-requisito"]);
    expect(screen.getByText("Nenhum")).toBeInTheDocument();
  });

  it("falls back to the plain list when it can't be parsed", () => {
    render(
      <Facts>
        <ul>
          <li>Item solto</li>
        </ul>
      </Facts>,
    );
    expect(screen.getByRole("listitem")).toHaveTextContent("Item solto");
  });
});
