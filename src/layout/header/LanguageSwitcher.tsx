import { CheckIcon, LanguagesIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGUAGES } from "@/lib/i18n";
import { cn } from "@/utils/cn";

export function LanguageSwitcher({
  variant = "icon",
  className,
}: {
  variant?: "icon" | "label";
  className?: string;
}) {
  const { t, i18n } = useTranslation();
  const current = LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) ?? LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "icon" ? (
          <Button
            variant="outline"
            size="icon"
            className={cn("text-xs font-semibold text-muted-foreground", className)}
            aria-label={t("header.language")}
          >
            {current.short}
          </Button>
        ) : (
          <Button variant="outline" className={className}>
            <LanguagesIcon />
            {current.label}
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem key={lang.code} onClick={() => void i18n.changeLanguage(lang.code)}>
            <span className="w-6 text-xs font-semibold text-muted-foreground">{lang.short}</span>
            {lang.label}
            {lang.code === current.code && <CheckIcon className="ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
