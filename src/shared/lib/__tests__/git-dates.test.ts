import { execFileSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

import { getGitDates, getLatestContentDate } from "../git-dates";

// Must be a static import above (not a dynamic import() inside a test), and
// the factory must mirror both the named and default export with the SAME
// function reference. Otherwise git-dates.ts's own binding to execFileSync
// resolves to the real Node implementation instead of this mock, and
// `git log` runs for real against this repository.
vi.mock("node:child_process", () => {
  const execFileSync = vi.fn();
  return { execFileSync, default: { execFileSync } };
});

const mockedExecFileSync = vi.mocked(execFileSync);

function abs(relative: string): string {
  return path.join(process.cwd(), relative);
}

// `git log --format=%cI --name-only -- content` prints newest commit first:
// a commit date line, then the files it touched, repeated per commit.
function fakeLog(entries: [date: string, files: string[]][]): string {
  return entries.map(([date, files]) => [date, ...files].join("\n")).join("\n\n");
}

describe("getGitDates", () => {
  it("uses the newest commit's date as modified and the oldest as created", () => {
    mockedExecFileSync.mockReturnValue(
      fakeLog([
        ["2024-03-01T10:00:00-03:00", ["content/a.mdx"]],
        ["2024-02-01T10:00:00-03:00", ["content/a.mdx", "content/b.mdx"]],
        ["2024-01-01T10:00:00-03:00", ["content/a.mdx"]],
      ]),
    );

    const a = getGitDates(abs("content/a.mdx"));
    expect(a?.modified.toISOString()).toBe(new Date("2024-03-01T10:00:00-03:00").toISOString());
    expect(a?.created.toISOString()).toBe(new Date("2024-01-01T10:00:00-03:00").toISOString());

    const b = getGitDates(abs("content/b.mdx"));
    expect(b?.modified.toISOString()).toBe(new Date("2024-02-01T10:00:00-03:00").toISOString());
    expect(b?.created.toISOString()).toBe(new Date("2024-02-01T10:00:00-03:00").toISOString());
  });

  it("returns undefined for a file that was never committed", () => {
    mockedExecFileSync.mockReturnValue(fakeLog([["2024-01-01T10:00:00-03:00", ["content/a.mdx"]]]));
    expect(getGitDates(abs("content/never-committed.mdx"))).toBeUndefined();
  });

  it("returns undefined when git history is unavailable", () => {
    mockedExecFileSync.mockImplementation(() => {
      throw new Error("fatal: not a git repository");
    });
    expect(getGitDates(abs("content/a.mdx"))).toBeUndefined();
  });
});

describe("getLatestContentDate", () => {
  it("returns the most recent modification across every tracked file", () => {
    mockedExecFileSync.mockReturnValue(
      fakeLog([
        ["2024-05-01T10:00:00-03:00", ["content/newer.mdx"]],
        ["2024-01-01T10:00:00-03:00", ["content/older.mdx"]],
      ]),
    );
    expect(getLatestContentDate()?.toISOString()).toBe(
      new Date("2024-05-01T10:00:00-03:00").toISOString(),
    );
  });

  it("returns undefined when git history is unavailable", () => {
    mockedExecFileSync.mockImplementation(() => {
      throw new Error("git not found");
    });
    expect(getLatestContentDate()).toBeUndefined();
  });
});
