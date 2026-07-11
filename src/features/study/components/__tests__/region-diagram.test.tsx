import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RegionDiagram } from "../region-diagram";

describe("RegionDiagram", () => {
  it("labels all four regions R1-R4", () => {
    const { container } = render(
      <RegionDiagram xMax="5" yMax="7" xSplit="3" ySplit="5" highlight="top-left" />,
    );
    const labels = Array.from(container.querySelectorAll("text")).map((n) => n.textContent);
    expect(labels).toEqual(expect.arrayContaining(["R₁", "R₂", "R₃", "R₄"]));
  });

  it("draws a highlight rect only for the highlighted region", () => {
    const { container } = render(
      <RegionDiagram xMax="5" yMax="7" xSplit="3" ySplit="5" highlight="top-left" />,
    );
    expect(container.querySelectorAll("rect")).toHaveLength(1);
  });

  it("sizes the viewBox from xMax/yMax", () => {
    const { container } = render(
      <RegionDiagram xMax="5" yMax="7" xSplit="3" ySplit="5" highlight="bottom-right" />,
    );
    const svg = container.querySelector("svg");
    // marginLeft(28) + 5*36 + marginRight(12) = 220; marginTop(12) + 7*36 + marginBottom(24) = 288
    expect(svg).toHaveAttribute("viewBox", "0 0 220 288");
  });
});
