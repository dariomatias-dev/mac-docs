import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { checkDocsLocales } from "../check-docs-locales.mjs";

let docsDir;

function write(fileName, content) {
  fs.writeFileSync(path.join(docsDir, fileName), content);
}

beforeEach(() => {
  docsDir = fs.mkdtempSync(path.join(os.tmpdir(), "check-docs-locales-"));
});

afterEach(() => {
  fs.rmSync(docsDir, { recursive: true, force: true });
});

describe("checkDocsLocales", () => {
  it("passes when all three locale files exist with the same section structure", () => {
    const content = "# Title\n\nIntro.\n\n## Section one\n\nBody.\n\n## Section two\n\nBody.\n";
    write("guide.md", content);
    write("guide.pt-BR.md", content.replace("Title", "Título"));
    write("guide.es.md", content.replace("Title", "Título"));

    const { errors } = checkDocsLocales({ docsDir });
    expect(errors).toEqual([]);
  });

  it("flags a locale file missing for a base document", () => {
    write("guide.md", "# Title\n");
    write("guide.pt-BR.md", "# Título\n");

    const { errors } = checkDocsLocales({ docsDir });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/guide\.md: missing for locale\(s\) es/);
  });

  it("flags a section-structure mismatch between locales", () => {
    write("guide.md", "# Title\n\n## One\n\n## Two\n");
    write("guide.pt-BR.md", "# Título\n\n## Um\n");
    write("guide.es.md", "# Título\n\n## Uno\n\n## Dos\n");

    const { errors } = checkDocsLocales({ docsDir });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/guide\.md: section structure differs/);
    expect(errors[0]).toMatch(/en \(1,2,2\)/);
    expect(errors[0]).toMatch(/pt-BR \(1,2\)/);
  });

  it("ignores heading text differences as long as the structure (levels, in order) matches", () => {
    write("guide.md", "# A completely different title\n\n## First\n\n### Nested\n");
    write("guide.pt-BR.md", "# Um título completamente diferente\n\n## Primeiro\n\n### Aninhado\n");
    write("guide.es.md", "# Un título completamente distinto\n\n## Primero\n\n### Anidado\n");

    const { errors } = checkDocsLocales({ docsDir });
    expect(errors).toEqual([]);
  });
});
