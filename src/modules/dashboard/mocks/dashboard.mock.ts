import { createRandom, fullName } from "@/lib/mock/random";

export type Period = "today" | "week" | "month" | "year";

const r = createRandom(11);

/** Oxirgi 14 kun: tushum va foyda */
export const SALES_TREND = Array.from({ length: 14 }, (_, i) => {
  const date = new Date(Date.now() - (13 - i) * 86_400_000);
  const weekend = date.getDay() === 0 || date.getDay() === 6;
  const revenue = Math.round(r.float(weekend ? 38 : 26, weekend ? 52 : 40) * 1_000_000);
  return { date: date.toISOString(), revenue, profit: Math.round(revenue * r.float(0.18, 0.26)) };
});

const MULT: Record<Period, number> = { today: 1, week: 7, month: 30, year: 365 };

export function statsFor(period: Period) {
  const m = MULT[period];
  const revenue = 34_850_000 * m * (period === "year" ? 0.92 : 1);
  const orders = Math.round(412 * m);
  return {
    revenue,
    revenueTrend: 0.124,
    orders,
    ordersTrend: 0.063,
    avgCheck: revenue / orders,
    avgCheckTrend: 0.057,
    customers: Math.round(38 * m),
    customersTrend: -0.021,
  };
}

/** Rang — faqat chart token'lari */
export const PAYMENT_METHODS = [
  { method: "card", value: 46, color: "var(--chart-1)" },
  { method: "cash", value: 31, color: "var(--chart-3)" },
  { method: "click", value: 12, color: "var(--chart-2)" },
  { method: "payme", value: 7, color: "var(--chart-4)" },
  { method: "credit", value: 4, color: "var(--chart-5)" },
] as const;

export const TOP_PRODUCTS = [
  { name: "Coca-Cola 1.5L", sold: 1284, revenue: 15_408_000 },
  { name: "Non (oddiy)", sold: 1102, revenue: 4_408_000 },
  { name: "Sut Lactel 1L", sold: 864, revenue: 11_232_000 },
  { name: "Guruch Lazer 1kg", sold: 640, revenue: 17_920_000 },
  { name: "Ariel kukun 3kg", sold: 212, revenue: 23_320_000 },
];

export const LOW_STOCK = [
  { name: "Red Bull 0.25L", left: 4, min: 24 },
  { name: "Pishloq Hochland", left: 6, min: 20 },
  { name: "Powerbank Xiaomi 10000", left: 2, min: 5 },
  { name: "Fairy 500ml", left: 9, min: 30 },
];

export const RECENT_SALES = Array.from({ length: 6 }, (_, i) => ({
  id: `s-${10490 - i}`,
  number: 10490 - i,
  customer: r.bool(0.4) ? null : fullName(r),
  cashier: fullName(r),
  items: r.int(1, 12),
  amount: r.price(18_000, 1_450_000),
  payment: r.pick(["card", "cash", "click", "payme"] as const),
  at: new Date(Date.now() - (i * 9 + r.int(1, 8)) * 60_000).toISOString(),
}));
