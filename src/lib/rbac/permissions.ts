/**
 * RUXSATLAR REESTRI — tizimdagi barcha ruxsatlar shu yerda e'lon qilinadi.
 * Format: `<modul>.<amal>` — masalan `products.create`.
 *
 * Yangi ruxsat qo'shish:
 *   1) Shu obyektga modul/amal qo'shing
 *   2) i18n'da `permissions.modules.<modul>` va (yangi amal bo'lsa) `permissions.actions.<amal>`
 *   3) Kerakli joyda: route `staticData.permission`, nav band `permission`, yoki `<Can>`
 *
 * Rollar matritsasi sahifasi (Boshqaruv → Rollar) shu reestrdan avtomatik quriladi.
 */
export const PERMISSION_REGISTRY = {
  dashboard: ["view"],
  products: ["view", "create", "edit", "delete", "import", "export", "view_cost"],
  inventory: ["view", "transfer", "write_off", "revalue", "count"],
  suppliers: ["view", "create", "edit", "delete"],
  sales: ["view", "create", "refund", "discount", "delete", "export"],
  pos: ["access", "open_shift", "close_shift"],
  customers: ["view", "create", "edit", "delete", "export"],
  marketing: ["view", "create", "edit", "delete", "send_sms"],
  reports: ["view", "export", "view_profit"],
  finance: ["view", "create", "edit", "delete", "export"],
  financing: ["view", "create", "approve"],
  employees: ["view", "create", "edit", "delete"],
  roles: ["view", "manage"],
  branches: ["view", "manage"],
  audit: ["view"],
  settings: ["view", "manage", "integrations"],
} as const;

type Registry = typeof PERMISSION_REGISTRY;
export type PermissionModule = keyof Registry;
export type Permission = {
  [M in PermissionModule]: `${M}.${Registry[M][number]}`;
}[PermissionModule];

/** Har bir ruxsat — tekis ro'yxat */
export const ALL_PERMISSIONS: Permission[] = (
  Object.entries(PERMISSION_REGISTRY) as [PermissionModule, readonly string[]][]
).flatMap(([module, actions]) => actions.map((a) => `${module}.${a}` as Permission));

/** "*" — hamma ruxsat (egasi uchun) */
export const WILDCARD = "*" as const;
export type PermissionGrant = Permission | typeof WILDCARD | `${PermissionModule}.*`;

/** Berilgan ruxsatlar to'plami so'ralgan ruxsatni qamrab oladimi (wildcard'lar bilan) */
export function grantsInclude(grants: ReadonlySet<string>, permission: Permission): boolean {
  if (grants.has(WILDCARD) || grants.has(permission)) return true;
  const module = permission.slice(0, permission.indexOf("."));
  return grants.has(`${module}.*`);
}

/** Wildcard'larni ochib, aniq ruxsatlar ro'yxatiga aylantiradi */
export function expandGrants(grants: readonly PermissionGrant[]): Set<Permission> {
  const set = new Set<string>(grants);
  return new Set(ALL_PERMISSIONS.filter((p) => grantsInclude(set, p)));
}
