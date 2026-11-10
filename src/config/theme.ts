/**
 * MAVZU SOZLAMALARI — customizer'dagi barcha variantlar shu yerda.
 * Brend rangi = OKLCH (l, c, h). tokens.css shu 3 qiymatdan butun palitrani hosil qiladi.
 * Yangi preset qo'shish: shu ro'yxatga bitta qator + i18n'da `theme.colors.<id>` nomi.
 */

export interface BrandColor {
  l: number;
  c: number;
  h: number;
  /** Dark rejimdagi yorug'lik (standart: l + 0.08) */
  dl?: number;
  /** Tugma matni: light — oq (standart), dark — to'q (och brend uchun) */
  fg?: "light" | "dark";
  /** Dark rejimdagi tugma matni */
  dfg?: "light" | "dark";
}

export const COLOR_PRESETS = [
  { id: "blue", l: 0.56, c: 0.21, h: 259 },
  { id: "indigo", l: 0.52, c: 0.22, h: 277 },
  { id: "violet", l: 0.54, c: 0.24, h: 295 },
  { id: "rose", l: 0.58, c: 0.22, h: 12 },
  { id: "orange", l: 0.62, c: 0.19, h: 45 },
  { id: "green", l: 0.56, c: 0.15, h: 155 },
  { id: "teal", l: 0.55, c: 0.11, h: 192 },
  { id: "graphite", l: 0.3, c: 0.02, h: 265, dl: 0.92, dfg: "dark" },
] as const satisfies readonly (BrandColor & { id: string })[];

export type ColorPresetId = (typeof COLOR_PRESETS)[number]["id"];

export const DEFAULT_BRAND: BrandColor = { l: 0.56, c: 0.21, h: 259 };

export const RADIUS_OPTIONS = [0, 0.375, 0.5, 0.75, 1] as const;
export type RadiusValue = (typeof RADIUS_OPTIONS)[number];

export const FONT_SCALES = [90, 95, 100, 105, 110, 115] as const;
export type FontScale = (typeof FONT_SCALES)[number];

export const THEME_MODES = ["light", "dark", "system"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const SIDEBAR_STYLES = ["light", "dark", "brand"] as const;
export type SidebarStyle = (typeof SIDEBAR_STYLES)[number];

/** left/right — yon panel; top — gorizontal menyu (lg dan kichikda avtomatik yon panelga aylanadi) */
export const LAYOUTS = ["left", "right", "top"] as const;
export type LayoutPosition = (typeof LAYOUTS)[number];

export const DENSITIES = ["comfortable", "compact"] as const;
export type Density = (typeof DENSITIES)[number];

/** Kontent kengligi: "boxed" — max-w-[90rem] markazda, "full" — butun ekran */
export const CONTENT_WIDTHS = ["boxed", "full"] as const;
export type ContentWidth = (typeof CONTENT_WIDTHS)[number];
