import { z } from "zod";

// Length limits follow common SEO guidance: search engines truncate a
// <title> around 60 characters and a meta description around 160.
export const frontmatterSchema = z.object({
  title: z.string().min(1).max(60),
  description: z.string().min(1).max(160),
  order: z.number().int().optional(),
  prerequisites: z.array(z.string().startsWith("/docs/")).optional(),
  // On a group's index.mdx: "resource" marks course material that isn't a
  // subject (course plan, assessments). It's listed apart in the sidebar
  // and doesn't count in the module numbering. Defaults to "module".
  kind: z.enum(["module", "resource"]).optional(),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;
