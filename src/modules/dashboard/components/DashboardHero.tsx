import { Link } from "@tanstack/react-router";
import { PackagePlusIcon, ShoppingCartIcon, UserPlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import type { TKey } from "@/lib/i18n";
import { Can } from "@/lib/rbac";
import { BRANCHES } from "@/mocks/branches";
import { useAuthStore } from "@/stores/auth.store";
import { useBranchStore } from "@/stores/branch.store";
import { useRolesStore } from "@/stores/roles.store";

function greetingKey(): TKey {
  const h = new Date().getHours();
  if (h < 12) return "dashboard.greeting.morning";
  if (h < 18) return "dashboard.greeting.afternoon";
  return "dashboard.greeting.evening";
}

/** Bosh sahifa hero'si — kit'dagi ataylab "urg'u" joyi: to'liq brend fon */
export function DashboardHero() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const role = useRolesStore((s) => s.roles.find((r) => r.id === user?.roleId));
  const branchId = useBranchStore((s) => s.branchId);
  const branch = BRANCHES.find((b) => b.id === branchId);
  if (!user) return null;

  const today = new Intl.DateTimeFormat(i18n.resolvedLanguage, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const chip = "rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium sm:text-sm";

  return (
    <section className="relative isolate overflow-hidden rounded-2xl bg-primary text-primary-foreground">
      <span
        aria-hidden
        className="absolute -top-24 -right-16 -z-10 size-72 rounded-full bg-primary-foreground/10"
      />
      <span
        aria-hidden
        className="absolute top-24 -left-20 -z-10 size-56 rounded-full bg-primary-foreground/5"
      />

      <div className="flex flex-col gap-5 px-5 py-6 sm:px-8 sm:py-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4 sm:gap-5">
          <UserAvatar
            name={`${user.firstName} ${user.lastName}`}
            size="lg"
            className="size-14 rounded-2xl ring-4 ring-primary-foreground/25 sm:size-16 [&_[data-slot=avatar-fallback]]:rounded-2xl [&_[data-slot=avatar-fallback]]:bg-primary-foreground [&_[data-slot=avatar-fallback]]:text-primary"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-primary-foreground/80 first-letter:uppercase">
              {today}
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-balance sm:text-3xl">
              {t(greetingKey(), { name: user.firstName })}
            </h1>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <span className={chip}>{branch?.name ?? t("header.allBranches")}</span>
              {role && (
                <span className={chip}>{role.system ? t(role.name as TKey) : role.name}</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
          <Can permission="pos.access">
            <Button
              asChild
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 max-sm:h-auto max-sm:flex-col max-sm:py-2.5 max-sm:text-xs"
            >
              <Link to="/sales/pos">
                <ShoppingCartIcon />
                {t("dashboard.newSale")}
              </Link>
            </Button>
          </Can>
          <Can permission="products.create">
            <Button
              asChild
              className="bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25 max-sm:h-auto max-sm:flex-col max-sm:py-2.5 max-sm:text-xs"
            >
              <Link to="/products">
                <PackagePlusIcon />
                {t("dashboard.newProduct")}
              </Link>
            </Button>
          </Can>
          <Can permission="customers.create">
            <Button
              asChild
              className="bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25 max-sm:h-auto max-sm:flex-col max-sm:py-2.5 max-sm:text-xs"
            >
              <Link to="/customers">
                <UserPlusIcon />
                {t("dashboard.newCustomer")}
              </Link>
            </Button>
          </Can>
        </div>
      </div>
    </section>
  );
}
