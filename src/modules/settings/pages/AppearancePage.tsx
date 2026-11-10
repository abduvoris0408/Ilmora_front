import { RotateCcwIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/ui/button";
import { AppearanceSettings } from "@/layout/customizer/AppearanceSettings";
import { LanguageSwitcher } from "@/layout/header/LanguageSwitcher";
import { usePreferences } from "@/stores/preferences.store";

export function AppearancePage() {
  const { t } = useTranslation();
  const reset = usePreferences((s) => s.reset);

  return (
    <div className="space-y-4">
      <PageHeader
        title={t("settingsPage.appearance.title")}
        description={t("settingsPage.appearance.description")}
        actions={
          <>
            <LanguageSwitcher variant="label" />
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
          </>
        }
      />
      <SectionCard className="max-w-3xl">
        <AppearanceSettings />
      </SectionCard>
    </div>
  );
}
