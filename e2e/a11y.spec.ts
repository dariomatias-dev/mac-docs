import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = ["/", "/docs/calculo-1/limites/conceito-intuitivo"];

for (const path of PAGES) {
  test(`has no critical accessibility violations: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();

    const critical = results.violations.filter((v) => v.impact === "critical");
    expect(critical).toEqual([]);
  });
}
