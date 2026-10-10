import { describe, expect, it } from "vitest";

import { getTeam, githubHandle } from "../get-team";

describe("getTeam", () => {
  it("merges people who hold more than one role", () => {
    const team = getTeam(
      [{ name: "Ana", role: "Monitor(a)", githubUrl: "https://github.com/ana" }],
      [
        { name: "Ana", role: "Material", githubUrl: "https://github.com/ana/" },
        { name: "Bia", role: "Material" },
      ],
    );

    expect(team).toEqual([
      { name: "Ana", githubUrl: "https://github.com/ana", roles: ["Monitoria", "Material"] },
      { name: "Bia", githubUrl: undefined, roles: ["Material"] },
    ]);
  });
});

describe("githubHandle", () => {
  it("turns a profile URL into an @handle", () => {
    expect(githubHandle("https://github.com/dariomatias-dev/")).toBe("@dariomatias-dev");
  });

  it("returns undefined without a URL", () => {
    expect(githubHandle()).toBeUndefined();
  });
});
