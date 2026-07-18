export function getGithubAvatarUrl(githubUrl?: string): string | undefined {
  if (!githubUrl) return undefined;

  const username = githubUrl.replace(/\/+$/, "").split("/").pop();
  return username ? `https://github.com/${username}.png` : undefined;
}
