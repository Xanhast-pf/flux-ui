import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const typeCheckedFiles = ["**/*.{ts,tsx,mts,cts}"];
const reactFiles = ["**/*.{ts,tsx}"];

const typeCheckedConfigs = tseslint.configs.recommendedTypeChecked.map(
  (config) => ({
    ...config,
    files: typeCheckedFiles,
  }),
);

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/coverage/**",
      "**/node_modules/**",
      "apps/docs/src/generated/**",
      "packages/react/src/index.ts",
    ],
  },
  eslint.configs.recommended,
  ...typeCheckedConfigs,
  {
    ...reactHooks.configs.flat.recommended,
    files: reactFiles,
  },
  {
    files: typeCheckedFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.nodeBuiltin,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["scripts/**/*.mjs", "tooling/**/*.mjs", "*.config.mjs"],
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
      },
    },
  },
  prettier,
);
