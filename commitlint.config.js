/**
 * Conventional Commits: feat | fix | refactor | style | docs | test | chore | perf | build | ci
 *   feat(products): mahsulot importi qo'shildi
 *   fix(rbac): kassir tannarxni ko'rib qolayotgan edi
 */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      1,
      "always",
      [
        "app",
        "ui",
        "layout",
        "theme",
        "i18n",
        "rbac",
        "router",
        "dashboard",
        "products",
        "sales",
        "customers",
        "marketing",
        "reports",
        "finance",
        "financing",
        "management",
        "settings",
        "auth",
        "deps",
        "ci",
      ],
    ],
    "subject-case": [0],
  },
};
