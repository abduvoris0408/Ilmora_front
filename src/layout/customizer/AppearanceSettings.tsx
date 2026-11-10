import { CheckIcon, MonitorIcon, MoonIcon, PipetteIcon, SunIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Slider } from "@/components/ui/slider";
import {
  COLOR_PRESETS,
  CONTENT_WIDTHS,
  DENSITIES,
  FONT_SCALES,
  LAYOUTS,
  RADIUS_OPTIONS,
  SIDEBAR_STYLES,
  THEME_MODES,
} from "@/config/theme";
import { usePreferences } from "@/stores/preferences.store";
import { cn } from "@/utils/cn";

import { ChoiceGroup, SettingRow } from "./ChoiceGroup";
import {
  DensityPreview,
  LayoutPreview,
  ModePreview,
  SidebarStylePreview,
  WidthPreview,
} from "./previews";

const MODE_ICONS = { light: SunIcon, dark: MoonIcon, system: MonitorIcon } as const;

/**
 * Interfeys sozlamalari — customizer drawer'i va /settings/appearance sahifasi uchun umumiy.
 * Har o'zgarish darhol qo'llanadi (ThemeSync) va localStorage'da saqlanadi.
 */
export function AppearanceSettings({ className }: { className?: string }) {
  const { t } = useTranslation();
  const p = usePreferences();

  return (
    <div className={cn("space-y-7", className)}>
      <SettingRow title={t("theme.mode")}>
        <ChoiceGroup
          label={t("theme.mode")}
          value={p.mode}
          onChange={(v) => p.set("mode", v)}
          options={THEME_MODES.map((m) => {
            const Icon = MODE_ICONS[m];
            return {
              value: m,
              label: t(`theme.modes.${m}`),
              icon: <Icon className="size-3.5" />,
              preview: <ModePreview mode={m} />,
            };
          })}
        />
      </SettingRow>

      <SettingRow title={t("theme.color")}>
        <div role="radiogroup" aria-label={t("theme.color")} className="flex flex-wrap gap-2.5">
          {COLOR_PRESETS.map((c) => {
            const selected = p.colorId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={t(`theme.colors.${c.id}`)}
                title={t(`theme.colors.${c.id}`)}
                onClick={() => p.setColor(c.id, c)}
                className={cn(
                  "group grid size-9 place-items-center rounded-full ring-offset-2 ring-offset-background transition-transform outline-none hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring",
                  selected && "ring-2 ring-foreground/70"
                )}
                style={{ background: `oklch(${c.l} ${c.c} ${c.h})` }}
              >
                {selected && <CheckIcon className="size-4 text-white drop-shadow-sm" />}
              </button>
            );
          })}
        </div>
        {/* Istalgan rang — tus slayderi */}
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg border p-3",
            p.colorId === "custom" && "border-primary bg-accent/50"
          )}
        >
          <PipetteIcon className="size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{t("theme.colors.custom")}</span>
              <span className="text-muted-foreground tabular-nums">{Math.round(p.brand.h)}°</span>
            </div>
            <div
              className="rounded-full"
              style={{
                background:
                  "linear-gradient(to right, oklch(0.6 0.2 0), oklch(0.6 0.2 60), oklch(0.6 0.2 120), oklch(0.6 0.2 180), oklch(0.6 0.2 240), oklch(0.6 0.2 300), oklch(0.6 0.2 360))",
              }}
            >
              <Slider
                aria-label={t("theme.hue")}
                min={0}
                max={360}
                step={1}
                value={[p.brand.h]}
                onValueChange={([h]) => p.setColor("custom", { l: 0.56, c: 0.19, h: h ?? 259 })}
                className="[&_[data-slot=slider-range]]:bg-transparent [&_[data-slot=slider-track]]:bg-transparent"
              />
            </div>
          </div>
        </div>
      </SettingRow>

      <SettingRow title={t("theme.sidebarStyle")}>
        <ChoiceGroup
          label={t("theme.sidebarStyle")}
          value={p.sidebarStyle}
          onChange={(v) => p.set("sidebarStyle", v)}
          options={SIDEBAR_STYLES.map((s) => ({
            value: s,
            label: t(`theme.sidebarStyles.${s}`),
            preview: <SidebarStylePreview style={s} />,
          }))}
        />
      </SettingRow>

      <SettingRow title={t("theme.layout")}>
        <ChoiceGroup
          label={t("theme.layout")}
          value={p.layout}
          onChange={(v) => p.set("layout", v)}
          options={LAYOUTS.map((l) => ({
            value: l,
            label: t(`theme.layouts.${l}`),
            preview: <LayoutPreview layout={l} />,
          }))}
        />
      </SettingRow>

      <div className="grid grid-cols-2 gap-x-4 gap-y-7">
        <SettingRow title={t("theme.density")}>
          <ChoiceGroup
            label={t("theme.density")}
            columns={2}
            value={p.density}
            onChange={(v) => p.set("density", v)}
            options={DENSITIES.map((d) => ({
              value: d,
              label: t(`theme.densities.${d}`),
              preview: <DensityPreview compact={d === "compact"} />,
            }))}
          />
        </SettingRow>
        <SettingRow title={t("theme.contentWidth")}>
          <ChoiceGroup
            label={t("theme.contentWidth")}
            columns={2}
            value={p.contentWidth}
            onChange={(v) => p.set("contentWidth", v)}
            options={CONTENT_WIDTHS.map((w) => ({
              value: w,
              label: t(`theme.contentWidths.${w}`),
              preview: <WidthPreview full={w === "full"} />,
            }))}
          />
        </SettingRow>
      </div>

      <SettingRow title={t("theme.radius")}>
        <ChoiceGroup
          label={t("theme.radius")}
          columns={5}
          value={p.radius}
          onChange={(v) => p.set("radius", v)}
          options={RADIUS_OPTIONS.map((r) => ({
            value: r,
            label: <span className="tabular-nums">{r}</span>,
            preview: (
              <span
                className="block size-6 border-t-2 border-l-2 border-primary"
                style={{ borderTopLeftRadius: `${r * 1.25}rem` }}
              />
            ),
          }))}
        />
      </SettingRow>

      <SettingRow
        title={t("theme.fontScale")}
        action={<span className="text-xs text-muted-foreground tabular-nums">{p.fontScale}%</span>}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">A</span>
          <Slider
            aria-label={t("theme.fontScale")}
            min={0}
            max={FONT_SCALES.length - 1}
            step={1}
            value={[FONT_SCALES.indexOf(p.fontScale)]}
            onValueChange={([i]) => p.set("fontScale", FONT_SCALES[i ?? 2] ?? 100)}
          />
          <span className="text-base text-muted-foreground">A</span>
        </div>
      </SettingRow>
    </div>
  );
}
