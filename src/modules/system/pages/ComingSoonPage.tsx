import { Link } from "@tanstack/react-router";
import { StarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import type { TKey } from "@/lib/i18n";
import { useActiveNav } from "@/lib/navigation/use-active-nav";
import { useNavigationStore } from "@/stores/navigation.store";
import { cn } from "@/utils/cn";

/**
 * Hali qurilmagan sahifa. Sarlavha va ikon nav config'dan avtomatik olinadi —
 * modulga yangi route qo'shilganda shu sahifa darhol ishlaydi, keyin haqiqiy sahifa bilan almashtiriladi.
 */
export function ComingSoonPage() {
  const { t } = useTranslation();
  const { entry } = useActiveNav();
  const favorites = useNavigationStore((s) => s.favorites);
  const toggleFavorite = useNavigationStore((s) => s.toggleFavorite);

  if (!entry) return null;
  const title = entry.item
    ? t(`nav.${entry.section.id}.${entry.item.id}` as TKey)
    : t(`nav.${entry.section.id}.title` as TKey);
  const isFav = favorites.includes(entry.key);

  return (
    <div className="space-y-4">
      <PageHeader
        title={title}
        description={t(`nav.${entry.section.id}.title` as TKey)}
        actions={
          <Button variant="outline" onClick={() => toggleFavorite(entry.key)} aria-pressed={isFav}>
            <StarIcon className={cn(isFav && "fill-current text-warning")} />
            {isFav ? t("common.removeFromFavorites") : t("common.addToFavorites")}
          </Button>
        }
      />
      <EmptyState
        icon={entry.section.icon}
        tone="primary"
        className="min-h-[24rem]"
        title={t("common.comingSoon")}
        description={t("common.comingSoonDescription")}
        action={
          <Button asChild variant="outline">
            <Link to="/">{t("errors.goHome")}</Link>
          </Button>
        }
      />
    </div>
  );
}
