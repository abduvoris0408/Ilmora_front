import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist", "coverage", "node_modules"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" },
      ],
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  // ARXITEKTURA CHEGARASI: modul boshqa modulni import qilmaydi.
  // Umumiy narsa kerak bo'lsa — components/shared, lib, stores yoki mocks ga ko'chiriladi.
  {
    files: ["src/modules/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/modules/**"],
              message:
                "Modullar bir-biriga bog'lanmaydi. Umumiy kodni components/shared, lib yoki stores ga ko'chiring.",
            },
          ],
        },
      ],
    },
  },
  // shadcn primitivlari — generatsiya qilingan kod, ba'zi qoidalar yumshatiladi
  {
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
      "@typescript-eslint/consistent-type-imports": "off",
    },
  },
  // Route/config fayllari komponent bo'lmagan narsalarni ham eksport qiladi
  {
    files: [
      "src/**/routes.ts",
      "src/app/**/*.{ts,tsx}",
      "src/lib/**/*.{ts,tsx}",
      "src/components/shared/data-table/**/*.tsx",
    ],
    rules: { "react-refresh/only-export-components": "off" },
  },
  {
    files: ["*.config.{js,ts}", "scripts/**/*.mjs"],
    languageOptions: { globals: globals.node },
  },
]);
