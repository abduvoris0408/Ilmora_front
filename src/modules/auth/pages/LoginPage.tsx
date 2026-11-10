import { getRouteApi } from "@tanstack/react-router";
import { CheckIcon, LifeBuoyIcon, SparklesIcon, TrendingUpIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { LiquidGlass } from "@/components/shared/LiquidGlass";
import { Logo } from "@/components/shared/Logo";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { APP } from "@/config/app";
import { LanguageSwitcher } from "@/layout/header/LanguageSwitcher";

import { GlassStage, LoginBackdrop } from "../components/LoginBackdrop";
import { LoginForm } from "../components/LoginForm";

const routeApi = getRouteApi("/public/login");

const STATS = [
  { value: "1 200+", key: "auth.statStores" },
  { value: "99,9%", key: "auth.statUptime" },
  { value: "24/7", key: "auth.statSupport" },
] as const;

const AVATARS = ["Madina Rahimova", "Sardor Yusupov", "Laylo Saidova", "Otabek Nazarov"];

/** Suzuvchi mini-vidjet: "Yangi sotuv" */
function SaleWidget() {
  const { t } = useTranslation();
  return (
    <LiquidGlass
      refract={false}
      blur={16}
      className="rounded-2xl"
      contentClassName="flex items-center gap-3 py-3 pr-5 pl-3"
    >
      <span className="grid size-9 place-items-center rounded-full bg-success text-success-foreground">
        <CheckIcon className="size-4" strokeWidth={3} />
      </span>
      <div className="leading-tight">
        <p className="text-xs text-muted-foreground">
          {t("auth.widgetSale")} · {t("auth.justNow")}
        </p>
        <p className="text-sm font-semibold tabular-nums">
          +245 000 <span className="font-normal text-muted-foreground">{t("common.currency")}</span>
        </p>
      </div>
    </LiquidGlass>
  );
}

/** Suzuvchi mini-vidjet: "Bugungi tushum" + mini grafik */
function RevenueWidget() {
  const { t } = useTranslation();
  const bars = [30, 45, 38, 56, 50, 68, 62, 84];
  return (
    <LiquidGlass
      refract={false}
      blur={16}
      className="rounded-2xl"
      contentClassName="w-56 space-y-3 p-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{t("auth.widgetRevenue")}</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-success">
          <TrendingUpIcon className="size-3" />
          12,4%
        </span>
      </div>
      <p className="text-2xl leading-none font-semibold tracking-tight tabular-nums">
        34,8 <span className="text-sm font-normal text-muted-foreground">mln</span>
      </p>
      <div className="flex h-10 items-end gap-1">
        {bars.map((h, i) => (
          <span
            key={i}
            className={
              i === bars.length - 1
                ? "flex-1 rounded-sm bg-primary"
                : "flex-1 rounded-sm bg-primary/30"
            }
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </LiquidGlass>
  );
}

/**
 * LOGIN — SaaS uslubi: chapda qisqa taqdimot, o'ngda liquid glass kartochka.
 * Fon — kabinet maketi (shisha uni "sindiradi"). Mavzu (yorug'/qorong'i) va brend rangiga moslashadi.
 */
export function LoginPage() {
  const { t } = useTranslation();
  const { redirect } = routeApi.useSearch();

  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden">
      <LoginBackdrop />

      <header className="flex items-center justify-between px-5 pt-5 sm:px-10 sm:pt-7">
        <Logo className="[&>span:first-child]:bg-primary [&>span:first-child]:text-primary-foreground" />
        <LanguageSwitcher
          variant="label"
          className="rounded-full border-foreground/10 bg-background/50 backdrop-blur-md hover:bg-background/80"
        />
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-5 py-10 sm:px-10 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-16 xl:gap-24">
        {/* Taqdimot — faqat lg+ */}
        <section className="motion-safe:animate-in motion-safe:duration-700 motion-safe:fade-in motion-safe:slide-in-from-left-4 max-lg:hidden">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 py-1 pr-3.5 pl-1.5 text-sm font-medium text-primary backdrop-blur-md">
            <span className="grid size-6 place-items-center rounded-full bg-primary text-primary-foreground">
              <SparklesIcon className="size-3.5" />
            </span>
            {t("auth.badge")}
          </span>

          <h1 className="mt-6 text-5xl leading-[1.05] font-semibold tracking-tight text-balance xl:text-6xl">
            {t("auth.heroTitle")}
            <br />
            <span className="text-primary">{t("auth.heroAccent")}</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-pretty text-muted-foreground">
            {t("auth.heroText")}
          </p>

          <dl className="mt-10 flex max-w-lg divide-x divide-foreground/10">
            {STATS.map((s) => (
              <div key={s.key} className="flex-1 px-5 first:pl-0">
                <dt className="sr-only">{t(s.key)}</dt>
                <dd className="text-2xl font-semibold tracking-tight tabular-nums">{s.value}</dd>
                <dd className="mt-0.5 text-sm text-muted-foreground">{t(s.key)}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-2">
              {AVATARS.map((n) => (
                <UserAvatar key={n} name={n} className="size-9 ring-2 ring-background" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{t("auth.trustedBy")}</p>
          </div>
        </section>

        {/* Kirish kartochkasi.
            ⚠️ Shisha ajdodlarida opacity/filter/mask bo'lmasin (animatsiya ham) — aks holda backdrop
            "kesiladi" va shisha orqasidagi fonni ko'rmay qoladi. */}
        <section className="relative mx-auto w-full max-w-md">
          <GlassStage />
          <div className="absolute -top-10 -left-28 z-10 motion-safe:animate-float max-xl:hidden">
            <SaleWidget />
          </div>
          <div className="absolute -bottom-14 -left-36 z-10 motion-safe:animate-float motion-safe:[animation-delay:-3s] max-xl:hidden">
            <RevenueWidget />
          </div>

          <LiquidGlass className="rounded-[2rem]" contentClassName="p-6 sm:p-9">
            <div className="mb-8 space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">{t("auth.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("auth.subtitle")}</p>
            </div>
            <LoginForm redirect={redirect} />
          </LiquidGlass>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("auth.noAccount")}{" "}
            <button type="button" className="font-medium text-primary hover:underline">
              {t("auth.requestDemo")}
            </button>
          </p>
        </section>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-2 px-5 pb-5 text-xs text-muted-foreground sm:px-10 sm:pb-7">
        <span>
          © {new Date().getFullYear()} {APP.name} · {t("app.tagline")}
        </span>
        <a
          href={`tel:${APP.supportPhone.replace(/\s/g, "")}`}
          className="inline-flex items-center gap-1.5 hover:text-foreground"
        >
          <LifeBuoyIcon className="size-3.5" />
          {t("auth.help")}: {APP.supportPhone}
        </a>
      </footer>
    </div>
  );
}
