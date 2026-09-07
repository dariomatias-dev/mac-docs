import path from "node:path";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { REPO_BRANCH, REPO_URL } from "@/shared/lib/content-config";

import { EditPageLink } from "../edit-page-link";

describe("EditPageLink", () => {
  it("links to the file's GitHub edit URL, relative to the repo root", () => {
    const file = path.join(process.cwd(), "content", "curso", "pagina.mdx");
    render(<EditPageLink filePath={file} />);

    expect(screen.getByRole("link", { name: /editar esta página/i })).toHaveAttribute(
      "href",
      `${REPO_URL}/edit/${REPO_BRANCH}/content/curso/pagina.mdx`,
    );
  });
});
