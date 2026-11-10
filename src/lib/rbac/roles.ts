import type { PermissionGrant } from "./permissions";

export interface Role {
  id: string;
  /** Tizim roli — o'chirib bo'lmaydi, nomini o'zgartirib bo'lmaydi */
  system?: boolean;
  /** i18n kaliti (tizim rollari) yoki oddiy nom (foydalanuvchi yaratgan) */
  name: string;
  description?: string;
  /** Rol rangi — StatusBadge tone */
  tone: "brand" | "success" | "warning" | "info" | "danger" | "muted";
  permissions: PermissionGrant[];
}

/** Standart rollar — backend ulanguncha shu ishlatiladi */
export const DEFAULT_ROLES: Role[] = [
  {
    id: "owner",
    system: true,
    name: "roles.owner",
    tone: "brand",
    permissions: ["*"],
  },
  {
    id: "admin",
    system: true,
    name: "roles.admin",
    tone: "info",
    permissions: [
      "dashboard.*",
      "products.*",
      "inventory.*",
      "suppliers.*",
      "sales.*",
      "pos.*",
      "customers.*",
      "marketing.*",
      "reports.*",
      "finance.view",
      "finance.create",
      "financing.*",
      "employees.*",
      "branches.view",
      "audit.view",
      "settings.view",
    ],
  },
  {
    id: "manager",
    system: true,
    name: "roles.manager",
    tone: "success",
    permissions: [
      "dashboard.view",
      "products.view",
      "products.create",
      "products.edit",
      "products.export",
      "inventory.*",
      "suppliers.view",
      "sales.view",
      "sales.create",
      "sales.refund",
      "sales.discount",
      "pos.*",
      "customers.*",
      "marketing.view",
      "reports.view",
      "employees.view",
    ],
  },
  {
    id: "cashier",
    system: true,
    name: "roles.cashier",
    tone: "warning",
    permissions: [
      "dashboard.view",
      "products.view",
      "sales.view",
      "sales.create",
      "pos.*",
      "customers.view",
      "customers.create",
    ],
  },
  {
    id: "accountant",
    system: true,
    name: "roles.accountant",
    tone: "muted",
    permissions: [
      "dashboard.view",
      "products.view",
      "products.view_cost",
      "sales.view",
      "sales.export",
      "reports.*",
      "finance.*",
      "financing.view",
    ],
  },
];
