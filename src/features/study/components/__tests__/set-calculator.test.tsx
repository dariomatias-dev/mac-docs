import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SetCalculator } from "../set-calculator";

describe("SetCalculator", () => {
  it("computes the union of the default sets", () => {
    render(<SetCalculator />);
    expect(screen.getByText("{ 1, 2, 3, 4, 5, 6 }")).toBeInTheDocument();
  });

  it("recomputes when switching operations", async () => {
    render(<SetCalculator />);

    await userEvent.click(screen.getByRole("button", { name: "A ∩ B" }));
    expect(screen.getByText("{ 3, 4 }")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "A − B" }));
    expect(screen.getByText("{ 1, 2 }")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "B − A" }));
    expect(screen.getByText("{ 5, 6 }")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "A △ B" }));
    expect(screen.getByText("{ 1, 2, 5, 6 }")).toBeInTheDocument();
  });

  it("recomputes as the sets are edited", async () => {
    render(<SetCalculator />);

    const fieldA = screen.getByLabelText("Conjunto A");
    await userEvent.clear(fieldA);
    await userEvent.type(fieldA, "x, y");

    const fieldB = screen.getByLabelText("Conjunto B");
    await userEvent.clear(fieldB);
    await userEvent.type(fieldB, "y, z");

    expect(screen.getByText("{ x, y, z }")).toBeInTheDocument();
  });

  it("ignores blank entries and duplicates when parsing a set", async () => {
    render(<SetCalculator />);

    const fieldA = screen.getByLabelText("Conjunto A");
    await userEvent.clear(fieldA);
    await userEvent.type(fieldA, "1, 1, , 2");

    await userEvent.clear(screen.getByLabelText("Conjunto B"));

    expect(screen.getByText("{ 1, 2 }")).toBeInTheDocument();
  });

  it("shows the empty-set symbol when the result has no elements", async () => {
    render(<SetCalculator />);

    const fieldA = screen.getByLabelText("Conjunto A");
    await userEvent.clear(fieldA);
    await userEvent.type(fieldA, "1, 2");

    const fieldB = screen.getByLabelText("Conjunto B");
    await userEvent.clear(fieldB);
    await userEvent.type(fieldB, "1, 2");

    await userEvent.click(screen.getByRole("button", { name: "A − B" }));

    expect(screen.getByText("∅")).toBeInTheDocument();
  });

  it("renders the Venn diagram with an accessible label", () => {
    render(<SetCalculator />);
    expect(screen.getByRole("img", { name: /diagrama de venn/i })).toBeInTheDocument();
  });

  it("truncates a Venn diagram region's label past 6 elements", async () => {
    render(<SetCalculator />);

    const fieldA = screen.getByLabelText("Conjunto A");
    await userEvent.clear(fieldA);
    await userEvent.type(fieldA, "1, 2, 3, 4, 5, 6, 7");

    await userEvent.clear(screen.getByLabelText("Conjunto B"));

    expect(screen.getByText("1, 2, 3, 4, 5, 6…")).toBeInTheDocument();
  });
});
