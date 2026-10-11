/** Reading line from the top of the viewport, in CSS pixels. */
export const READING_LINE = 120;

export type HeadingTop = { id: string; top: number };

/**
 * Which outline entry is current — same rule VitePress, Nextra and
 * Docusaurus use:
 *
 * 1. Walk headings in document order; the last one whose top has crossed
 *    the reading line is active.
 * 2. If none have crossed yet, the first heading is active.
 * 3. At the document bottom, the last heading is active so a short final
 *    section (lists, exam questions) still lights up: its heading may never
 *    reach the reading line because the footer fills the rest of the page.
 */
export function activeHeadingId(
  headings: HeadingTop[],
  {
    viewportBottom,
    documentBottom,
    readingLine = READING_LINE,
  }: {
    viewportBottom: number;
    documentBottom: number;
    readingLine?: number;
  },
): string | null {
  if (headings.length === 0) return null;

  const atBottom = viewportBottom >= documentBottom - 1;
  if (atBottom) return headings[headings.length - 1].id;

  let current = headings[0].id;
  for (const heading of headings) {
    if (heading.top <= readingLine) current = heading.id;
    else break;
  }
  return current;
}
