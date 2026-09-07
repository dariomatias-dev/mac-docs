import fs from "node:fs";
import path from "node:path";

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const CONTENT_ROOT = path.join(process.cwd(), "content", "matematica-discreta");

// One real page per top-level content group (Sets, Matrices, Relations...),
// discovered from the filesystem so this list can't silently go stale as
// content is added or renamed, unlike a couple of hardcoded paths would.
function samplePagePerGroup(): string[] {
  const groups = fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  return groups.map((group) => {
    const groupDir = path.join(CONTENT_ROOT, group);
    const mdxFile = findFirstMdx(groupDir);
    const relative = path.relative(CONTENT_ROOT, mdxFile).replace(/\.mdx$/, "");
    const slug = relative.endsWith("index")
      ? relative.slice(0, -"index".length).replace(/\/$/, "")
      : relative;
    return `/docs/matematica-discreta/${slug}`;
  });
}

function findFirstMdx(dir: string): string {
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".mdx")) return path.join(dir, entry.name);
  }
  for (const entry of entries) {
    if (entry.isDirectory()) return findFirstMdx(path.join(dir, entry.name));
  }
  throw new Error(`No .mdx file found under ${dir}`);
}

const PAGES = ["/", ...samplePagePerGroup()];

for (const path_ of PAGES) {
  test(`has no critical accessibility violations: ${path_}`, async ({ page }) => {
    await page.goto(path_);
    // Excludes embedded YouTube players: their internal markup is
    // third-party content this project doesn't control, and axe can reach
    // into it because Playwright exposes same-process iframes to CDP.
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .exclude("iframe")
      .analyze();

    const serious = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(serious).toEqual([]);
  });

  test(`has no critical accessibility violations in dark mode: ${path_}`, async ({ page }) => {
    // Set the emulated color scheme before navigating: the theme defaults to
    // "system", so the page is already dark on first paint. Setting it after
    // load (and clicking the toggle) would flip it back to light instead.
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto(path_);
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Excludes embedded YouTube players: their internal markup is
    // third-party content this project doesn't control, and axe can reach
    // into it because Playwright exposes same-process iframes to CDP.
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .exclude("iframe")
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(serious).toEqual([]);
  });
}

test("keyboard focus is visible when tabbing through the page", async ({ page }) => {
  await page.goto("/docs/matematica-discreta/matrizes/operacoes");

  // globals.css draws a 2px solid outline on :focus-visible; confirm the
  // element that actually receives focus gets it, rather than relying on
  // a screenshot diff.
  await page.keyboard.press("Tab");
  const outline = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const style = getComputedStyle(el);
    return { style: style.outlineStyle, width: style.outlineWidth };
  });

  expect(outline).not.toBeNull();
  expect(outline?.style).toBe("solid");
  expect(outline?.width).not.toBe("0px");
});
