/**
 * RESPONSIVLIK — yagona manba. Tailwind standart breakpoint'lari bilan bir xil (px).
 *
 *   < sm  (0–639)    telefon        — pastki tab-bar, kartochka ro'yxati, bottom-sheet modallar
 *   sm    (640+)     katta telefon  — 2 ustunli grid'lar
 *   md    (768+)     planshet       — sidebar ko'rinadi (undan kichikda — chiquvchi panel)
 *   lg    (1024+)    noutbuk        — jadval to'liq ko'rinishi, tepa menyu (layout="top")
 *   xl    (1280+)    desktop        — 12 ustunli sahifa grid'i (8 + 4)
 *   2xl   (1536+)    keng ekran
 *
 * Qoidalar: docs/RESPONSIVE.md
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/** Sidebar shu kenglikdan kichikda chiquvchi panelga (Sheet) aylanadi */
export const MOBILE_BREAKPOINT = BREAKPOINTS.md;

/** Jadval shu kenglikdan kichikda kartochka ro'yxatiga aylanadi */
export const TABLE_CARD_BREAKPOINT = BREAKPOINTS.md;

/** Tepa menyu (layout="top") shu kenglikdan kichikda sidebar-panelga aylanadi */
export const TOP_NAV_BREAKPOINT = BREAKPOINTS.lg;
