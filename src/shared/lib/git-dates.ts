import { execFileSync } from "node:child_process";
import path from "node:path";
import { cache } from "react";

export type GitDates = {
  /** First commit that introduced the file. */
  created: Date;
  /** Most recent commit that touched the file. */
  modified: Date;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T/;

/**
 * Creation and modification dates of every tracked file under `content`,
 * keyed by repository-relative path. Empty when git history is unavailable.
 */
const gitDates = cache((): Map<string, GitDates> => {
  const dates = new Map<string, GitDates>();

  let log: string;
  try {
    log = execFileSync("git", ["log", "--format=%cI", "--name-only", "--", "content"], {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch {
    return dates;
  }

  let commitDate = "";
  for (const line of log.split("\n")) {
    const entry = line.trim();
    if (!entry) continue;

    if (ISO_DATE.test(entry)) {
      commitDate = entry;
      continue;
    }

    const existing = dates.get(entry);
    if (existing) {
      existing.created = new Date(commitDate);
    } else {
      dates.set(entry, { created: new Date(commitDate), modified: new Date(commitDate) });
    }
  }

  return dates;
});

/** Git creation/modification dates for a content file, or undefined when unknown. */
export function getGitDates(filePath: string): GitDates | undefined {
  const relative = path.relative(process.cwd(), filePath).split(path.sep).join("/");
  return gitDates().get(relative);
}

/** Most recent modification across every tracked content file. */
export function getLatestContentDate(): Date | undefined {
  let latest: Date | undefined;
  for (const { modified } of gitDates().values()) {
    if (!latest || modified > latest) latest = modified;
  }
  return latest;
}
