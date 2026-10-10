import { describe, expect, it } from "vitest";

import { getReportIssueUrl, REPO_URL } from "../repo";

describe("getReportIssueUrl", () => {
  it("opens the content error form prefilled with the page", () => {
    const url = new URL(getReportIssueUrl("https://site.dev/docs/a", "Matrizes"));
    expect(`${url.origin}${url.pathname}`).toBe(`${REPO_URL}/issues/new`);
    expect(url.searchParams.get("template")).toBe("content_issue.yml");
    expect(url.searchParams.get("url")).toBe("https://site.dev/docs/a");
    expect(url.searchParams.get("title")).toBe("[Conteúdo] Matrizes");
  });
});
