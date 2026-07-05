import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");
const MDX = ".mdx";

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.isFile() && entry.name.endsWith(MDX) ? [full] : [];
  });
}

function fileToUrl(file) {
  const rel = path.relative(CONTENT_DIR, file).slice(0, -MDX.length);
  const parts = rel.split(path.sep);
  if (parts[parts.length - 1] === "index") parts.pop();
  return "/docs/" + parts.join("/");
}

function normalize(link) {
  return link.split("#")[0].replace(/\/$/, "");
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

const files = fs.existsSync(CONTENT_DIR) ? walk(CONTENT_DIR) : [];
const validUrls = new Set(files.map(fileToUrl));
const errors = [];

for (const file of files) {
  const rel = path.relative(process.cwd(), file);
  const { data, content } = matter(fs.readFileSync(file, "utf-8"));

  for (const prereq of data.prerequisites ?? []) {
    if (!validUrls.has(normalize(prereq))) {
      errors.push(`${rel}: prerequisite não encontrado -> ${prereq}`);
    }
  }

  for (const link of extractLinks(content)) {
    if (!validUrls.has(normalize(link))) {
      errors.push(`${rel}: link interno quebrado -> ${link}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`\n✗ ${errors.length} link(s) interno(s) inválido(s):\n`);
  for (const error of errors) console.error(`  ${error}`);
  console.error("");
  process.exit(1);
}

console.log(`✓ ${validUrls.size} páginas, todos os links internos e pré-requisitos válidos.`);
