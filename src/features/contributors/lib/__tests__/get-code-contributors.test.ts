import { afterEach, describe, expect, it, vi } from "vitest";

import { getCodeContributors } from "../get-code-contributors";

describe("getCodeContributors", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns an empty list when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    expect(await getCodeContributors()).toEqual([]);
  });

  it("maps and filters GitHub users, dropping bots and incomplete entries", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            login: "octocat",
            html_url: "https://github.com/octocat",
            avatar_url: "https://github.com/octocat.png",
            contributions: 10,
            type: "User",
          },
          {
            login: "some-bot",
            html_url: "https://github.com/apps/some-bot",
            avatar_url: "https://github.com/apps/some-bot.png",
            contributions: 3,
            type: "Bot",
          },
          { login: "incomplete", type: "User" },
        ],
      }),
    );

    expect(await getCodeContributors()).toEqual([
      {
        login: "octocat",
        htmlUrl: "https://github.com/octocat",
        avatarUrl: "https://github.com/octocat.png",
        contributions: 10,
      },
    ]);
  });
});
