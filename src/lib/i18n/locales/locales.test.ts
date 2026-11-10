import { describe, expect, it } from "vitest";

import { en } from "./en";
import { ru } from "./ru";
import { uz } from "./uz";

/** Barcha kalitlar tekis ro'yxatda: "common.save", "nav.products.title" … */
function keys(obj: object, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  );
}

function interpolations(obj: object, prefix = ""): Record<string, string[]> {
  return Object.fromEntries(
    keys(obj, prefix).map((k) => {
      const value = k.split(".").reduce<unknown>((o, p) => (o as Record<string, unknown>)[p], obj);
      return [
        k,
        String(value)
          .match(/\{\{\w+\}\}/g)
          ?.sort() ?? [],
      ];
    })
  );
}

describe("i18n", () => {
  it("ru va en — uz bilan bir xil kalitlarga ega", () => {
    expect(keys(ru).sort()).toEqual(keys(uz).sort());
    expect(keys(en).sort()).toEqual(keys(uz).sort());
  });

  it("interpolatsiya o'zgaruvchilari ({{name}}) barcha tillarda bir xil", () => {
    const base = interpolations(uz);
    for (const locale of [ru, en]) expect(interpolations(locale)).toEqual(base);
  });

  it("bo'sh tarjima yo'q", () => {
    for (const locale of [uz, ru, en]) {
      const empty = keys(locale).filter(
        (k) => !k.split(".").reduce<unknown>((o, p) => (o as Record<string, unknown>)[p], locale)
      );
      expect(empty).toEqual([]);
    }
  });
});
