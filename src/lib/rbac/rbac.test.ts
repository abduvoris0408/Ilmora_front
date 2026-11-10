import { describe, expect, it } from "vitest";

import { ALL_PERMISSIONS, expandGrants, grantsInclude } from "./permissions";
import { DEFAULT_ROLES } from "./roles";
import { checkGrants } from "./use-permission";

describe("rbac", () => {
  it("'*' hamma ruxsatni beradi", () => {
    const grants = new Set(["*"]);
    expect(ALL_PERMISSIONS.every((p) => grantsInclude(grants, p))).toBe(true);
  });

  it("'module.*' faqat o'z moduli uchun ishlaydi", () => {
    const grants = new Set(["products.*"]);
    expect(grantsInclude(grants, "products.delete")).toBe(true);
    expect(grantsInclude(grants, "sales.view")).toBe(false);
  });

  it("expandGrants wildcard'larni aniq ro'yxatga ochadi", () => {
    const expanded = expandGrants(["pos.*", "sales.view"]);
    expect(expanded.has("pos.open_shift")).toBe(true);
    expect(expanded.has("sales.view")).toBe(true);
    expect(expanded.has("sales.refund")).toBe(false);
  });

  it("checkGrants: all / any rejimlari", () => {
    const grants = new Set(["sales.view"]);
    expect(checkGrants(grants, ["sales.view", "sales.refund"], "all")).toBe(false);
    expect(checkGrants(grants, ["sales.view", "sales.refund"], "any")).toBe(true);
    expect(checkGrants(grants, undefined)).toBe(true);
  });

  it("kassir tannarxni ko'ra olmaydi, buxgalter ko'ra oladi", () => {
    const role = (id: string) =>
      new Set<string>(DEFAULT_ROLES.find((r) => r.id === id)!.permissions);
    expect(grantsInclude(role("cashier"), "products.view_cost")).toBe(false);
    expect(grantsInclude(role("accountant"), "products.view_cost")).toBe(true);
  });
});
