import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "../badge";

describe("Badge", () => {
  it("renders its content as inline text", () => {
    render(<Badge>Unicamp 2018, adaptada — 1,0 pt</Badge>);
    expect(screen.getByText("Unicamp 2018, adaptada — 1,0 pt")).toBeInTheDocument();
  });
});
