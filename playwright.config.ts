import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium-desktop", use: { ...devices["Desktop Chrome"] } },
    // A curated subset, not the full suite: interaction-heavy specs
    // (sidebar collapse, calculators) assume the desktop layout, but smoke
    // and a11y are the checks that matter most on the layout real users get
    // on a phone.
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
      testMatch: /(smoke|a11y)\.spec\.ts/,
    },
  ],
  webServer: {
    // In CI the "e2e" job downloads the "build" job's .next output instead
    // of rebuilding, so it only needs to start the already-built app.
    // Locally there's no separate build step, so build-then-start is the
    // only option (reuseExistingServer skips this entirely if a dev/start
    // server is already listening on the port).
    // Unlike npm, pnpm forwards extra args to the underlying script without
    // needing a "--" separator; passing one here makes Next's CLI treat
    // "--port" itself as a positional project-directory argument and fail.
    command: process.env.CI
      ? `pnpm run start --port ${PORT}`
      : `pnpm run build && pnpm run start --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
