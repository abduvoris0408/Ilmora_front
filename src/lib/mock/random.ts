/**
 * Deterministik tasodifiy generator (seed bilan) — mock ma'lumotlar har yuklanishda bir xil bo'ladi.
 * Backend ulanganda `modules/<x>/mocks` papkalari o'chiriladi, bu fayl testlarda qolishi mumkin.
 */
export function createRandom(seed = 42) {
  let s = seed >>> 0;
  const next = () => {
    // mulberry32
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return {
    next,
    int: (min: number, max: number) => Math.floor(next() * (max - min + 1)) + min,
    float: (min: number, max: number) => next() * (max - min) + min,
    pick: <T>(arr: readonly T[]): T => arr[Math.floor(next() * arr.length)]!,
    bool: (probability = 0.5) => next() < probability,
    /** Oxirgi `days` kun ichidagi tasodifiy sana */
    pastDate: (days: number) => new Date(Date.now() - next() * days * 86_400_000),
    phone: () =>
      `998${["90", "91", "93", "94", "97", "99", "33", "88"][Math.floor(next() * 8)]}${String(
        Math.floor(next() * 9_000_000) + 1_000_000
      )}`,
    /** Narxni 500 so'mga yaxlitlash */
    price: (min: number, max: number) => Math.round((next() * (max - min) + min) / 500) * 500,
  };
}

export const FIRST_NAMES = [
  "Aziz",
  "Bekzod",
  "Dilnoza",
  "Farrux",
  "Gulnora",
  "Jasur",
  "Kamola",
  "Laylo",
  "Madina",
  "Nodir",
  "Otabek",
  "Rustam",
  "Sardor",
  "Shahzoda",
  "Temur",
  "Umida",
  "Zarina",
  "Sevara",
  "Javohir",
  "Malika",
  "Doniyor",
  "Nilufar",
  "Sherzod",
  "Mohira",
] as const;

export const LAST_NAMES = [
  "Karimov",
  "Rahimova",
  "Yusupov",
  "Toshmatova",
  "Aliyev",
  "Saidova",
  "Nazarov",
  "Ergasheva",
  "Qodirov",
  "Abdullayeva",
  "Xolmatov",
  "Ismoilova",
  "Mirzayev",
  "Sobirova",
] as const;

export function fullName(r: ReturnType<typeof createRandom>) {
  return `${r.pick(FIRST_NAMES)} ${r.pick(LAST_NAMES)}`;
}

/** Mock so'rovni simulyatsiya qilish (TanStack Query bilan ishlatiladi) */
export function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
