import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "../footer";

describe("Footer", () => {
  it("links to the author's real GitHub profile", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: "dariomatias-dev" });
    expect(link).toHaveAttribute("href", "https://github.com/dariomatias-dev");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("shows the current year in the copyright line", () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(`${new Date().getFullYear()}`))).toBeInTheDocument();
  });
});
