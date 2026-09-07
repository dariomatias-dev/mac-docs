import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { getCodeContributorsMock } = vi.hoisted(() => ({ getCodeContributorsMock: vi.fn() }));
vi.mock("../../lib/get-code-contributors", () => ({
  getCodeContributors: getCodeContributorsMock,
}));

import { CodeContributorsSection } from "../code-contributors-section";

describe("CodeContributorsSection", () => {
  it("renders a card per contributor, singular commit count for exactly 1", async () => {
    getCodeContributorsMock.mockResolvedValue([
      { login: "dario", contributions: 1, htmlUrl: "https://github.com/dario", avatarUrl: "" },
    ]);

    render(await CodeContributorsSection());

    expect(screen.getByText("dario")).toBeInTheDocument();
    expect(screen.getByText("1 commit")).toBeInTheDocument();
  });

  it("pluralizes the commit count for more than 1", async () => {
    getCodeContributorsMock.mockResolvedValue([
      { login: "dario", contributions: 5, htmlUrl: "https://github.com/dario", avatarUrl: "" },
    ]);

    render(await CodeContributorsSection());

    expect(screen.getByText("5 commits")).toBeInTheDocument();
  });

  it("shows the empty message when the GitHub API returns nothing", async () => {
    getCodeContributorsMock.mockResolvedValue([]);

    render(await CodeContributorsSection());

    expect(
      screen.getByText("Não foi possível carregar os contribuidores do GitHub."),
    ).toBeInTheDocument();
  });
});
