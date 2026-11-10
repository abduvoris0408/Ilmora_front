import type { ErrorComponentProps } from "@tanstack/react-router";
import { OctagonAlertIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { StatusScreen } from "@/components/shared/StatusScreen";
import { Button } from "@/components/ui/button";

export function ErrorPage({ error, reset }: ErrorComponentProps) {
  const { t } = useTranslation();
  return (
    <div className="grid min-h-[60dvh] place-items-center">
      <StatusScreen
        icon={OctagonAlertIcon}
        tone="danger"
        title={t("errors.generic.title")}
        description={
          <>
            {t("errors.generic.description")}
            {import.meta.env.DEV && error instanceof Error && (
              <code className="mt-4 block rounded-lg bg-muted p-3 text-left text-xs break-words text-destructive">
                {error.message}
              </code>
            )}
          </>
        }
        actions={
          <>
            <Button variant="outline" onClick={() => window.location.assign("/")}>
              {t("errors.goHome")}
            </Button>
            <Button onClick={reset}>{t("errors.retry")}</Button>
          </>
        }
      />
    </div>
  );
}
