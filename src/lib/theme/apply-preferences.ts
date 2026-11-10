import type { PreferencesState } from "@/stores/preferences.store";

const FG = { light: "oklch(1 0 0)", dark: "oklch(0.18 0.02 265)" } as const;

function setOptional(el: HTMLElement, name: string, value: string | number | undefined) {
  if (value === undefined) el.style.removeProperty(name);
  else el.style.setProperty(name, String(value));
}

/** Tizim qorong'i rejimdami */
export const prefersDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

export function resolveMode(mode: PreferencesState["mode"]): "light" | "dark" {
  return mode === "system" ? (prefersDark() ? "dark" : "light") : mode;
}

/**
 * Sozlamalarni <html> ga qo'llaydi: .dark klassi, data-* atributlar, CSS o'zgaruvchilar.
 * Xuddi shu mantiq index.html'dagi inline skriptda ham bor (birinchi chizishdan oldin).
 */
export function applyPreferences(p: PreferencesState, { animate = false } = {}) {
  const root = document.documentElement;
  const dark = resolveMode(p.mode) === "dark";

  if (animate) {
    root.classList.add("theme-transition");
    window.setTimeout(() => root.classList.remove("theme-transition"), 250);
  }

  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";

  root.style.setProperty("--brand-l", String(p.brand.l));
  root.style.setProperty("--brand-c", String(p.brand.c));
  root.style.setProperty("--brand-h", String(p.brand.h));
  setOptional(root, "--brand-dl", p.brand.dl);
  setOptional(root, "--brand-fg", p.brand.fg && FG[p.brand.fg]);
  setOptional(root, "--brand-fg-dark", p.brand.dfg && FG[p.brand.dfg]);
  root.style.setProperty("--radius", `${p.radius}rem`);
  root.style.fontSize = `${p.fontScale}%`;

  root.dataset.sidebarStyle = p.sidebarStyle;
  root.dataset.density = p.density;
  root.dataset.layout = p.layout;

  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]:not([media])');
  if (meta) meta.content = dark ? "#0b0d12" : "#ffffff";
}
