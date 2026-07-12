import katex from "katex";

// KaTeX's MathML uses a mathvariant attribute for blackboard-bold letters
// (\mathbb{N}) instead of a distinct glyph; map it back to the Unicode
// character a reader actually expects to see.
const BLACKBOARD: Record<string, string> = {
  N: "ℕ",
  Z: "ℤ",
  Q: "ℚ",
  R: "ℝ",
  C: "ℂ",
};

// Converts a LaTeX snippet to a readable plain-text approximation, used
// where real KaTeX rendering isn't available (search index, "copy page"
// text). Renders through KaTeX itself (MathML output) rather than a
// hand-rolled symbol map, so every command KaTeX supports comes out with
// its real Unicode glyph (e.g. \subseteq -> ⊆), not just a curated subset.
// Unsupported commands degrade to their literal name via throwOnError:false.
export function latexToPlainText(latex: string, displayMode = false): string {
  const mathml = katex
    .renderToString(latex, { output: "mathml", throwOnError: false, displayMode })
    .replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/g, "")
    .replace(
      /<mi mathvariant="double-struck">([A-Z])<\/mi>/g,
      (_, letter: string) => `<mi>${BLACKBOARD[letter] ?? letter}</mi>`,
    )
    // KaTeX gives each letter its own <mi> (e.g. "a_{ij}" -> three
    // separate <mi> tags), so naively spacing every tag boundary later
    // would split identifiers into "a i j". Glue adjacent bare-letter
    // <mi> runs back into one token first; this only touches <mi>, so
    // <mtext> words (e.g. "\text{ e }") are never affected.
    .replace(/(?:<mi>[a-zA-Z]<\/mi>){2,}/g, (run) =>
      `<mi>${[...run.matchAll(/<mi>([a-zA-Z])<\/mi>/g)].map((m) => m[1]).join("")}</mi>`,
    )
    .replace(/<\/mtr>/g, " ; ");

  return mathml
    // MathML conveys spacing visually (CSS), not textually; every tag
    // boundary needs an explicit space, or adjacent tokens (e.g. "A", "⊆",
    // "B") glue together into "A⊆B".
    .replace(/<[^>]+>/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ")
    .replace(/\s+([,;.)\]])/g, "$1")
    .replace(/([([])\s+/g, "$1")
    .replace(/;(?=\s*[)\]}]|\s*$)/g, "")
    .trim();
}
