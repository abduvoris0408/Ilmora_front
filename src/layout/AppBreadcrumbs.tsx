import { Link } from "@tanstack/react-router";
import { HomeIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { TKey } from "@/lib/i18n";
import { useActiveNav } from "@/lib/navigation/use-active-nav";

/** Navigatsiya config'idan avtomatik: Bosh sahifa / Bo'lim / Sahifa. Mobilda yashirin. */
export function AppBreadcrumbs() {
  const { t } = useTranslation();
  const { entry } = useActiveNav();
  if (!entry || entry.key === "dashboard") return null;

  return (
    <Breadcrumb className="mb-3 max-sm:hidden">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" aria-label={t("nav.dashboard.title")}>
              <HomeIcon className="size-3.5" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>{t(`nav.${entry.section.id}.title` as TKey)}</BreadcrumbItem>
        {entry.item && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {t(`nav.${entry.section.id}.${entry.item.id}` as TKey)}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
