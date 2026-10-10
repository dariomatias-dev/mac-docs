/** GitHub repository the docs live in. Kept free of Node imports so client components can use it. */
export const REPO_URL = "https://github.com/dariomatias-dev/mac-docs";
export const REPO_BRANCH = "main";

/**
 * New-issue link on GitHub that opens the "Content error" form
 * (.github/ISSUE_TEMPLATE/content_issue.yml) with the page already filled in.
 */
export function getReportIssueUrl(pageUrl: string, pageTitle: string): string {
  const params = new URLSearchParams({
    template: "content_issue.yml",
    title: `[Conteúdo] ${pageTitle}`,
    url: pageUrl,
  });
  return `${REPO_URL}/issues/new?${params.toString()}`;
}
