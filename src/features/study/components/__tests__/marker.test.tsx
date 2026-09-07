import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Marker } from "../marker";

describe("Marker", () => {
  it("renders whatever label it's given", () => {
    render(<Marker>1</Marker>);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("accepts non-numeric labels like letters or roman numerals", () => {
    render(<Marker>IV</Marker>);
    expect(screen.getByText("IV")).toBeInTheDocument();
  });
});
