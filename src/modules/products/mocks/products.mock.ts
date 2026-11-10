import { createRandom } from "@/lib/mock/random";

import type { Product, ProductCategory } from "../types";

const CATALOG: Record<
  ProductCategory,
  { names: string[]; brands: string[]; price: [number, number] }
> = {
  drinks: {
    names: [
      "Coca-Cola 1.5L",
      "Pepsi 1L",
      "Nestle suv 0.5L",
      "Hydrolife 1.5L",
      "Dena sharbat 1L",
      "Red Bull 0.25L",
      "Lipton choy 0.5L",
      "Fanta 1L",
    ],
    brands: ["Coca-Cola", "PepsiCo", "Nestle", "Hydrolife", "Dena"],
    price: [4_000, 22_000],
  },
  food: {
    names: [
      "Guruch Lazer 1kg",
      "Makaron Makfa 400g",
      "Shakar 1kg",
      "Un Oltin Don 2kg",
      "Pishloq Hochland",
      "Sut Lactel 1L",
      "Yog' Oila 1L",
      "Shokolad Alpen Gold",
    ],
    brands: ["Makfa", "Oltin Don", "Lactel", "Hochland", "Oila"],
    price: [8_000, 65_000],
  },
  household: {
    names: [
      "Ariel kukun 3kg",
      "Fairy 500ml",
      "Domestos 1L",
      "Tualet qog'ozi Zewa 4",
      "Persil gel 1.5L",
      "Sochiq Paloma",
    ],
    brands: ["P&G", "Henkel", "Zewa", "Paloma"],
    price: [12_000, 140_000],
  },
  electronics: {
    names: [
      "Quloqchin JBL Tune",
      "Powerbank Xiaomi 10000",
      "USB-C kabel 1m",
      "Zaryadka Samsung 25W",
      "Smart soat Amazfit",
      "Sichqoncha Logitech",
    ],
    brands: ["JBL", "Xiaomi", "Samsung", "Logitech", "Amazfit"],
    price: [45_000, 1_200_000],
  },
  clothing: {
    names: [
      "Futbolka basic",
      "Jinsi shim Slim",
      "Sport kurtka",
      "Paypoq 3 juft",
      "Krossovka Air",
      "Kepka",
    ],
    brands: ["LC Waikiki", "Nike", "Adidas", "Koton"],
    price: [35_000, 890_000],
  },
  cosmetics: {
    names: [
      "Shampun Head&Shoulders",
      "Krem Nivea 150ml",
      "Tish pastasi Colgate",
      "Dezodorant Rexona",
      "Atir Zara 100ml",
    ],
    brands: ["Nivea", "Colgate", "Rexona", "Zara", "P&G"],
    price: [18_000, 420_000],
  },
};

export function createProductsMock(count = 64): Product[] {
  const r = createRandom(7);
  const categories = Object.keys(CATALOG) as ProductCategory[];
  return Array.from({ length: count }, (_, i) => {
    const category = categories[i % categories.length]!;
    const c = CATALOG[category];
    const price = r.price(c.price[0], c.price[1]);
    const cost = Math.round((price * r.float(0.62, 0.86)) / 100) * 100;
    const stock = r.bool(0.1) ? 0 : r.int(1, 240);
    const name = c.names[Math.floor(i / categories.length) % c.names.length]!;
    return {
      id: `p-${1000 + i}`,
      name: i >= categories.length * c.names.length ? `${name} (${r.int(2, 9)})` : name,
      sku: `ILM-${String(1000 + i).padStart(5, "0")}`,
      barcode: `478${String(r.int(1_000_000_000, 9_999_999_999))}`,
      category,
      brand: r.pick(c.brands),
      unit: category === "food" && r.bool(0.3) ? "kg" : "pcs",
      price,
      cost,
      stock,
      minStock: 10,
      trackStock: true,
      active: r.bool(0.92),
      updatedAt: r.pastDate(60).toISOString(),
    };
  });
}
