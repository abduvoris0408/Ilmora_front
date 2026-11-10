import {
  BellIcon,
  CheckCheckIcon,
  PackageXIcon,
  ReceiptTextIcon,
  UserPlusIcon,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/shared/EmptyState";
import { IconBox, type IconTone } from "@/components/shared/IconBox";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/utils/cn";
import { formatRelative } from "@/utils/format";

interface Notification {
  id: string;
  icon: LucideIcon;
  tone: IconTone;
  title: string;
  text: string;
  at: number;
  read: boolean;
}

// Statik namuna — backend ulanganda WebSocket/SSE orqali keladi
const SAMPLE: Notification[] = [
  {
    id: "n1",
    icon: PackageXIcon,
    tone: "danger",
    title: "Coca-Cola 1.5L",
    text: "Chilonzor filialida 4 dona qoldi",
    at: Date.now() - 6 * 60_000,
    read: false,
  },
  {
    id: "n2",
    icon: ReceiptTextIcon,
    tone: "primary",
    title: "Qaytarish so'rovi",
    text: "Chek #10482 bo'yicha 245 000 so'm",
    at: Date.now() - 42 * 60_000,
    read: false,
  },
  {
    id: "n3",
    icon: UserPlusIcon,
    tone: "success",
    title: "Yangi xodim",
    text: "Malika Saidova — Kassir, Yunusobod",
    at: Date.now() - 5 * 3_600_000,
    read: true,
  },
];

export function NotificationsPopover() {
  const { t } = useTranslation();
  const [items, setItems] = useState(SAMPLE);
  const unread = items.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative text-muted-foreground"
          aria-label={t("header.notifications")}
        >
          <BellIcon />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[0.625rem] font-semibold text-destructive-foreground tabular-nums">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">{t("header.notifications")}</p>
          {unread > 0 && (
            <Button
              variant="ghost"
              size="xs"
              className="text-muted-foreground"
              onClick={() => setItems((s) => s.map((n) => ({ ...n, read: true })))}
            >
              <CheckCheckIcon />
              {t("header.markAllRead")}
            </Button>
          )}
        </div>
        {items.length === 0 ? (
          <EmptyState bordered={false} icon={BellIcon} title={t("header.noNotifications")} />
        ) : (
          <ScrollArea className="max-h-80">
            <ul className="divide-y">
              {items.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    "flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
                    !n.read && "bg-accent/30"
                  )}
                >
                  <IconBox icon={n.icon} tone={n.tone} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{n.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{n.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatRelative(n.at)}</p>
                  </div>
                  {!n.read && (
                    <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                  )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
