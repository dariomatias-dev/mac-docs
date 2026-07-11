import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PixelGrid } from "../pixel-grid";

describe("PixelGrid", () => {
  it("renders one cell per character, colored by 0/1", () => {
    const { container } = render(<PixelGrid columns="3" pattern="101 010" />);
    const cells = container.querySelectorAll("span span");
    expect(cells).toHaveLength(6);
    expect(cells[0]).toHaveStyle({ background: "#fff" });
    expect(cells[1]).toHaveStyle({ background: "#111" });
  });

  it("sets grid-template-columns from the columns prop", () => {
    const { container } = render(<PixelGrid columns="5" pattern="00000" />);
    expect(container.firstChild).toHaveStyle({ gridTemplateColumns: "repeat(5, 1.25rem)" });
  });

  it("ignores whitespace in the pattern", () => {
    const { container } = render(<PixelGrid columns="2" pattern={"1 1\n0 0"} />);
    expect(container.querySelectorAll("span span")).toHaveLength(4);
  });
});
