// Validates every .mdx file under content/ against the rules a broken page
// would otherwise only surface as: a Zod error at build time, a 404 behind a
// dead link, or a jump-to-nowhere anchor. Run as a CLI (see the bottom of
// this file) or import checkContent() to test it against a fixture tree.

import fs from "node:fs";
import path from "node:path";

import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

import { frontmatterSchema } from "../src/features/content/lib/frontmatter-schema.ts";

const MDX = ".mdx";
const ASSET_EXTENSIONS = /\.(pdf|png|jpe?g|svg|webp|gif)$/i;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.isFile() && entry.name.endsWith(MDX) ? [full] : [];
  });
}

function fileToUrl(contentDir, file) {
  const rel = path.relative(contentDir, file).slice(0, -MDX.length);
  const parts = rel.split(path.sep);
  if (parts[parts.length - 1] === "index") parts.pop();
  return "/docs/" + parts.join("/");
}

function splitLink(link) {
  const hashIndex = link.indexOf("#");
  if (hashIndex === -1) return { base: link.replace(/\/$/, ""), fragment: null };
  return { base: link.slice(0, hashIndex).replace(/\/$/, ""), fragment: link.slice(hashIndex + 1) };
}

function lineAt(text, index) {
  return text.slice(0, index).split("\n").length;
}

// Mirrors rehypeHeadingId's skip logic (skip inline JSX/HTML next to a
// heading, e.g. a trailing <Badge>), but over raw Markdown via remark
// instead of the rendered HAST tree, and across all heading depths (h1-h6),
// not just the h2/h3 that extractToc puts in the sidebar TOC. If this drifts
// from rehype-heading-id.ts, a link can look broken here while resolving
// fine in the real page, or vice versa.
function extractHeadingIds(markdown) {
  const tree = unified().use(remarkParse).parse(markdown);
  const slugger = new GithubSlugger();
  const ids = new Set();

  visit(tree, "heading", (node) => {
    let text = "";
    let skipDepth = 0;
    for (const child of node.children) {
      if (child.type === "html") {
        const value = child.value.trim();
        if (value.startsWith("</")) skipDepth = Math.max(0, skipDepth - 1);
        else if (!value.endsWith("/>")) skipDepth++;
        continue;
      }
      if (skipDepth > 0) continue;
      visit(child, (n) => {
        if (n.type === "text") text += n.value;
        if (n.type === "inlineCode") text += n.value;
      });
    }
    text = text.trim();
    if (text) ids.add(slugger.slug(text));
  });

  return ids;
}

function extractLinks(body) {
  const links = new Set();
  const patterns = [/\]\((\/docs\/[^)\s]+)\)/g, /href="(\/docs\/[^"]+)"/g];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(body)) !== null) links.add(m[1]);
  }
  return [...links];
}

function extractAssetRefs(body) {
  const refs = new Set();
  const patterns = [
    /!\[[^\]]*\]\((\/[^)\s]+)\)/g,
    /\]\((\/(?!docs\/)[^)\s]+)\)/g,
    /(?:src|href)="(\/(?!docs\/)[^"]+)"/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(body)) !== null) {
      if (ASSET_EXTENSIONS.test(m[1])) refs.add(m[1]);
    }
  }
  return [...refs];
}

function extractExternalLinks(body) {
  const links = new Set();
  const re = /\]\((https?:\/\/[^)\s]+)\)/g;
  let m;
  while ((m = re.exec(body)) !== null) links.add(m[1]);
  return [...links];
}

/**
 * Runs every content check against `contentDir` and returns the findings.
 * Pure with respect to the filesystem it's pointed at, so a test can run it
 * against a temporary fixture tree instead of the real content/.
 *
 * @param {{ contentDir: string, publicDir: string, checkExternal?: boolean }} options
 */
