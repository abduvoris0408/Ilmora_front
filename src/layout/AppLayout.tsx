import { Outlet, useMatches } from "@tanstack/react-router";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useBreakpoint } from "@/lib/hooks/use-breakpoint";
import { useActiveNav } from "@/lib/navigation/use-active-nav";
import { useCan } from "@/lib/rbac/use-permission";
import { ForbiddenPage } from "@/modules/system/pages/ForbiddenPage";
import { usePreferences } from "@/stores/preferences.store";
import { cn } from "@/utils/cn";

import { AppBreadcrumbs } from "./AppBreadcrumbs";
import { CustomizerPanel } from "./customizer/CustomizerPanel";
import { AppHeader } from "./header/AppHeader";
import { MobileTabBar } from "./mobile/MobileTabBar";
import { AppSidebar } from "./sidebar/AppSidebar";
import { TopNav } from "./topnav/TopNav";

/**
 * Sahifa ruxsatini tekshiradi. Manba: route `staticData.permission`, bo'lmasa — nav config'dagi
 * band ruxsati. Rol almashsa darhol qayta tekshiriladi (reaktiv).
 */
function PageGuard() {
  const matches = useMatches();
  const { entry } = useActiveNav();
  const routePermission = [...matches].reverse().find((m) => m.staticData?.permission)
    ?.staticData.permission;
  const allowed = useCan(routePermission ?? entry?.permission);
  return allowed ? <Outlet /> : <ForbiddenPage />;
}

/**
 * KABINET KARKASI
 *
 *  layout = left | right  →  [Sidebar] [Header / main]   (md dan kichikda sidebar — chiquvchi panel)
 *  layout = top           →  [Header] [TopNav] [main]    (lg dan kichikda avtomatik sidebar rejimiga o'tadi)
 *
 * Mobilda pastda tab-bar, shuning uchun main'ga pastdan qo'shimcha joy.
 */
export function AppLayout() {
  const layout = usePreferences((s) => s.layout);
  const sidebarOpen = usePreferences((s) => s.sidebarOpen);
  const contentWidth = usePreferences((s) => s.contentWidth);
  const setPref = usePreferences((s) => s.set);
  const isLg = useBreakpoint("lg");

  const topNav = layout === "top" && isLg;
  const side = layout === "right" ? "right" : "left";

  const sidebar = !topNav && <AppSidebar side={side} />;

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={(v) => setPref("sidebarOpen", v)}>
      {side === "left" && sidebar}
      <SidebarInset className="min-w-0">
        <AppHeader showSidebarToggle={!topNav} showLogo={topNav} side={side} />
        {topNav && <TopNav />}
        <main className="flex-1 px-4 pt-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:px-6 sm:pt-6 md:pb-12 lg:pt-8 compact:lg:pt-6">
          <div className={cn("mx-auto w-full", contentWidth === "boxed" && "max-w-[90rem]")}>
            <AppBreadcrumbs />
            <PageGuard />
          </div>
        </main>
      </SidebarInset>
      {side === "right" && sidebar}
      {/* md dan kichikda ko'rinadi; "Menyu" tugmasi sidebar panelini ochadi (mobilda sidebar doim render) */}
      <MobileTabBar />
      <CustomizerPanel />
    </SidebarProvider>
  );
}
