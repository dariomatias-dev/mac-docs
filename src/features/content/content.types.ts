import type { Frontmatter } from "./lib/frontmatter-schema";

export interface Doc {
  slug: string[];
  url: string;
  frontmatter: Frontmatter;
  content: string;
  filePath: string;
  isSection: boolean;
}
