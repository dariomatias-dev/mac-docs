import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Question } from "../question";

describe("Question", () => {
  it("renders its children, with no title bar of its own", () => {
    render(
      <Question>
        <p>Sejam a e b números reais</p>
      </Question>,
    );
    expect(screen.getByText("Sejam a e b números reais")).toBeInTheDocument();
    // Number/source/points live in the heading above — Question must
    // not render its own "Questão N" label.
    expect(screen.queryByText(/questão/i)).toBeNull();
    expect(screen.queryByRole("heading")).toBeNull();
  });
});
