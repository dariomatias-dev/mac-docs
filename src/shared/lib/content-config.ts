import path from "node:path";

export const CONTENT_DIR = path.join(process.cwd(), "content");

/** GitHub repository the docs live in, used to build "edit this page" links. */
export const REPO_URL = "https://github.com/dariomatias-dev/mac-docs";
export const REPO_BRANCH = "main";

/** Build the GitHub edit URL for a content file given its absolute path. */
export function getEditUrl(filePath: string): string {
  const relative = path.relative(process.cwd(), filePath).split(path.sep).join("/");
  return `${REPO_URL}/edit/${REPO_BRANCH}/${relative}`;
}
