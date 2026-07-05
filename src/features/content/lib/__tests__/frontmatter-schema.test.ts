import { describe, expect, it } from "vitest";

import { frontmatterSchema } from "../frontmatter-schema";

describe("frontmatterSchema", () => {
  it("accepts a minimal valid frontmatter", () => {
    const parsed = frontmatterSchema.parse({ title: "Limites" });
    expect(parsed.title).toBe("Limites");
  });

  it("accepts optional fields", () => {
    const parsed = frontmatterSchema.parse({
      title: "Limites",
      description: "Uma descrição",
      order: 2,
      prerequisites: ["/docs/calculo-1/limites"],
    });
    expect(parsed.order).toBe(2);
    expect(parsed.prerequisites).toEqual(["/docs/calculo-1/limites"]);
  });

  it("rejects an empty title", () => {
    expect(frontmatterSchema.safeParse({ title: "" }).success).toBe(false);
  });

  it("rejects prerequisites that are not /docs/ paths", () => {
    const result = frontmatterSchema.safeParse({
      title: "Limites",
      prerequisites: ["/outra/rota"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-integer order", () => {
    expect(frontmatterSchema.safeParse({ title: "X", order: 1.5 }).success).toBe(false);
  });
});
