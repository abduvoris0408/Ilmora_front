import { useMemo } from "react";

import { FLAT_NAVIGATION, NAVIGATION, type NavSection } from "@/config/navigation";
import { usePermission } from "@/lib/rbac/use-permission";
import { useNavigationStore } from "@/stores/navigation.store";

/**
 * Foydalanuvchi tartibi + ruxsatlar qo'llangan navigatsiya.
 * - Ruxsati yo'q bandlar olib tashlanadi; bandi qolmagan bo'lim ham yashiriladi.
 * - `includeHidden` — menyu tahrirlovchisi uchun (yashirilganlar ham kerak).
 */
export function useOrderedNavigation({ includeHidden = false } = {}): NavSection[] {
  const can = usePermission();
  const order = useNavigationStore((s) => s.order);
  const hidden = useNavigationStore((s) => s.hidden);

  return useMemo(() => {
    const byId = new Map(NAVIGATION.map((s) => [s.id, s]));
    // Saqlangan tartib + config'ga keyin qo'shilgan yangi bo'limlar oxirida
    const ids = [
      ...order.filter((id) => byId.has(id)),
      ...NAVIGATION.map((s) => s.id).filter((id) => !order.includes(id)),
    ];

    return ids
      .map((id) => byId.get(id)!)
      .filter((s) => includeHidden || !hidden.includes(s.id))
      .map((s) => (s.items ? { ...s, items: s.items.filter((i) => can(i.permission)) } : s))
      .filter((s) => (s.items ? s.items.length > 0 : can(s.permission)));
  }, [can, order, hidden, includeHidden]);
}

/** Ruxsat berilgan sevimli sahifalar */
export function useFavoriteEntries() {
  const can = usePermission();
  const favorites = useNavigationStore((s) => s.favorites);
  return useMemo(
    () =>
      favorites
        .map((key) => FLAT_NAVIGATION.find((e) => e.key === key))
        .filter((e): e is NonNullable<typeof e> => Boolean(e) && can(e!.permission)),
    [favorites, can]
  );
}

/** ⌘K qidiruv uchun — ruxsat berilgan barcha sahifalar */
export function useSearchableEntries() {
  const can = usePermission();
  return useMemo(() => FLAT_NAVIGATION.filter((e) => can(e.permission)), [can]);
}
