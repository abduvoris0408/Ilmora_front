import { Link } from "@tanstack/react-router";
import { PaletteIcon, StarIcon } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Logo } from "@/components/shared/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import type { TKey } from "@/lib/i18n";
import { useActiveNav } from "@/lib/navigation/use-active-nav";
import { useFavoriteEntries, useOrderedNavigation } from "@/lib/navigation/use-navigation";
import { useNavigationStore } from "@/stores/navigation.store";
import { useUiStore } from "@/stores/ui.store";

import { SidebarNavSection } from "./SidebarNavSection";

export function AppSidebar({ side = "left" }: { side?: "left" | "right" }) {
  const { t } = useTranslation();
  const sections = useOrderedNavigation();
  const favorites = useFavoriteEntries();
  const { activeKey, activeSectionId } = useActiveNav();
  const { state, isMobile, setOpenMobile, toggleSidebar } = useSidebar();
  const openCustomizer = useUiStore((s) => s.setCustomizerOpen);
  const collapsed = state === "collapsed" && !isMobile;

  // Sahifa o'zgarganda faqat uning bo'limi ochiq qoladi (Billz uslubi — menyu tartibli turadi).
  // Foydalanuvchi qo'lda boshqa bo'limlarni ham ochishi/yopishi mumkin.
  useEffect(() => {
    if (!activeSectionId) return;
    useNavigationStore.getState().setExpanded([activeSectionId]);
  }, [activeSectionId]);

  return (
    <Sidebar side={side} collapsible="icon" className="border-sidebar-border">
      {/* Header bilan bir chiziqda: h-16 border-b */}
      <SidebarHeader className="h-16 justify-center border-b border-sidebar-border px-3 compact:h-14">
        {collapsed ? (
          <button
            type="button"
            onClick={toggleSidebar}
            className="mx-auto rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            aria-label={t("header.toggleSidebar")}
          >
            <Logo variant="mark" />
          </button>
        ) : (
          <Link
            to="/"
            className="w-fit rounded-lg px-1 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            onClick={() => isMobile && setOpenMobile(false)}
          >
            <Logo />
          </Link>
        )}
      </SidebarHeader>

      <SidebarContent className="gap-0 py-2">
        {favorites.length > 0 && (
          <SidebarGroup className="py-1">
            <SidebarGroupLabel>{t("nav.favorites")}</SidebarGroupLabel>
            <SidebarMenu className="gap-0.5">
              {favorites.map((entry) => {
                const label = entry.item
                  ? t(`nav.${entry.section.id}.${entry.item.id}` as TKey)
                  : t(`nav.${entry.section.id}.title` as TKey);
                return (
                  <SidebarMenuItem key={entry.key}>
                    <SidebarMenuButton asChild tooltip={label} isActive={activeKey === entry.key}>
                      <Link to={entry.to} onClick={() => isMobile && setOpenMobile(false)}>
                        <StarIcon className="fill-current text-warning" />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}

        <SidebarGroup className="py-1">
          {favorites.length > 0 && <SidebarGroupLabel>{t("nav.menu")}</SidebarGroupLabel>}
          <SidebarMenu className="gap-0.5">
            {sections.map((section) => (
              <SidebarNavSection
                key={section.id}
                section={section}
                activeKey={activeKey}
                side={side}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={t("header.customize")}
              onClick={() => {
                if (isMobile) setOpenMobile(false);
                openCustomizer(true);
              }}
            >
              <PaletteIcon />
              <span>{t("header.customize")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