export async function checkContent({ contentDir, publicDir, checkExternal = false }) {
  const files = walk(contentDir);
  const validUrls = new Set(files.map((f) => fileToUrl(contentDir, f)));
  const headingsByUrl = new Map();
  const errors = [];
  const warnings = [];

  const parsedFiles = files.map((file) => {
    const raw = fs.readFileSync(file, "utf-8");
    const { data, content } = matter(raw);
    const url = fileToUrl(contentDir, file);
    headingsByUrl.set(url, extractHeadingIds(content));
    return { file, raw, data, content, url };
  });

  for (const { file, raw, data, content } of parsedFiles) {
    const rel = path.relative(process.cwd(), file);

    // Frontmatter: same schema the build enforces, so there is exactly one
    // definition of what a valid frontmatter looks like.
    const result = frontmatterSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        const fieldLine = field ? raw.search(new RegExp(`^${field}:`, "m")) : -1;
        const line = fieldLine === -1 ? 2 : lineAt(raw, fieldLine);
        errors.push(
          `${rel}:${line}: frontmatter inválido em "${field ?? "?"}" -> ${issue.message}`,
        );
      }
    }

    for (const prereq of data.prerequisites ?? []) {
      const { base } = splitLink(prereq);
      if (!validUrls.has(base)) {
        const line = lineAt(raw, raw.indexOf(prereq));
        errors.push(`${rel}:${line}: prerequisite não encontrado -> ${prereq}`);
      }
    }

    for (const link of extractLinks(content)) {
      const { base, fragment } = splitLink(link);
      const line = lineAt(raw, raw.indexOf(link));
      if (!validUrls.has(base)) {
        errors.push(`${rel}:${line}: link interno quebrado -> ${link}`);
        continue;
      }
      if (fragment && !headingsByUrl.get(base)?.has(fragment)) {
        errors.push(`${rel}:${line}: âncora inexistente em ${base} -> #${fragment}`);
      }
    }

    for (const assetRef of extractAssetRefs(content)) {
      const assetPath = path.join(publicDir, assetRef);
      if (!fs.existsSync(assetPath)) {
        const line = lineAt(raw, raw.indexOf(assetRef));
        errors.push(`${rel}:${line}: asset não encontrado -> ${assetRef}`);
      }
    }
  }

  if (checkExternal) {
    const allExternal = new Map(); // url -> [rel, ...]
    for (const { file, content } of parsedFiles) {
      const rel = path.relative(process.cwd(), file);
      for (const url of extractExternalLinks(content)) {
        if (!allExternal.has(url)) allExternal.set(url, []);
        allExternal.get(url).push(rel);
      }
    }

    await Promise.all(
      [...allExternal.entries()].map(async ([url, usedBy]) => {
        try {
          const res = await fetch(url, { method: "HEAD", redirect: "follow" });
          if (!res.ok) {
            warnings.push(`${url} -> HTTP ${res.status} (usado em ${usedBy.join(", ")})`);
          }
        } catch (err) {
          warnings.push(`${url} -> ${err.message} (usado em ${usedBy.join(", ")})`);
        }
      }),
    );
  }

  return { errors, warnings, pageCount: validUrls.size };
}

const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;

if (isMain) {
  const checkExternal = process.argv.includes("--external");
  const { errors, warnings, pageCount } = await checkContent({
    contentDir: path.join(process.cwd(), "content"),
    publicDir: path.join(process.cwd(), "public"),
    checkExternal,
  });

  if (warnings.length > 0) {
    console.warn(`\n⚠ ${warnings.length} link(s) externo(s) com problema (não bloqueia):\n`);
    for (const warning of warnings) console.warn(`  ${warning}`);
    console.warn("");
  }

  if (errors.length > 0) {
    console.error(`\n✗ ${errors.length} problema(s) de conteúdo:\n`);
    for (const error of errors) console.error(`  ${error}`);
    console.error("");
    process.exit(1);
  }

  console.log(`✓ ${pageCount} páginas, conteúdo válido.`);
}
