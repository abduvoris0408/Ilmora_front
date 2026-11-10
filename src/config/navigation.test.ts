import { describe, expect, it } from "vitest";

import { uz } from "@/lib/i18n/locales/uz";
import { ALL_PERMISSIONS } from "@/lib/rbac/permissions";

import { findNavEntry, FLAT_NAVIGATION, NAVIGATION } from "./navigation";

describe("navigation config", () => {
  it("har bir band uchun tarjima bor", () => {
    const nav = uz.nav as unknown as Record<string, Record<string, string>>;
    for (const section of NAVIGATION) {
      expect(nav[section.id]?.title, section.id).toBeTruthy();
      for (const item of section.items ?? []) {
        expect(nav[section.id]?.[item.id], `${section.id}.${item.id}`).toBeTruthy();
      }
    }
  });

  it("ruxsatlar reestrda mavjud", () => {
    for (const entry of FLAT_NAVIGATION) {
      if (entry.permission) expect(ALL_PERMISSIONS).toContain(entry.permission);
    }
  });

  it("yo'llar takrorlanmaydi", () => {
    const paths = FLAT_NAVIGATION.map((e) => e.to);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("findNavEntry eng uzun mos prefiksni topadi", () => {
    expect(findNavEntry("/products")?.key).toBe("products.catalog");
    expect(findNavEntry("/products/categories")?.key).toBe("products.categories");
    expect(findNavEntry("/products/p-1001")?.key).toBe("products.catalog");
    expect(findNavEntry("/")?.key).toBe("dashboard");
  });
});
