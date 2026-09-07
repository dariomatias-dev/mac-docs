import { describe, expect, it } from "vitest";

import { frontmatterSchema } from "../frontmatter-schema";

describe("frontmatterSchema", () => {
  it("accepts a minimal valid frontmatter", () => {
    const parsed = frontmatterSchema.parse({ title: "Limites", description: "Uma descrição." });
    expect(parsed.title).toBe("Limites");
  });

  it("rejects a missing description", () => {
    expect(frontmatterSchema.safeParse({ title: "Limites" }).success).toBe(false);
  });

  it("rejects an empty description", () => {
    expect(frontmatterSchema.safeParse({ title: "Limites", description: "" }).success).toBe(
      false,
    );
  });

  it("rejects a title longer than 60 characters", () => {
    const result = frontmatterSchema.safeParse({
      title: "x".repeat(61),
      description: "Uma descrição.",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a title at exactly 60 characters", () => {
    const result = frontmatterSchema.safeParse({
      title: "x".repeat(60),
      description: "Uma descrição.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a description longer than 160 characters", () => {
    const result = frontmatterSchema.safeParse({
      title: "Limites",
      description: "x".repeat(161),
    });
    expect(result.success).toBe(false);
  });

  it("accepts a description at exactly 160 characters", () => {
    const result = frontmatterSchema.safeParse({
      title: "Limites",
      description: "x".repeat(160),
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional fields", () => {
    const parsed = frontmatterSchema.parse({
      title: "Matrizes",
      description: "Uma descrição",
      order: 2,
      prerequisites: ["/docs/matematica-discreta/matrizes"],
    });
    expect(parsed.order).toBe(2);
    expect(parsed.prerequisites).toEqual(["/docs/matematica-discreta/matrizes"]);
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
