import { Link } from "@tanstack/react-router";
import { LayoutDashboardIcon, MenuIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useSidebar } from "@/components/ui/sidebar";
import type { TKey } from "@/lib/i18n";
import { useActiveNav } from "@/lib/navigation/use-active-nav";
import { useFavoriteEntries } from "@/lib/navigation/use-navigation";
import { useCan } from "@/lib/rbac/use-permission";
import { cn } from "@/utils/cn";

/**
 * MOBIL PASTKI PANEL (md dan kichik): Bosh sahifa · 3 ta sevimli sahifa · Menyu.
 * Sevimlilar Sozlamalar → Menyu sozlamasi'da tanlanadi. iPhone "home indicator" uchun safe-area.
 */
export function MobileTabBar() {
  const { t } = useTranslation();
  const { setOpenMobile } = useSidebar();
  const favorites = useFavoriteEntries().slice(0, 3);
  const { activeKey } = useActiveNav();
  const canDashboard = useCan("dashboard.view");

  const tabClass = (active: boolean) =>
    cn(
      "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 text-[0.6875rem] font-medium text-muted-foreground transition-colors [&_svg]:size-5",
      active && "text-primary"
    );

  return (
    <nav
      aria-label={t("nav.menu")}
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/85 md:hidden"
    >
      <div className="flex h-16">
        {canDashboard && (
          <Link to="/" className={tabClass(activeKey === "dashboard")}>
            <LayoutDashboardIcon />
            <span className="truncate">{t("nav.dashboard.title")}</span>
          </Link>
        )}
        {favorites.map((entry) => {
          const Icon = entry.section.icon;
          const label = entry.item
            ? t(`nav.${entry.section.id}.${entry.item.id}` as TKey)
            : t(`nav.${entry.section.id}.title` as TKey);
          return (
            <Link key={entry.key} to={entry.to} className={tabClass(activeKey === entry.key)}>
              <Icon />
              <span className="max-w-full truncate">{label}</span>
            </Link>
          );
        })}
        <button type="button" className={tabClass(false)} onClick={() => setOpenMobile(true)}>
          <MenuIcon />
          <span>{t("nav.menu")}</span>
        </button>
      </div>
    </nav>
  );
}
