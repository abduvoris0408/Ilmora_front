import {
  PanelLeftCloseIcon,
  PanelLeftIcon,
  PanelLeftOpenIcon,
  PanelRightCloseIcon,
  PanelRightOpenIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarToggle({ side = "left" }: { side?: "left" | "right" }) {
  const { t } = useTranslation();
  const { state, isMobile, toggleSidebar } = useSidebar();
  const Icon = isMobile
    ? PanelLeftIcon
    : side === "left"
      ? state === "expanded"
        ? PanelLeftCloseIcon
        : PanelLeftOpenIcon
      : state === "expanded"
        ? PanelRightCloseIcon
        : PanelRightOpenIcon;

  return (
    <Button
      variant="outline"
      size="icon"
      className="shrink-0 text-muted-foreground"
      onClick={toggleSidebar}
      aria-label={t("header.toggleSidebar")}
    >
      <Icon />
    </Button>
  );
}
