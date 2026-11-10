import { useNavigate } from "@tanstack/react-router";
import { LogOutIcon, MoonIcon, PaletteIcon, SearchIcon, SunIcon } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import type { TKey } from "@/lib/i18n";
import { useSearchableEntries } from "@/lib/navigation/use-navigation";
import { useResolvedTheme } from "@/lib/theme/use-resolved-theme";
import { useAuthStore } from "@/stores/auth.store";
import { usePreferences } from "@/stores/preferences.store";
import { useUiStore } from "@/stores/ui.store";

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

/** Header'dagi qidiruv tugmasi: md+ da input ko'rinishida, mobilda ikon */
export function SearchTrigger() {
  const { t } = useTranslation();
  const setOpen = useUiStore((s) => s.setCommandOpen);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-full max-w-sm items-center gap-2 rounded-md border bg-muted/50 px-3 text-sm text-muted-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 max-md:hidden"
      >
        <SearchIcon className="size-4" />
        <span className="flex-1 truncate text-left">{t("header.search")}</span>
        <KbdGroup>
          <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </button>
      <Button
        variant="outline"
        size="icon"
        className="text-muted-foreground md:hidden"
        onClick={() => setOpen(true)}
        aria-label={t("header.search")}
      >
        <SearchIcon />
      </Button>
    </>
  );
}

/** ⌘K / Ctrl+K — sahifalar (ruxsat bo'yicha) va tezkor amallar */
export function CommandMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const open = useUiStore((s) => s.commandOpen);
  const setOpen = useUiStore((s) => s.setCommandOpen);
  const setCustomizerOpen = useUiStore((s) => s.setCustomizerOpen);
  const entries = useSearchableEntries();
  const theme = useResolvedTheme();
  const setPref = usePreferences((s) => s.set);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!useUiStore.getState().commandOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title={t("header.search")}
      description={t("command.placeholder")}
    >
      <CommandInput placeholder={t("command.placeholder")} />
      <CommandList>
        <CommandEmpty>{t("command.empty")}</CommandEmpty>
        <CommandGroup heading={t("command.pages")}>
          {entries.map((entry) => {
            const Icon = entry.section.icon;
            const section = t(`nav.${entry.section.id}.title` as TKey);
            const label = entry.item
              ? t(`nav.${entry.section.id}.${entry.item.id}` as TKey)
              : section;
            return (
              <CommandItem
                key={entry.key}
                value={`${section} ${label} ${entry.to}`}
                onSelect={() => run(() => void navigate({ to: entry.to }))}
              >
                <Icon />
                <span>{label}</span>
                {entry.item && (
                  <span className="ml-auto text-xs text-muted-foreground">{section}</span>
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={t("command.actions")}>
          <CommandItem
            onSelect={() => run(() => setPref("mode", theme === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            {t("command.toggleTheme")}
          </CommandItem>
          <CommandItem onSelect={() => run(() => setCustomizerOpen(true))}>
            <PaletteIcon />
            {t("command.openCustomizer")}
          </CommandItem>
          <CommandItem
            onSelect={() =>
              run(() => {
                logout();
                void navigate({ to: "/login" });
              })
            }
          >
            <LogOutIcon />
            {t("command.logout")}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
