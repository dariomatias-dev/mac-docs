import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { checkContent } from "../check-content.mjs";

let root;

function write(relPath, contents) {
  const full = path.join(root, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, contents);
}

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "check-content-"));
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

async function run(checkExternal = false) {
  return checkContent({
    contentDir: path.join(root, "content"),
    publicDir: path.join(root, "public"),
    checkExternal,
  });
}

describe("checkContent", () => {
  it("passes a well-formed tree with no errors", async () => {
    write(
      "content/course/other.mdx",
      "---\ntitle: Outra página\ndescription: Outra descrição válida.\n---\n\n## Outra seção\n",
    );
    write(
      "content/course/good.mdx",
      [
        "---",
        "title: Página boa",
        "description: Descrição dentro do limite.",
        "prerequisites:",
        "  - /docs/course/other",
        "---",
        "",
        "## Seção existente",
        "",
        "Link para [outra página](/docs/course/other) e sua [seção](/docs/course/other#outra-seção).",
        "",
        "Um asset que existe: [logo](/svgs/logo.svg)",
      ].join("\n"),
    );
    write("public/svgs/logo.svg", "<svg></svg>");

    const { errors, pageCount } = await run();

    expect(errors).toEqual([]);
    expect(pageCount).toBe(2);
  });

  it("rejects a frontmatter title over 60 characters", async () => {
    write(
      "content/course/bad.mdx",
      `---\ntitle: ${"x".repeat(61)}\ndescription: ok\n---\n\nConteúdo.\n`,
    );

    const { errors } = await run();

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/bad\.mdx:2: frontmatter inválido em "title"/);
  });

  it("rejects a missing description", async () => {
    write("content/course/bad.mdx", "---\ntitle: Sem descrição\n---\n\nConteúdo.\n");

    const { errors } = await run();

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/frontmatter inválido em "description"/);
  });

  it("flags a prerequisite that doesn't resolve to a real page", async () => {
    write(
      "content/course/bad.mdx",
      [
        "---",
        "title: Página",
        "description: ok",
        "prerequisites:",
        "  - /docs/course/does-not-exist",
        "---",
        "",
        "Conteúdo.",
      ].join("\n"),
    );

    const { errors } = await run();

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/prerequisite não encontrado -> \/docs\/course\/does-not-exist/);
  });

  it("flags a broken internal link", async () => {
    write(
      "content/course/bad.mdx",
      "---\ntitle: Página\ndescription: ok\n---\n\nVeja [isto](/docs/course/nowhere).\n",
    );

    const { errors } = await run();

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/link interno quebrado -> \/docs\/course\/nowhere/);
  });

  it("flags a link to a real page but a heading that doesn't exist there", async () => {
    write(
      "content/course/other.mdx",
      "---\ntitle: Outra página\ndescription: ok\n---\n\n## Seção real\n",
    );
    write(
      "content/course/bad.mdx",
      "---\ntitle: Página\ndescription: ok\n---\n\nVeja [isto](/docs/course/other#nao-existe).\n",
    );

    const { errors } = await run();

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/âncora inexistente em \/docs\/course\/other -> #nao-existe/);
  });

  it("skips a trailing inline JSX tag when computing a heading's anchor, like rehypeHeadingId does", async () => {
    write(
      "content/course/other.mdx",
      "---\ntitle: Outra página\ndescription: ok\n---\n\n## Questão 7 <Badge>1,0 pt</Badge>\n",
    );
    write(
      "content/course/good.mdx",
      "---\ntitle: Página\ndescription: ok\n---\n\nVeja a [questão](/docs/course/other#questão-7).\n",
    );

    const { errors } = await run();

    expect(errors).toEqual([]);
  });

  it("flags a referenced asset that doesn't exist under public/", async () => {
    write(
      "content/course/bad.mdx",
      "---\ntitle: Página\ndescription: ok\n---\n\n[PDF](/pdfs/nao-existe.pdf)\n",
    );

    const { errors } = await run();

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/asset não encontrado -> \/pdfs\/nao-existe\.pdf/);
  });

  it("accepts a referenced asset that does exist under public/", async () => {
    write(
      "content/course/good.mdx",
      "---\ntitle: Página\ndescription: ok\n---\n\n[PDF](/pdfs/existe.pdf)\n",
    );
    write("public/pdfs/existe.pdf", "%PDF-1.4");

    const { errors } = await run();

    expect(errors).toEqual([]);
  });

  it("never fails the run for external links, only reports them as warnings", async () => {
    write(
      "content/course/bad.mdx",
      "---\ntitle: Página\ndescription: ok\n---\n\n[link morto](https://example.invalid/404)\n[link ok](https://example.com/)\n",
    );

    // Real DNS/network calls here would make this test flaky (timing, CI
    // network policy). Stub fetch so the test only exercises this script's
    // own report-not-fail logic, not the network stack.
    const fetchMock = vi.fn(async (url) => {
      if (String(url).includes("example.invalid")) throw new Error("getaddrinfo ENOTFOUND");
      return { ok: true, status: 200 };
    });
    vi.stubGlobal("fetch", fetchMock);

    try {
      const { errors, warnings } = await run(true);

      expect(errors).toEqual([]);
      expect(warnings).toHaveLength(1);
      expect(warnings[0]).toMatch(/example\.invalid/);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
