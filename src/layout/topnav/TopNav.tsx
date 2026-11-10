import { Link } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TKey } from "@/lib/i18n";
import { useActiveNav } from "@/lib/navigation/use-active-nav";
import { useOrderedNavigation } from "@/lib/navigation/use-navigation";
import { cn } from "@/utils/cn";

/**
 * TEPA MENYU — layout="top" va lg (1024) dan katta ekranda. Sidebar token'laridan foydalanadi,
 * shuning uchun "To'q"/"Brend" menyu uslubi bu yerda ham ishlaydi. Sig'masa — gorizontal scroll.
 */
export function TopNav() {
  const { t } = useTranslation();
  const sections = useOrderedNavigation();
  const { activeKey } = useActiveNav();

  const itemClass = (active: boolean) =>
    cn(
      "relative inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm whitespace-nowrap text-sidebar-foreground transition-colors outline-none hover:bg-sidebar-muted focus-visible:ring-2 focus-visible:ring-sidebar-ring data-[state=open]:bg-sidebar-muted [&_svg]:size-4 [&_svg]:shrink-0",
      active &&
        "bg-sidebar-accent font-medium text-sidebar-accent-foreground hover:bg-sidebar-accent"
    );

  return (
    <nav
      aria-label={t("nav.menu")}
      className="sticky top-16 z-10 border-b border-sidebar-border bg-sidebar compact:top-14"
    >
      <div className="flex h-12 items-center gap-1 overflow-x-auto px-4 sm:px-6">
        {sections.map((section) => {
          const Icon = section.icon;
          const title = t(`nav.${section.id}.title` as TKey);
          const active =
            activeKey === section.id || Boolean(activeKey?.startsWith(`${section.id}.`));

          if (!section.items && section.to) {
            return (
              <Link key={section.id} to={section.to} className={itemClass(active)}>
                <Icon />
                {title}
              </Link>
            );
          }

          return (
            <DropdownMenu key={section.id}>
              <DropdownMenuTrigger className={itemClass(active)}>
                <Icon />
                {title}
                <ChevronDownIcon className="opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-56">
                {section.items?.map((item) => {
                  const key = `${section.id}.${item.id}`;
                  return (
                    <DropdownMenuItem
                      key={item.id}
                      asChild
                      className={cn(
                        activeKey === key && "bg-accent font-medium text-accent-foreground"
                      )}
                    >
                      <Link to={item.to}>
                        {t(`nav.${section.id}.${item.id}` as TKey)}
                        {item.isNew && (
                          <Badge variant="brand" className="ml-auto">
                            {t("common.new")}
                          </Badge>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}
      </div>
    </nav>
  );
}
