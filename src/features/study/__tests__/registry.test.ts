import { describe, expect, it } from "vitest";

import { mdxComponents } from "../registry";

describe("mdxComponents", () => {
  it("maps every MDX tag used by content to a defined component", () => {
    const expectedTags = [
      "Callout",
      "Collapsible",
      "Exercise",
      "Answer",
      "Marker",
      "Quiz",
      "Option",
      "Alternatives",
      "Alternative",
      "Badge",
      "PixelGrid",
      "Proof",
      "Question",
      "RegionDiagram",
      "Resolution",
      "StepByStep",
      "Step",
      "YouTube",
      "SetCalculator",
      "MatrixCalculator",
      "BooleanMatrixCalculator",
      "MatrixExercise",
      "BooleanMatrixExercise",
    ];

    for (const tag of expectedTags) {
      expect(mdxComponents).toHaveProperty(tag);
      expect(mdxComponents[tag as keyof typeof mdxComponents]).toBeDefined();
    }

    expect(Object.keys(mdxComponents)).toHaveLength(expectedTags.length);
  });
});
