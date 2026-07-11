import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Proof } from "../proof";

describe("Proof", () => {
  it("renders its children", () => {
    render(
      <Proof>
        <p>A ⊆ B ⟺ (∀x)(x ∈ A ⇒ x ∈ B)</p>
      </Proof>,
    );
    expect(screen.getByText("A ⊆ B ⟺ (∀x)(x ∈ A ⇒ x ∈ B)")).toBeInTheDocument();
  });

  it("marks its formulas to be skipped by the math copy button", () => {
    const { container } = render(<Proof>Conteúdo</Proof>);
    expect(container.querySelector(".no-math-copy")).not.toBeNull();
  });
});
