import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/components/dashboard/*"],
              message:
                "Import dashboard route components from src/app/(dashboard)/dashboard/_components instead of deprecated global paths.",
            },
            {
              group: [
                "@/components/time-entry/QuickLogForm",
                "@/components/time-entry/DailyEntries",
                "@/components/time-entry/RecentEntries",
                "@/components/time-entry/SessionBadge",
                "@/components/time-entry/shared",
              ],
              message:
                "Import log route components from src/app/(dashboard)/log/_components or a neutral shared location instead of deprecated global time-entry paths.",
            },
            {
              group: ["@/components/history/*"],
              message:
                "Import history route components from src/app/(dashboard)/history/_components instead of deprecated global paths.",
            },
            {
              group: ["@/components/settings/*"],
              message:
                "Import settings route components from src/app/(dashboard)/settings/_components or src/components/shared instead of deprecated global paths.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".agents/**",
  ]),
]);

export default eslintConfig;
