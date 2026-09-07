import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CodeContributorsSkeleton } from "../code-contributors-skeleton";

describe("CodeContributorsSkeleton", () => {
  it("renders 6 placeholder cards", () => {
    const { container } = render(<CodeContributorsSkeleton />);
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(18);
  });

  it("shows the section title", () => {
    render(<CodeContributorsSkeleton />);
    expect(screen.getByRole("heading", { name: "Código" })).toBeInTheDocument();
  });
});
