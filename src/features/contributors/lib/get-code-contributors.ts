import type { CodeContributor } from "../contributors.types";

const REPO = "dariomatias-dev/mac-docs";

type GitHubContributor = {
  login?: string;
  html_url?: string;
  avatar_url?: string;
  contributions?: number;
  type?: string;
};

export async function getCodeContributors(): Promise<CodeContributor[]> {
  const response = await fetch(`https://api.github.com/repos/${REPO}/contributors?per_page=100`, {
    headers: { Accept: "application/vnd.github+json" },
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as GitHubContributor[];

  return data
    .filter((entry) => entry.type === "User" && entry.login && entry.html_url && entry.avatar_url)
    .map((entry) => ({
      login: entry.login!,
      htmlUrl: entry.html_url!,
      avatarUrl: entry.avatar_url!,
      contributions: entry.contributions ?? 0,
    }));
}
