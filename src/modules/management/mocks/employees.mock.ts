import { createRandom, fullName } from "@/lib/mock/random";
import { BRANCHES } from "@/mocks/branches";

export interface Employee {
  id: string;
  name: string;
  phone: string;
  roleId: string;
  branchId: string;
  active: boolean;
  monthlySales: number;
  lastActive: string;
}

export function createEmployeesMock(count = 28): Employee[] {
  const r = createRandom(5);
  const roleIds = ["admin", "manager", "cashier", "cashier", "cashier", "accountant"];
  return Array.from({ length: count }, (_, i) => {
    const roleId = i === 0 ? "admin" : r.pick(roleIds);
    return {
      id: `e-${i + 1}`,
      name: fullName(r),
      phone: r.phone(),
      roleId,
      branchId: r.pick(BRANCHES).id,
      active: r.bool(0.9),
      monthlySales: roleId === "cashier" ? r.price(40_000_000, 180_000_000) : 0,
      lastActive: new Date(Date.now() - r.int(1, 60 * 24 * 6) * 60_000).toISOString(),
    };
  });
}
