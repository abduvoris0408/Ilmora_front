import { CircleHelpIcon, TriangleAlertIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/utils/cn";

/** `confirm()` funksiyasi shu komponentni ochadi. To'g'ridan-to'g'ri ham ishlatish mumkin. */
export function ConfirmDialog({
  open,
  onResult,
  title,
  description,
  confirmText,
  cancelText,
  destructive = false,
  onConfirm,
}: {
  open: boolean;
  onResult: (confirmed: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  destructive?: boolean;
  onConfirm?: () => unknown | Promise<unknown>;
}) {
  const { t } = useTranslation();
  const [pending, setPending] = useState(false);
  const Icon = destructive ? TriangleAlertIcon : CircleHelpIcon;

  async function handleConfirm() {
    if (!onConfirm) return onResult(true);
    try {
      setPending(true);
      await onConfirm();
      onResult(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && !pending && onResult(false)}>
      <AlertDialogContent size="sm" className="sm:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogMedia
            className={cn(
              "size-12 rounded-full",
              destructive ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
            )}
          >
            <Icon className="size-6" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-base">
            {title ?? t("overlays.confirmTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-pretty">
            {description ?? t("overlays.confirmDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>
            {cancelText ?? t("common.cancel")}
          </AlertDialogCancel>
          <Button
            variant={destructive ? "destructive" : "default"}
            disabled={pending}
            onClick={handleConfirm}
          >
            {pending && <Spinner />}
            {confirmText ?? (destructive ? t("common.delete") : t("common.confirm"))}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
