import { describe, expect, it } from "vitest";

import { formatNumber, formatPercent, formatPhone, initials } from "./format";

const SPACES = new RegExp(`[${String.fromCharCode(0xa0, 0x202f)}]`, "g");
const nbsp = (s: string) => s.replace(SPACES, " ");

describe("format", () => {
  it("raqamni guruhlaydi", () => {
    expect(nbsp(formatNumber(1250000))).toBe("1 250 000");
  });

  it("foiz belgisi bilan", () => {
    expect(formatPercent(0.124, { signed: true })).toBe("+12,4%");
    expect(formatPercent(-0.05, { signed: true })).toBe("−5%");
  });

  it("telefon raqam", () => {
    expect(formatPhone("998901234567")).toBe("+998 90 123 45 67");
    expect(formatPhone("123")).toBe("123");
  });

  it("bosh harflar", () => {
    expect(initials("Abduvoris Mo'minov")).toBe("AM");
  });
});
