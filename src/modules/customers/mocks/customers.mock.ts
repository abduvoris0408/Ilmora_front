import { createRandom, FIRST_NAMES, LAST_NAMES } from "@/lib/mock/random";

import type { Customer, CustomerSegment } from "../types";

const FEMALE = new Set([
  "Dilnoza",
  "Gulnora",
  "Kamola",
  "Laylo",
  "Madina",
  "Shahzoda",
  "Umida",
  "Zarina",
  "Sevara",
  "Malika",
  "Nilufar",
  "Mohira",
]);

export function createCustomersMock(count = 86): Customer[] {
  const r = createRandom(23);
  return Array.from({ length: count }, (_, i) => {
    const first = r.pick(FIRST_NAMES);
    const female = FEMALE.has(first);
    let last: string = r.pick(LAST_NAMES);
    // Familiyani jinsga moslash (Karimov → Karimova)
    if (female && !last.endsWith("a")) last = `${last}a`;
    if (!female && last.endsWith("ova")) last = last.slice(0, -1);
    if (!female && last.endsWith("eva")) last = last.slice(0, -1);

    const visits = r.int(1, 140);
    const totalSpent = visits * r.price(45_000, 480_000);
    const lastVisitDays = r.int(0, 120);
    const segment: CustomerSegment =
      lastVisitDays > 75
        ? "sleeping"
        : totalSpent > 25_000_000
          ? "vip"
          : visits < 4
            ? "new"
            : "regular";

    return {
      id: `c-${2000 + i}`,
      name: `${first} ${last}`,
      phone: r.phone(),
      gender: female ? "female" : "male",
      segment,
      totalSpent,
      visits,
      cashback: Math.round((totalSpent * 0.02) / 100) * 100,
      debt: r.bool(0.14) ? r.price(50_000, 3_500_000) : 0,
      birthday: new Date(1970 + r.int(0, 35), r.int(0, 11), r.int(1, 28)).toISOString(),
      lastVisit: new Date(Date.now() - lastVisitDays * 86_400_000).toISOString(),
      createdAt: r.pastDate(900).toISOString(),
      note: r.bool(0.2) ? "Yetkazib berishni afzal ko'radi" : undefined,
    };
  });
}
