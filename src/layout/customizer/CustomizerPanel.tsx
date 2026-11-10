import { Link } from "@tanstack/react-router";
import { ListTreeIcon, RotateCcwIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { SidePanel } from "@/components/shared/overlays/SidePanel";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/stores/preferences.store";
import { useUiStore } from "@/stores/ui.store";

import { AppearanceSettings } from "./AppearanceSettings";

/** O'ngdan chiquvchi "Interfeys sozlamalari" paneli (header'dagi palitra tugmasi) */
export function CustomizerPanel() {
  const { t } = useTranslation();
  const open = useUiStore((s) => s.customizerOpen);
  const setOpen = useUiStore((s) => s.setCustomizerOpen);
  const reset = usePreferences((s) => s.reset);

  return (
    <SidePanel
      open={open}
      onOpenChange={setOpen}
      title={t("theme.title")}
      description={t("theme.description")}
      size="md"
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => {
              reset();
              toast.success(t("theme.resetDone"));
            }}
          >
            <RotateCcwIcon />
            {t("theme.reset")}
          </Button>
          <Button asChild variant="secondary" onClick={() => setOpen(false)}>
            <Link to="/settings/menu">
              <ListTreeIcon />
              {t("theme.menuSettings")}
            </Link>
          </Button>
        </>
      }
    >
      <AppearanceSettings />
    </SidePanel>
  );
}
