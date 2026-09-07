import path from "node:path";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import jsxA11y from "eslint-plugin-jsx-a11y";

// import/no-restricted-paths resolves a glob `from` to an absolute path
// before matching, but NOT a glob `except`: an except entry is matched
// against the resolved absolute import path exactly as given, so a
// relative "./src/..." pattern here would never match anything and every
// import in the zone would be flagged. Resolve except patterns ourselves.
const abs = (p) => path.resolve(import.meta.dirname, p);

// Kept as an explicit list rather than reading src/features/ at config-load
// time, so the set of zones a reviewer sees in this file is exactly the set
// that's enforced, independent of stray local directories that aren't
// checked into git. Add a feature here when you add one under src/features/.
const FEATURES = [
  "annotations",
  "content",
  "contributors",
  "navigation",
  "schedule",
  "search",
  "study",
  "theme",
  "toc",
];

// docs/*/architecture.md's "Intentional exceptions" section is the source
// of truth for these; this array is what makes them lint-enforced instead
// of only documented. Each entry is a glob no-restricted-paths accepts
// wherever an "except" applies to a glob-based `from`.
const CROSS_FEATURE_EXCEPTIONS = [
  abs("./src/features/*/index.ts"),
  // annotations reads search's client-safe helpers directly: importing the
  // feature's own barrel would drag getSearchIndex (reads content/ from
  // disk) into a "use client" bundle that must stay browser only.
  abs("./src/features/search/lib/search-shared.*"),
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Only the rules and JSX parser option, not jsxA11y.flatConfigs.recommended
    // wholesale: nextVitals already registers the jsx-a11y plugin (with a
    // handful of its rules on), and redeclaring the plugin object under the
    // same name is a hard error in flat config.
    languageOptions: jsxA11y.flatConfigs.recommended.languageOptions,
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      // <pre> holds scrollable code blocks in mdx-renderer.tsx: axe's own
      // scrollable-region-focusable check requires tabIndex there so
      // keyboard users can scroll them, and there's no ARIA role for
      // "scrollable region" this rule already treats as interactive.
      "jsx-a11y/no-noninteractive-tabindex": ["error", { tags: ["pre"], roles: ["tabpanel"] }],
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"], "type"],
          pathGroups: [{ pattern: "@/**", group: "internal" }],
          "newlines-between": "always",
          alphabetize: { order: "asc" },
        },
      ],
      // shared/ is the bottom of the dependency graph: it must stay usable
      // from any feature, which breaks the moment it imports one back.
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/shared/**/*",
              from: "./src/features/**/*",
              message: "shared/ must not depend on features/. Move the shared piece down instead.",
            },
            // app/ composes features; it may only reach a feature's public
            // API (its index.ts barrel), never a file inside it.
            {
              target: "./src/app/**/*",
              from: "./src/features/**/*",
              except: CROSS_FEATURE_EXCEPTIONS,
              message: "Import from the feature's barrel (index.ts), not an internal file.",
            },
            // A feature may freely import its own files, and any feature's
            // barrel (see docs/*/architecture.md's documented exceptions
            // for the couple of deliberate cross-feature dependencies), but
            // never reach directly inside another feature.
            ...FEATURES.map((name) => ({
              target: `./src/features/${name}/**/*`,
              from: "./src/features/**/*",
              except: [abs(`./src/features/${name}/**/*`), ...CROSS_FEATURE_EXCEPTIONS],
              message: "Import from the other feature's barrel (index.ts), not an internal file.",
            })),
          ],
        },
      ],
    },
  },
  {
    // Type-aware rules need the type checker, which is slow and only makes
    // sense for the app's own source; config files and one-off scripts at
    // the repo root stay on the plain (non type-aware) parser from nextTs.
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
    },
  },
  // Turn off ESLint formatting rules that conflict with Prettier. Must be last.
  eslintConfigPrettier,
  globalIgnores([".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"]),
]);

export default eslintConfig;
