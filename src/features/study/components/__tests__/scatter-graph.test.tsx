import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScatterGraph } from "../scatter-graph";

describe("ScatterGraph", () => {
  it("plots one circle per point", () => {
    const { container } = render(
      <ScatterGraph label="(a)" xMax="3" yMax="5" points="1,1 2,3 3,5" />,
    );
    expect(container.querySelectorAll("circle")).toHaveLength(3);
  });

  it("renders the label", () => {
    const { container } = render(
      <ScatterGraph label="(a)" xMax="3" yMax="5" points="1,1 2,3 3,5" />,
    );
    const label = container.querySelector("text");
    expect(label).toHaveTextContent("(a)");
  });

  it("sizes the viewBox from xMax/yMax", () => {
    const { container } = render(<ScatterGraph label="(d)" xMax="4" yMax="5" points="1,1" />);
    const svg = container.querySelector("svg");
    // marginLeft(22) + 4*22 + marginRight(10) = 120; marginTop(22) + 5*22 + marginBottom(20) = 152
    expect(svg).toHaveAttribute("viewBox", "0 0 120 152");
  });
});
