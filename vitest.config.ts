import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}", "scripts/**/*.{test,spec}.mjs"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/__tests__/**",
        "src/app/**/{layout,loading,error,not-found,global-error}.tsx",
        "**/*.types.ts",
        "**/index.ts",
      ],
      // Floor, not a target: measured against all of src (not just the
      // handful of files this changeset added tests for), so it's set to
      // the actual coverage this changeset leaves behind, minus a small
      // margin. Its job is to catch a broad regression, not to reward
      // already-good code. Untested areas that pull the aggregate down
      // (toc, the navigation shell, search dialog, contributors,
      // several app/ routes) are a known, separate backlog, not a
      // reason to accept a *lower* floor here. Raise this whenever a
      // change measurably improves the aggregate; the eventual target
      // is 85/85/85/75. Lowering it requires a reason in the commit
      // message, not just a failing run.
      thresholds: {
        statements: 65,
        branches: 50,
        functions: 60,
        lines: 65,
      },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
