import { z } from "zod";

export const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().optional(),
  prerequisites: z.array(z.string().startsWith("/docs/")).optional(),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;
