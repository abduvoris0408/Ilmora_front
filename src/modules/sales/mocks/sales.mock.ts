import { createRandom, fullName } from "@/lib/mock/random";
import { BRANCHES } from "@/mocks/branches";

import type { Sale, SaleItem } from "../types";

const ITEMS = [
  ["Coca-Cola 1.5L", 12_000],
  ["Non (oddiy)", 4_000],
  ["Sut Lactel 1L", 13_000],
  ["Guruch Lazer 1kg", 28_000],
  ["Ariel kukun 3kg", 110_000],
  ["Shokolad Alpen Gold", 15_500],
  ["Quloqchin JBL Tune", 459_000],
  ["Shampun Head&Shoulders", 52_000],
  ["Futbolka basic", 89_000],
] as const;

export function createSalesMock(count = 120): Sale[] {
  const r = createRandom(31);
  const stores = BRANCHES.filter((b) => b.type === "store");
  const cashiers = Array.from({ length: 6 }, () => fullName(r));

  return Array.from({ length: count }, (_, i) => {
    const items: SaleItem[] = Array.from({ length: r.int(1, 5) }, () => {
      const [name, price] = r.pick(ITEMS);
      return { name, price, qty: r.int(1, 4) };
    });
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const discount = r.bool(0.2)
      ? Math.round((subtotal * r.pick([0.05, 0.1, 0.15])) / 100) * 100
      : 0;
    return {
      id: `s-${10600 - i}`,
      number: 10600 - i,
      branchId: r.pick(stores).id,
      cashier: r.pick(cashiers),
      customer: r.bool(0.45) ? null : fullName(r),
      items,
      discount,
      total: subtotal - discount,
      payment: r.pick(["cash", "card", "card", "click", "payme", "credit"] as const),
      status: r.bool(0.06) ? "refunded" : r.bool(0.03) ? "pending" : "completed",
      createdAt: new Date(Date.now() - i * r.int(18, 70) * 60_000).toISOString(),
    };
  });
}
