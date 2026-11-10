import { Link } from "@tanstack/react-router";
import { PaletteIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/ui.store";
import { cn } from "@/utils/cn";

import { BranchSwitcher } from "./BranchSwitcher";
import { CommandMenu, SearchTrigger } from "./CommandMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NotificationsPopover } from "./NotificationsPopover";
import { SidebarToggle } from "./SidebarToggle";
import { UserMenu } from "./UserMenu";

/**
 * Header — h-16 (compact: h-14), sidebar logosi bilan bir chiziqda.
 * Mobil: toggle · logo · ⟶ · qidiruv · bildirishnoma · profil
 * Desktop: toggle · qidiruv ⟶ filial · til · bildirishnoma · sozlash · profil
 */
export function AppHeader({
  showSidebarToggle,
  showLogo,
  side,
}: {
  showSidebarToggle: boolean;
  showLogo: boolean;
  side: "left" | "right";
}) {
  const { t } = useTranslation();
  const openCustomizer = useUiStore((s) => s.setCustomizerOpen);

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:gap-3 sm:px-6 compact:h-14">
      {showSidebarToggle && side === "left" && <SidebarToggle side="left" />}
      {/* Tepa menyu rejimida doim, aks holda faqat mobilda (sidebar yopiq bo'lganda brend ko'rinsin) */}
      <Link
        to="/"
        className={cn(
          "shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
          !showLogo && "md:hidden"
        )}
      >
        <Logo className="[&>span:first-child]:bg-primary [&>span:first-child]:text-primary-foreground" />
      </Link>

      <div className="flex min-w-0 flex-1 justify-end md:justify-start">
        <SearchTrigger />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <BranchSwitcher className="max-lg:hidden" />
        <LanguageSwitcher className="max-sm:hidden" />
        <NotificationsPopover />
        <Button
          variant="outline"
          size="icon"
          className="text-muted-foreground max-sm:hidden"
          onClick={() => openCustomizer(true)}
          aria-label={t("header.customize")}
        >
          <PaletteIcon />
        </Button>
        <UserMenu />
        {showSidebarToggle && side === "right" && <SidebarToggle side="right" />}
      </div>
      <CommandMenu />
    </header>
  );
}
