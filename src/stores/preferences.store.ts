import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/config/app";
import {
  DEFAULT_BRAND,
  type BrandColor,
  type ColorPresetId,
  type ContentWidth,
  type Density,
  type FontScale,
  type LayoutPosition,
  type RadiusValue,
  type SidebarStyle,
  type ThemeMode,
} from "@/config/theme";

/**
 * Foydalanuvchi interfeys sozlamalari (mavzu + layout). localStorage'da saqlanadi.
 * ⚠️ index.html'dagi inline skript shu kalitdagi `state` ni o'qiydi — maydon nomlarini
 *    o'zgartirsangiz, u yerni ham yangilang.
 */
export interface PreferencesState {
  mode: ThemeMode;
  /** Preset id yoki "custom" (foydalanuvchi o'zi tanlagan tus) */
  colorId: ColorPresetId | "custom";
  brand: BrandColor;
  radius: RadiusValue;
  sidebarStyle: SidebarStyle;
  layout: LayoutPosition;
  density: Density;
  fontScale: FontScale;
  contentWidth: ContentWidth;
  /** Sidebar ochiq (true) yoki faqat ikonlar (false) — desktop */
  sidebarOpen: boolean;
}

interface PreferencesActions {
  set: <K extends keyof PreferencesState>(key: K, value: PreferencesState[K]) => void;
  setColor: (id: ColorPresetId | "custom", brand: BrandColor) => void;
  reset: () => void;
}

export const DEFAULT_PREFERENCES: PreferencesState = {
  mode: "system",
  colorId: "blue",
  brand: DEFAULT_BRAND,
  radius: 0.75,
  sidebarStyle: "light",
  layout: "left",
  density: "comfortable",
  fontScale: 100,
  contentWidth: "boxed",
  sidebarOpen: true,
};

export const usePreferences = create<PreferencesState & PreferencesActions>()(
  persist(
    (set) => ({
      ...DEFAULT_PREFERENCES,
      set: (key, value) => set({ [key]: value } as Partial<PreferencesState>),
      setColor: (colorId, brand) => set({ colorId, brand }),
      reset: () => set(DEFAULT_PREFERENCES),
    }),
    { name: STORAGE_KEYS.preferences, version: 1 }
  )
);
