import type { RegisteredRouter } from "@tanstack/react-router";
import {
  BriefcaseBusinessIcon,
  ChartPieIcon,
  HandCoinsIcon,
  LayoutDashboardIcon,
  MegaphoneIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersRoundIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react";

import type { Permission } from "@/lib/rbac/permissions";

/**
 * NAVIGATSIYA — yagona manba.
 * Sidebar, tepa menyu, ⌘K qidiruv, breadcrumb, mobil tab-bar va menyu tahrirlovchisi
 * hammasi shu ro'yxatdan quriladi. Ruxsati yo'q bandlar avtomatik yashiriladi.
 *
 * Nomlar i18n'da: `nav.<bo'lim>.title` va `nav.<bo'lim>.<band>`.
 * Yangi sahifa: 1) modulning routes.tsx'ida route  2) shu yerda band  3) i18n'da nom.
 */

export type AppPath = keyof RegisteredRouter["routesByPath"];

export interface NavItem {
  id: string;
  to: AppPath;
  permission?: Permission;
  /** Yangi funksiya belgisi */
  isNew?: boolean;
}

export interface NavSection {
  id: string;
  icon: LucideIcon;
  /** Bo'lim bitta sahifa bo'lsa (masalan Bosh sahifa) — `to`, aks holda `items` */
  to?: AppPath;
  permission?: Permission;
  items?: NavItem[];
}

export const NAVIGATION: NavSection[] = [
  {
    id: "dashboard",
    icon: LayoutDashboardIcon,
    to: "/",
    permission: "dashboard.view",
  },
  {
    id: "products",
    icon: PackageIcon,
    items: [
      { id: "catalog", to: "/products", permission: "products.view" },
      { id: "categories", to: "/products/categories", permission: "products.view" },
      { id: "stock", to: "/products/stock", permission: "inventory.view" },
      { id: "import", to: "/products/import", permission: "products.import" },
      { id: "transfers", to: "/products/transfers", permission: "inventory.transfer" },
      { id: "writeOffs", to: "/products/write-offs", permission: "inventory.write_off" },
      { id: "repricing", to: "/products/repricing", permission: "inventory.revalue" },
      { id: "stocktaking", to: "/products/stocktaking", permission: "inventory.count" },
      { id: "suppliers", to: "/products/suppliers", permission: "suppliers.view" },
    ],
  },
  {
    id: "sales",
    icon: ShoppingCartIcon,
    items: [
      { id: "pos", to: "/sales/pos", permission: "pos.access" },
      { id: "list", to: "/sales", permission: "sales.view" },
      { id: "returns", to: "/sales/returns", permission: "sales.view" },
      { id: "shifts", to: "/sales/shifts", permission: "pos.access" },
      { id: "orders", to: "/sales/orders", permission: "sales.view", isNew: true },
    ],
  },
  {
    id: "customers",
    icon: UsersRoundIcon,
    items: [
      { id: "list", to: "/customers", permission: "customers.view" },
      { id: "segments", to: "/customers/segments", permission: "customers.view" },
      { id: "debts", to: "/customers/debts", permission: "customers.view" },
    ],
  },
  {
    id: "marketing",
    icon: MegaphoneIcon,
    items: [
      { id: "promotions", to: "/marketing/promotions", permission: "marketing.view" },
      { id: "loyalty", to: "/marketing/loyalty", permission: "marketing.view" },
      { id: "promocodes", to: "/marketing/promocodes", permission: "marketing.view" },
      { id: "sms", to: "/marketing/sms", permission: "marketing.send_sms" },
      { id: "giftCards", to: "/marketing/gift-cards", permission: "marketing.view" },
    ],
  },
  {
    id: "reports",
    icon: ChartPieIcon,
    items: [
      { id: "sales", to: "/reports/sales", permission: "reports.view" },
      { id: "products", to: "/reports/products", permission: "reports.view" },
      { id: "employees", to: "/reports/employees", permission: "reports.view" },
      { id: "customers", to: "/reports/customers", permission: "reports.view" },
      { id: "abc", to: "/reports/abc", permission: "reports.view" },
    ],
  },
  {
    id: "finance",
    icon: WalletIcon,
    items: [
      { id: "transactions", to: "/finance/transactions", permission: "finance.view" },
      { id: "accounts", to: "/finance/accounts", permission: "finance.view" },
      { id: "expenses", to: "/finance/expenses", permission: "finance.view" },
      { id: "pnl", to: "/finance/pnl", permission: "reports.view_profit" },
    ],
  },
  {
    id: "financing",
    icon: HandCoinsIcon,
    items: [
      { id: "installments", to: "/financing/installments", permission: "financing.view" },
      { id: "credits", to: "/financing/credits", permission: "financing.view" },
      { id: "partners", to: "/financing/partners", permission: "financing.view" },
    ],
  },
  {
    id: "management",
    icon: BriefcaseBusinessIcon,
    items: [
      { id: "employees", to: "/management/employees", permission: "employees.view" },
      { id: "roles", to: "/management/roles", permission: "roles.view" },
      { id: "branches", to: "/management/branches", permission: "branches.view" },
      { id: "audit", to: "/management/audit", permission: "audit.view" },
    ],
  },
  {
    id: "settings",
    icon: SettingsIcon,
    items: [
      { id: "general", to: "/settings", permission: "settings.view" },
      { id: "appearance", to: "/settings/appearance" },
      { id: "menu", to: "/settings/menu" },
      { id: "receipt", to: "/settings/receipt", permission: "settings.view" },
      { id: "integrations", to: "/settings/integrations", permission: "settings.integrations" },
      { id: "designSystem", to: "/settings/design-system" },
    ],
  },
];

/** Tez qidiruv uchun: "products.catalog" → { section, item } */
export interface FlatNavEntry {
  key: string;
  section: NavSection;
  item?: NavItem;
  to: AppPath;
  permission?: Permission;
}

export const FLAT_NAVIGATION: FlatNavEntry[] = NAVIGATION.flatMap((section) =>
  section.items
    ? section.items.map((item) => ({
        key: `${section.id}.${item.id}`,
        section,
        item,
        to: item.to,
        permission: item.permission,
      }))
    : section.to
      ? [{ key: section.id, section, to: section.to, permission: section.permission }]
      : []
);

/** Yo'l bo'yicha nav band topish (breadcrumb, sahifa sarlavhasi uchun). Eng uzun mos prefiks. */
export function findNavEntry(pathname: string): FlatNavEntry | undefined {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  let best: FlatNavEntry | undefined;
  for (const entry of FLAT_NAVIGATION) {
    const matches =
      entry.to === normalized || (entry.to !== "/" && normalized.startsWith(`${entry.to}/`));
    if (matches && (!best || entry.to.length > best.to.length)) best = entry;
  }
  return best;
}
