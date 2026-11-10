import { useNavigate } from "@tanstack/react-router";
import {
  CheckIcon,
  FlaskConicalIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  PaletteIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { env } from "@/config/env";
import type { ThemeMode } from "@/config/theme";
import type { TKey } from "@/lib/i18n";
import { useAuthStore } from "@/stores/auth.store";
import { usePreferences } from "@/stores/preferences.store";
import { useRolesStore } from "@/stores/roles.store";
import { useUiStore } from "@/stores/ui.store";

const MODE_ICONS = { light: SunIcon, dark: MoonIcon, system: MonitorIcon } as const;

export function UserMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const switchRole = useAuthStore((s) => s.switchRole);
  const roles = useRolesStore((s) => s.roles);
  const mode = usePreferences((s) => s.mode);
  const setPref = usePreferences((s) => s.set);
  const openCustomizer = useUiStore((s) => s.setCustomizerOpen);

  if (!user) return null;
  const name = `${user.firstName} ${user.lastName}`;
  const role = roles.find((r) => r.id === user.roleId);
  const roleName = (r?: { name: string; system?: boolean }) =>
    r ? (r.system ? t(r.name as TKey) : r.name) : "—";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 gap-2 px-1 sm:pr-2.5"
          aria-label={t("header.profile")}
        >
          <UserAvatar name={name} src={user.avatarUrl} />
          <span className="hidden min-w-0 text-left leading-tight xl:block">
            <span className="block truncate text-sm font-medium">{name}</span>
            <span className="block truncate text-xs font-normal text-muted-foreground">
              {roleName(role)}
            </span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-3 py-2">
          <UserAvatar name={name} src={user.avatarUrl} size="lg" className="size-10" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs font-normal text-muted-foreground">{user.phone}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon />
            {t("header.profile")}
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {(() => {
                const Icon = MODE_ICONS[mode];
                return <Icon />;
              })()}
              {t("header.theme")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={mode}
                onValueChange={(v) => setPref("mode", v as ThemeMode)}
              >
                {(Object.keys(MODE_ICONS) as ThemeMode[]).map((m) => {
                  const Icon = MODE_ICONS[m];
                  return (
                    <DropdownMenuRadioItem key={m} value={m}>
                      <Icon />
                      {t(`theme.modes.${m}`)}
                    </DropdownMenuRadioItem>
                  );
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem onClick={() => openCustomizer(true)}>
            <PaletteIcon />
            {t("header.customize")}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {env.VITE_ENABLE_ROLE_SWITCHER && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <FlaskConicalIcon />
                <span className="flex-1">{t("header.devRole")}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-52">
                {roles.map((r) => (
                  <DropdownMenuItem key={r.id} onClick={() => switchRole(r.id)}>
                    {roleName(r)}
                    {r.id === user.roleId && <CheckIcon className="ml-auto" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            logout();
            void navigate({ to: "/login" });
          }}
        >
          <LogOutIcon />
          {t("header.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
