import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Alternative, Alternatives } from "../alternatives";

describe("Alternatives", () => {
  it("labels each option a, b, c... by position, not by content", () => {
    render(
      <Alternatives>
        <Alternative>Primeira</Alternative>
        <Alternative>Segunda</Alternative>
        <Alternative>Terceira</Alternative>
      </Alternatives>,
    );

    const items = screen.getAllByRole("listitem");
    expect(items.map((li) => li.textContent)).toEqual(["a)Primeira", "b)Segunda", "c)Terceira"]);
  });

  it("renders no buttons: it's a static list, not an interactive quiz", () => {
    render(
      <Alternatives>
        <Alternative>Única</Alternative>
      </Alternatives>,
    );
    expect(screen.queryByRole("button")).toBeNull();
  });
});
