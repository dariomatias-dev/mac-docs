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
      // Floor, not a target: measured against all of src, set to the actual
      // coverage this changeset leaves behind minus a small margin. Its job
      // is to catch a broad regression, not to reward already-good code.
      // Remaining gaps (mdx-renderer.tsx's async Server Component that
      // Testing Library can't mount, registry.ts's lazy next/dynamic
      // callbacks that only run when actually rendered, marker components
      // that return null by design) are a known, separate backlog, not a
      // reason to accept a *lower* floor. Raise this whenever a change
      // measurably improves the aggregate (last raised at
      // 96.57/92.68/94.19/97.93 actual). Lowering it requires a reason in
      // the commit message, not just a failing run.
      thresholds: {
        statements: 96,
        branches: 92,
        functions: 93,
        lines: 97,
      },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
