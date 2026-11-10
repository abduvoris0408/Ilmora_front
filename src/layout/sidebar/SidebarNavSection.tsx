import { Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { NavSection } from "@/config/navigation";
import type { TKey } from "@/lib/i18n";
import { useNavigationStore } from "@/stores/navigation.store";
import { cn } from "@/utils/cn";

/** Faol band chizig'i (chap chetda 3px). O'ng sidebar'da — o'ng chetda. */
function ActiveBar({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute top-1.5 bottom-1.5 w-[3px] bg-sidebar-primary",
        side === "left" ? "-left-2 rounded-r-full" : "-right-2 rounded-l-full"
      )}
    />
  );
}

export function SidebarNavSection({
  section,
  activeKey,
  side,
}: {
  section: NavSection;
  activeKey?: string;
  side: "left" | "right";
}) {
  const { t } = useTranslation();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const expanded = useNavigationStore((s) => s.expanded.includes(section.id));
  const toggleExpanded = useNavigationStore((s) => s.toggleExpanded);

  const Icon = section.icon;
  const title = t(`nav.${section.id}.title` as TKey);
  const sectionActive = activeKey === section.id || activeKey?.startsWith(`${section.id}.`);
  const closeMobile = () => isMobile && setOpenMobile(false);

  // 1) Bitta sahifali bo'lim (Bosh sahifa)
  if (!section.items && section.to) {
    return (
      <SidebarMenuItem className="relative">
        {sectionActive && <ActiveBar side={side} />}
        <SidebarMenuButton asChild isActive={sectionActive} tooltip={title}>
          <Link to={section.to} onClick={closeMobile}>
            <Icon />
            <span>{title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  const items = section.items ?? [];

  // 2) Yig'ilgan (faqat ikon) rejim — o'ng tomonga chiquvchi menyu
  if (state === "collapsed" && !isMobile) {
    return (
      <SidebarMenuItem className="relative">
        {sectionActive && <ActiveBar side={side} />}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton isActive={sectionActive} tooltip={title}>
              <Icon />
              <span>{title}</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={side === "left" ? "right" : "left"}
            align="start"
            className="min-w-56"
          >
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              {title}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {items.map((item) => {
              const key = `${section.id}.${item.id}`;
              return (
                <DropdownMenuItem
                  key={item.id}
                  asChild
                  className={cn(activeKey === key && "bg-accent text-accent-foreground")}
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
      </SidebarMenuItem>
    );
  }

  // 3) Ochiq rejim — accordion (Billz uslubi: o'ngda chevron)
  const open = expanded;
  return (
    <Collapsible asChild open={open} onOpenChange={() => toggleExpanded(section.id)}>
      <SidebarMenuItem className="relative">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={title}
            className={cn(sectionActive && "font-medium text-sidebar-accent-foreground")}
          >
            <Icon />
            <span>{title}</span>
            <ChevronRightIcon
              className={cn(
                "ml-auto size-4 opacity-60 transition-transform duration-200",
                open && "rotate-90"
              )}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <SidebarMenuSub className="mt-0.5 mr-0 gap-0.5 pr-0">
            {items.map((item) => {
              const key = `${section.id}.${item.id}`;
              const active = activeKey === key;
              return (
                <SidebarMenuSubItem key={item.id}>
                  <SidebarMenuSubButton asChild isActive={active}>
                    <Link to={item.to} onClick={closeMobile}>
                      <span>{t(`nav.${section.id}.${item.id}` as TKey)}</span>
                      {item.isNew && (
                        <Badge variant="brand" className="ml-auto h-4 px-1.5 text-[0.625rem]">
                          {t("common.new")}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
