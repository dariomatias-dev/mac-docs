import { describe, expect, it } from "vitest";

import { getGithubAvatarUrl } from "../get-github-avatar-url";

describe("getGithubAvatarUrl", () => {
  it("returns undefined when no URL is given", () => {
    expect(getGithubAvatarUrl(undefined)).toBeUndefined();
  });

  it("builds the avatar URL from the username in the profile URL", () => {
    expect(getGithubAvatarUrl("https://github.com/octocat")).toBe("https://github.com/octocat.png");
  });

  it("ignores a trailing slash", () => {
    expect(getGithubAvatarUrl("https://github.com/octocat/")).toBe(
      "https://github.com/octocat.png",
    );
  });
});
