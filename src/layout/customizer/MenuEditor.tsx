import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EyeIcon,
  EyeOffIcon,
  GripVerticalIcon,
  RotateCcwIcon,
  StarIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { SectionCard } from "@/components/shared/SectionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { NavSection } from "@/config/navigation";
import type { TKey } from "@/lib/i18n";
import { useOrderedNavigation, useSearchableEntries } from "@/lib/navigation/use-navigation";
import { useNavigationStore } from "@/stores/navigation.store";
import { cn } from "@/utils/cn";

function SortableSection({
  section,
  index,
  total,
  hidden,
  onMove,
}: {
  section: NavSection;
  index: number;
  total: number;
  hidden: boolean;
  onMove: (from: number, to: number) => void;
}) {
  const { t } = useTranslation();
  const toggleHidden = useNavigationStore((s) => s.toggleHidden);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });
  const Icon = section.icon;

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 rounded-lg border bg-card py-1.5 pr-1.5 pl-1",
        isDragging && "relative z-10 border-primary shadow-lg",
        hidden && "bg-muted/40"
      )}
    >
      <button
        type="button"
        className="grid size-8 shrink-0 cursor-grab touch-none place-items-center rounded-md text-muted-foreground hover:bg-muted active:cursor-grabbing"
        aria-label={t("menuEditor.dragHint")}
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon className="size-4" />
      </button>
      <Icon className={cn("size-4 shrink-0", hidden ? "text-muted-foreground" : "text-primary")} />
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-sm font-medium",
          hidden && "text-muted-foreground line-through"
        )}
      >
        {t(`nav.${section.id}.title` as TKey)}
      </span>
      {hidden && <Badge variant="muted">{t("menuEditor.hidden")}</Badge>}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          disabled={index === 0}
          onClick={() => onMove(index, index - 1)}
          aria-label={t("menuEditor.moveUp")}
        >
          <ArrowUpIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          disabled={index === total - 1}
          onClick={() => onMove(index, index + 1)}
          aria-label={t("menuEditor.moveDown")}
        >
          <ArrowDownIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          onClick={() => toggleHidden(section.id)}
          aria-label={hidden ? t("menuEditor.show") : t("menuEditor.hide")}
        >
          {hidden ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
    </li>
  );
}

/** Menyu sozlamasi: bo'limlar tartibi (drag & drop), yashirish, sevimli sahifalar */
export function MenuEditor() {
  const { t } = useTranslation();
  const sections = useOrderedNavigation({ includeHidden: true });
  const hidden = useNavigationStore((s) => s.hidden);
  const favorites = useNavigationStore((s) => s.favorites);
  const setOrder = useNavigationStore((s) => s.setOrder);
  const toggleFavorite = useNavigationStore((s) => s.toggleFavorite);
  const reset = useNavigationStore((s) => s.reset);
  const pages = useSearchableEntries();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const ids = sections.map((s) => s.id);
  const move = (from: number, to: number) => {
    // To'liq tartibni saqlaymiz (ruxsat yo'q bo'limlar ham o'z joyida qoladi)
    const full = useNavigationStore.getState().order;
    const next = arrayMove(ids, from, to);
    setOrder([...next, ...full.filter((id) => !next.includes(id))]);
  };
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    move(ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <SectionCard
        className="xl:col-span-7"
        title={t("menuEditor.sections")}
        description={t("menuEditor.dragHint")}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              reset();
              toast.success(t("menuEditor.resetDone"));
            }}
          >
            <RotateCcwIcon />
            <span className="max-sm:hidden">{t("menuEditor.reset")}</span>
          </Button>
        }
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <ul className="grid gap-1.5">
              {sections.map((section, i) => (
                <SortableSection
                  key={section.id}
                  section={section}
                  index={i}
                  total={sections.length}
                  hidden={hidden.includes(section.id)}
                  onMove={move}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </SectionCard>

      <SectionCard
        className="xl:col-span-5"
        icon={StarIcon}
        iconTone="warning"
        title={t("menuEditor.favorites")}
        description={t("menuEditor.favoritesHint")}
        contentClassName="px-0 sm:px-0"
      >
        <ul className="max-h-[32rem] divide-y overflow-y-auto border-t">
          {pages.map((entry) => {
            const isFav = favorites.includes(entry.key);
            const Icon = entry.section.icon;
            const label = entry.item
              ? t(`nav.${entry.section.id}.${entry.item.id}` as TKey)
              : t(`nav.${entry.section.id}.title` as TKey);
            return (
              <li key={entry.key} className="flex items-center gap-3 px-4 py-2 sm:px-5">
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{label}</p>
                  {entry.item && (
                    <p className="truncate text-xs text-muted-foreground">
                      {t(`nav.${entry.section.id}.title` as TKey)}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => toggleFavorite(entry.key)}
                  aria-pressed={isFav}
                  aria-label={isFav ? t("common.removeFromFavorites") : t("common.addToFavorites")}
                  className={cn(isFav ? "text-warning" : "text-muted-foreground")}
                >
                  <StarIcon className={cn(isFav && "fill-current")} />
                </Button>
              </li>
            );
          })}
        </ul>
      </SectionCard>
    </div>
  );
}
