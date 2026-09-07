import { z } from "zod";

// Length limits follow common SEO guidance: search engines truncate a
// <title> around 60 characters and a meta description around 160.
export const frontmatterSchema = z.object({
  title: z.string().min(1).max(60),
  description: z.string().min(1).max(160),
  order: z.number().int().optional(),
  prerequisites: z.array(z.string().startsWith("/docs/")).optional(),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;
