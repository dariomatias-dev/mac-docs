import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContributorCard } from "../contributor-card";

describe("ContributorCard", () => {
  it("renders as a link when href is given", () => {
    render(<ContributorCard name="Dário" subtitle="42 commits" href="https://github.com/dario" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://github.com/dario");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders as a plain container without an href", () => {
    render(<ContributorCard name="Dário" subtitle="Monitor" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Dário")).toBeInTheDocument();
  });

  it("shows the avatar image when given one", () => {
    render(<ContributorCard name="Dário" subtitle="42 commits" avatarUrl="https://a.png" />);
    expect(screen.getByRole("img", { name: "Dário" })).toHaveAttribute("src", "https://a.png");
  });

  it("falls back to the name's initial when there's no avatar", () => {
    render(<ContributorCard name="dário" subtitle="42 commits" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("D")).toBeInTheDocument();
  });
});
