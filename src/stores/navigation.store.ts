import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/config/app";
import { NAVIGATION } from "@/config/navigation";

/**
 * Foydalanuvchining menyu sozlamasi: bo'limlar tartibi, yashirilganlar, sevimlilar.
 * Config (NAVIGATION) o'zgarsa — yangi bo'limlar avtomatik oxiriga qo'shiladi (useOrderedNavigation).
 */
interface NavigationState {
  /** Bo'lim id'lari tartibi */
  order: string[];
  /** Yashirilgan bo'lim id'lari */
  hidden: string[];
  /** Sevimli sahifalar — "bo'lim.band" kalitlari (sidebar tepasida va mobil tab-bar'da) */
  favorites: string[];
  /** Sidebar'da ochiq turgan bo'limlar (accordion) */
  expanded: string[];
  setOrder: (order: string[]) => void;
  toggleHidden: (id: string) => void;
  toggleFavorite: (key: string) => void;
  setFavorites: (keys: string[]) => void;
  toggleExpanded: (id: string, exclusive?: boolean) => void;
  setExpanded: (ids: string[]) => void;
  reset: () => void;
}

const DEFAULTS = {
  order: NAVIGATION.map((s) => s.id),
  hidden: [] as string[],
  favorites: ["sales.pos", "products.catalog", "customers.list"],
  expanded: [] as string[],
};

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setOrder: (order) => set({ order }),
      toggleHidden: (id) =>
        set((s) => ({
          hidden: s.hidden.includes(id) ? s.hidden.filter((x) => x !== id) : [...s.hidden, id],
        })),
      toggleFavorite: (key) =>
        set((s) => ({
          favorites: s.favorites.includes(key)
            ? s.favorites.filter((x) => x !== key)
            : [...s.favorites, key],
        })),
      setFavorites: (favorites) => set({ favorites }),
      toggleExpanded: (id, exclusive = false) =>
        set((s) => {
          const isOpen = s.expanded.includes(id);
          if (isOpen) return { expanded: s.expanded.filter((x) => x !== id) };
          return { expanded: exclusive ? [id] : [...s.expanded, id] };
        }),
      setExpanded: (expanded) => set({ expanded }),
      reset: () => set(DEFAULTS),
    }),
    { name: STORAGE_KEYS.navigation, version: 1 }
  )
);
