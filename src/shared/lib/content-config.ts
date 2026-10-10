import path from "node:path";

import { REPO_BRANCH, REPO_URL } from "./repo";

export { REPO_BRANCH, REPO_URL };

export const CONTENT_DIR = path.join(process.cwd(), "content");

/** Build the GitHub edit URL for a content file given its absolute path. */
export function getEditUrl(filePath: string): string {
  const relative = path.relative(process.cwd(), filePath).split(path.sep).join("/");
  return `${REPO_URL}/edit/${REPO_BRANCH}/${relative}`;
}
