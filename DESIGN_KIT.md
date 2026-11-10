# Dizayn to'plami — yangi loyiha uchun setup

Intalim frontendidagi dizayn tizimi, boshqa loyihaga ko'chirishga tayyor holatda.
Hujjat o'zi yetarli: kodni shu yerdan nusxa qilib, ketma-ket qadamlar bilan qayta qurish mumkin.

---

## 1. Uslub — bir qarashda

**Minimal admin panel.** Oq sirtlar, yupqa chegaralar, bitta brend rangi.

| Qaror          | Qoida                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------ |
| Sirtlar        | Oq `card`, ajratish — faqat `border`. **Soya, gradient, nuqta/to'r fon, glow — yo'q.**     |
| Brend          | Bitta rang — `primary` (ko'k, OKLCH hue 259). Boshqa urg'u rangi yo'q.                     |
| Faol holat     | `accent` (och ko'k) fon + ko'k matn. Sidebar'da — chap chetda 3px ko'k chiziq.             |
| Hover          | Neytral `muted` (kulrang), **ko'k emas**.                                                  |
| Holat ranglari | Faqat yumshoq chiplarda: `bg-x/10 text-x` (success / warning / info / danger / muted).     |
| Radius         | `--radius: 0.75rem`. Kartochka `rounded-xl`, tugma/input `rounded-md`, hero `rounded-2xl`. |
| Shrift         | **Golos Text Variable**, self-hosted (lotin + kirill).                                     |
| Ikonlar        | Faqat `lucide-react`, standart `size-4`. Kartochka sarlavhasida — `IconBox` ichida.        |
| Raqamlar       | Har doim `tabular-nums`.                                                                   |
| Dark mode      | Har token ikkala rejimda. `.dark` klassi `<html>` da, birinchi chizishdan oldin qo'yiladi. |
| Mobil          | Mobil birinchi. `md` (768) dan kichikda sidebar — chiquvchi panel.                         |

Istisno (ataylab): **suzuvchi elementlar** (o'ng pastdagi vidjet, rasm ustidagi tugma) — `glass` utility,
**login** — fotosurat ustida shisha kartochka, **bosh sahifa hero'si** — to'liq `bg-primary` banner.
Kabinet ichidagi oddiy bloklar — doim tekis, soyasiz.

---

## 2. Stack

```
React 19 + TypeScript (strict)
Vite + @tailwindcss/vite (Tailwind 4, config fayli yo'q — hammasi CSS'da)
shadcn/ui (style: new-york, baseColor: neutral, cssVariables: true) — Radix (`radix-ui` paketi)
class-variance-authority, clsx, tailwind-merge, tw-animate-css
lucide-react, sonner (toast)
@fontsource-variable/golos-text
prettier + prettier-plugin-tailwindcss
```

```bash
pnpm add class-variance-authority clsx tailwind-merge lucide-react sonner radix-ui @fontsource-variable/golos-text
pnpm add -D tailwindcss @tailwindcss/vite tw-animate-css shadcn prettier prettier-plugin-tailwindcss
```

### `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "utils": "@/utils/cn",
    "lib": "@/lib",
    "hooks": "@/lib/hooks"
  }
}
```

> ⚠️ shadcn CLI 4.x bu alias'larda `cn` importini `from "cn"` deb yozadi va npm'dagi begona `cn` paketini o'rnatadi,
> hamda `"use client"` qo'yadi. Bizda buni `scripts/ui-add.mjs` wrapper tuzatadi (`pnpm ui:add <nom>`):
> `shadcn add` → `from "cn"` → `from "@/utils/cn"`, `"use client"` ni olib tashlash, `pnpm remove cn`, prettier.

### `src/utils/cn.ts`

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/styles/index.css",
  "tailwindFunctions": ["cn", "cva"]
}
```

---

## 3. Qatlamlar

```
src/styles/theme/tokens.css   ← barcha dizayn qarorlari (rang, radius) — light + dark
src/styles/index.css          ← token → Tailwind utility (@theme inline), shrift, base, utility'lar, animatsiyalar
src/components/ui/            ← shadcn primitivlari (ba'zilari moslangan — 6-bo'lim)
src/components/<Name>/        ← kompozit: PageHeader, SectionCard, StatCard, IconBox ...
src/pages/*/components/       ← sahifaga xos
```

Rang o'zgartirish kerak bo'lsa — **faqat** `tokens.css`. Komponentlarda xom rang (`bg-blue-600`, `#2563eb`,
`text-gray-500`) yozilmaydi.

---

## 4. `src/styles/theme/tokens.css` — to'liq

Yangi loyihada brendni almashtirish uchun odatda faqat `--primary`, `--accent*`, `--ring`, `--info`,
`--chart-1/2`, `--sidebar-primary/accent*` dagi **hue** (259 / 255) o'zgartiriladi. Neytrallar (hue 265) —
brendga yaqin "sovuq" kulrang; brend issiq bo'lsa, ularning hue'sini ham brendga yaqinlashtiring.

```css
/*
 * DIZAYN TOKEN'LARI — dizayndagi barcha qarorlar shu faylda.
 * Uslub: minimal admin panel — oq sirtlar, yupqa chegaralar, bitta brend rangi,
 * soyalar va gradientlar yo'q. Holat ranglari faqat yumshoq chiplarda (bg-x/10 + text-x).
 * Format: OKLCH. Light va dark — ikkalasi ham to'ldiriladi.
 */

:root {
  --radius: 0.75rem;

  --background: oklch(1 0 0);
  --foreground: oklch(0.2 0.02 265);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.2 0.02 265);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.2 0.02 265);

  /* Brend */
  --primary: oklch(0.56 0.21 259);
  --primary-foreground: oklch(1 0 0);

  /* Neytral sirtlar: input/qidiruv foni, jadval sarlavhasi, hover */
  --secondary: oklch(0.975 0.004 265);
  --secondary-foreground: oklch(0.25 0.02 265);
  --muted: oklch(0.975 0.004 265);
  --muted-foreground: oklch(0.56 0.02 265);
  /* Faol menyu / tanlangan holat — och ko'k */
  --accent: oklch(0.965 0.022 255);
  --accent-foreground: oklch(0.5 0.2 259);

  /* Holat ranglari */
  --destructive: oklch(0.6 0.22 25);
  --destructive-foreground: oklch(1 0 0);
  --success: oklch(0.6 0.15 152);
  --success-foreground: oklch(1 0 0);
  --warning: oklch(0.67 0.17 55);
  --warning-foreground: oklch(1 0 0);
  --info: oklch(0.56 0.21 259);
  --info-foreground: oklch(1 0 0);

  --border: oklch(0.93 0.006 265);
  --input: oklch(0.92 0.006 265);
  --ring: oklch(0.56 0.21 259);
  /* Modal/yo'riqnoma atrofidagi qorong'i qatlam */
  --overlay: oklch(0.2 0.02 265 / 55%);
  /* Fotosurat ustidagi to'q parda (login) — mavzudan qat'i nazar bir xil, ustidagi matn oq */
  --scrim: oklch(0.17 0.06 268);
  --scrim-foreground: oklch(1 0 0);

  --chart-1: oklch(0.56 0.21 259);
  --chart-2: oklch(0.8 0.08 250);
  --chart-3: oklch(0.6 0.15 152);
  --chart-4: oklch(0.67 0.17 55);
  --chart-5: oklch(0.6 0.22 25);

  --sidebar: oklch(1 0 0);
  --sidebar-foreground: oklch(0.4 0.02 265);
  --sidebar-primary: oklch(0.56 0.21 259);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.965 0.022 255);
  --sidebar-accent-foreground: oklch(0.5 0.2 259);
  --sidebar-border: oklch(0.93 0.006 265);
  --sidebar-ring: oklch(0.56 0.21 259);
}

.dark {
  --background: oklch(0.16 0.01 265);
  --foreground: oklch(0.96 0.004 265);
  --card: oklch(0.19 0.012 265);
  --card-foreground: oklch(0.96 0.004 265);
  --popover: oklch(0.21 0.012 265);
  --popover-foreground: oklch(0.96 0.004 265);

  --primary: oklch(0.64 0.19 258);
  --primary-foreground: oklch(1 0 0);

  --secondary: oklch(0.24 0.012 265);
  --secondary-foreground: oklch(0.96 0.004 265);
  --muted: oklch(0.24 0.012 265);
  --muted-foreground: oklch(0.7 0.02 265);
  --accent: oklch(0.27 0.05 260);
  --accent-foreground: oklch(0.82 0.1 255);

  --destructive: oklch(0.66 0.2 25);
  --destructive-foreground: oklch(1 0 0);
  --success: oklch(0.7 0.15 155);
  --success-foreground: oklch(0.16 0.01 265);
  --warning: oklch(0.76 0.15 65);
  --warning-foreground: oklch(0.16 0.01 265);
  --info: oklch(0.7 0.15 255);
  --info-foreground: oklch(0.16 0.01 265);

  --border: oklch(1 0 0 / 9%);
  --input: oklch(1 0 0 / 12%);
  --ring: oklch(0.64 0.19 258);
  --overlay: oklch(0 0 0 / 65%);
  --scrim: oklch(0.17 0.06 268);
  --scrim-foreground: oklch(1 0 0);

  --chart-1: oklch(0.64 0.19 258);
  --chart-2: oklch(0.45 0.08 255);
  --chart-3: oklch(0.7 0.15 155);
  --chart-4: oklch(0.76 0.15 65);
  --chart-5: oklch(0.66 0.2 25);

  --sidebar: oklch(0.18 0.011 265);
  --sidebar-foreground: oklch(0.78 0.015 265);
  --sidebar-primary: oklch(0.64 0.19 258);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.27 0.05 260);
  --sidebar-accent-foreground: oklch(0.82 0.1 255);
  --sidebar-border: oklch(1 0 0 / 9%);
  --sidebar-ring: oklch(0.64 0.19 258);
}
```

**Dark rejim mantig'i:** fon to'q ko'kish-kulrang (0.16), kartochka bir pog'ona ochroq (0.19), popover yana
bittasi (0.21) — qatlamlar soya o'rniga yorug'lik bilan ajraladi. Chegaralar — oq rangning 9% i. Holat ranglari
ochroq, ularning `-foreground` i esa to'q (oq emas) — to'liq bo'yalgan tugmada kontrast saqlanadi.

### Token'lar ma'nosi

| Token                          | Ishlatilishi                                        |
| ------------------------------ | --------------------------------------------------- |
| `background` / `foreground`    | sahifa foni / asosiy matn                           |
| `card`, `popover`              | kartochka, menyu, modal sirtlari                    |
| `primary`                      | asosiy amal, faol tab, brend, hero                  |
| `secondary`, `muted`           | neytral sirtlar, hover, jadval sarlavhasi, skeleton |
| `accent`                       | **faqat** tanlangan/faol holat (och ko'k)           |
| `muted-foreground`             | izoh, yordamchi matn, label                         |
| `destructive`                  | xato, o'chirish, "rad etilgan"                      |
| `success` / `warning` / `info` | "tasdiqlangan" / "kutilmoqda" / ma'lumot            |
| `border`, `input`, `ring`      | chegara, input chegarasi, fokus halqasi             |
| `overlay`                      | modal/tour qorong'i qatlami                         |
| `scrim`                        | fotosurat ustidagi to'q parda (login)               |
| `sidebar-*`                    | sidebar uchun alohida to'plam                       |
| `chart-1..5`                   | grafiklar                                           |

Yangi token qo'shish: `tokens.css` (ikkala rejim) → `index.css` dagi `@theme inline` ga bitta qator → `bg-<nom>`.

---

## 5. `src/styles/index.css` — asosiy qism

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@fontsource-variable/golos-text";
@import "./theme/tokens.css";

@custom-variant dark (&:is(.dark *));

/* Token → Tailwind utility: --color-primary → bg-primary, text-primary ... */
@theme inline {
  --font-sans: "Golos Text Variable", ui-sans-serif, system-ui, sans-serif;

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-overlay: var(--overlay);
  --color-scrim: var(--scrim);
  --color-scrim-foreground: var(--scrim-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  html {
    -webkit-text-size-adjust: 100%;
  }
  /* Tailwind 4 tugmalarga `cursor: pointer` bermaydi — bosiladigan hamma narsaga qaytaramiz */
  :is(
    button,
    [role="button"],
    [role="tab"],
    [role="radio"],
    [role="checkbox"],
    [role="switch"],
    [role="menuitem"],
    [role="menuitemradio"],
    [role="option"],
    summary,
    select,
    label[for]
  ):not(:disabled, [aria-disabled="true"], [data-disabled]) {
    cursor: pointer;
  }
  body {
    @apply min-h-dvh bg-background font-sans text-foreground antialiased;
  }
}

/* "Suyuq shisha" sirti — faqat suzuvchi elementlar uchun (vidjet, rasm ustidagi tugma) */
@utility glass {
  background-color: color-mix(in oklch, var(--color-card) 55%, transparent);
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  border: 1px solid color-mix(in oklch, var(--color-border) 70%, transparent);
  box-shadow:
    inset 0 1px 0 0 color-mix(in oklch, var(--color-background) 85%, transparent),
    inset 0 -1px 0 0 color-mix(in oklch, var(--color-foreground) 4%, transparent),
    0 10px 30px -10px color-mix(in oklch, var(--color-foreground) 30%, transparent);
}

/* Mikro-animatsiyalar (ixtiyoriy) */
@theme {
  --animate-shake: shake 0.4s ease-in-out; /* noto'g'ri javob */
  --animate-pop: pop 0.35s ease-out; /* to'g'ri javob */
  --animate-kenburns: kenburns 40s ease-in-out infinite alternate; /* login foni */

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    20%,
    60% {
      transform: translateX(-5px);
    }
    40%,
    80% {
      transform: translateX(5px);
    }
  }
  @keyframes pop {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.015);
    }
  }
  @keyframes kenburns {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.08);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-shake,
  .animate-pop,
  .animate-kenburns {
    animation: none;
  }
}
```

> Har yangi animatsiya `prefers-reduced-motion` ro'yxatiga qo'shiladi.

---

## 6. Moslangan shadcn komponentlari

Qolgan shadcn komponentlari standart holatda. Quyidagilar o'zgartirilgan — `ui:add --overwrite` qilinsa
o'zgarish yo'qoladi, qaytadan qo'llash kerak.

### Card — soyasiz, ichki bo'shliq 5

```tsx
// Card
"flex flex-col gap-5 rounded-xl border bg-card py-5 text-card-foreground"; // shadow-sm olib tashlangan
// CardHeader / CardContent / CardFooter: px-6 → px-5, [.border-b]:pb-5, [.border-t]:pt-5
```

### Badge — holat chiplari qo'shilgan

```tsx
variant: {
  default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
  destructive: "...standart...",
  outline: "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
  ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
  link: "text-primary underline-offset-4 [a&]:hover:underline",
  // Holat chiplari — yumshoq fon + rangli matn
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
  danger: "bg-destructive/10 text-destructive",
  muted: "bg-muted text-muted-foreground",
},
```

### Table — sarlavha "kapsula"

```tsx
// TableHeader: och kulrang fon, yumaloq burchak, chegarasiz
"[&_th:first-child]:rounded-l-lg [&_th:last-child]:rounded-r-lg [&_tr]:border-0 [&_tr]:bg-muted [&_tr]:hover:bg-muted";
// TableHead: kichik kulrang matn
"h-10 px-3 text-left align-middle text-xs font-medium whitespace-nowrap text-muted-foreground";
// TableCell: biroz balandroq qator
"px-3 py-3 align-middle whitespace-nowrap";
```

### Tabs — oq kapsula, faol tab `bg-primary`

```tsx
// TabsList default:
"gap-0.5 rounded-full border bg-card p-1 group-data-[orientation=horizontal]/tabs:h-10";
// TabsTrigger:
//   rounded-full px-3.5 text-foreground/60, hover:bg-muted
//   faol: bg-primary text-primary-foreground font-semibold
//   faol tab ichidagi Badge teskari: bg-primary-foreground text-primary
"group-data-[variant=default]/tabs-list:data-[state=active]:bg-primary " +
  "group-data-[variant=default]/tabs-list:data-[state=active]:font-semibold " +
  "group-data-[variant=default]/tabs-list:data-[state=active]:text-primary-foreground " +
  "group-data-[variant=default]/tabs-list:data-[state=active]:*:data-[slot=badge]:bg-primary-foreground " +
  "group-data-[variant=default]/tabs-list:data-[state=active]:*:data-[slot=badge]:text-primary";
```

### Skeleton — `bg-accent` → `bg-muted`

Bizda `accent` och ko'k (faol holat), skeleton neytral bo'lishi kerak:

```tsx
"animate-pulse rounded-md bg-muted";
```

### Sidebar — neytral hover, balandroq band

```tsx
// SidebarMenuButton: hover — kulrang, faol — accent
"hover:bg-muted hover:text-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground";
// size.default: h-8 → h-9
// SIDEBAR_WIDTH = "16rem", SIDEBAR_WIDTH_ICON = "3rem"
```

Faol band chizig'i (sidebar faylida emas, menyu bandida):

```tsx
<SidebarMenuItem className="relative">
  {isActive && (
    <span
      aria-hidden
      className="absolute top-1.5 bottom-1.5 -left-2 w-[3px] rounded-r-full bg-primary"
    />
  )}
  <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
    …
  </SidebarMenuButton>
</SidebarMenuItem>
```

### Sonner — o'z ThemeProvider'imiz (next-themes emas)

```tsx
<Sonner
  theme={resolvedTheme}
  icons={{
    success: <CircleCheckIcon className="size-4" />,
    info: <InfoIcon className="size-4" />,
    warning: <TriangleAlertIcon className="size-4" />,
    error: <OctagonXIcon className="size-4" />,
    loading: <Loader2Icon className="size-4 animate-spin" />,
  }}
  style={
    {
      "--normal-bg": "var(--popover)",
      "--normal-text": "var(--popover-foreground)",
      "--normal-border": "var(--border)",
      "--border-radius": "var(--radius)",
    } as React.CSSProperties
  }
/>
```

### Button — standart shadcn

O'lchamlar: `default h-9`, `sm h-8`, `lg h-10`, `icon size-9`. Header'dagi ikon tugmalar —
`variant="outline" size="icon"` + `text-muted-foreground` + `aria-label`.

---

## 7. Kompozit komponentlar

Sahifalar shu bloklardan yig'iladi — har sahifada qo'lda kartochka chizilmaydi.

### IconBox — kvadrat ichida ikon

```tsx
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

const TONES = {
  neutral: "border bg-background text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
} as const;

export type IconTone = keyof typeof TONES;

export function IconBox({
  icon: Icon,
  size = "sm",
  tone = "neutral",
  className,
}: {
  icon: LucideIcon;
  size?: "sm" | "md";
  tone?: IconTone;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg",
        TONES[tone],
        size === "sm" ? "size-8 [&>svg]:size-4" : "size-10 [&>svg]:size-5",
        className
      )}
    >
      <Icon />
    </span>
  );
}
```

### PageHeader — har sahifa tepasida

```tsx
export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6",
        className
      )}
    >
      <div className="min-w-0 space-y-1">
        <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
```

### SectionCard — sahifa bloki (eng ko'p ishlatiladigan)

```tsx
export function SectionCard({
  icon,
  iconTone = "primary",
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: {
  icon?: LucideIcon;
  iconTone?: IconTone;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    // min-w-0: grid/flex ichida keng jadval kartochkani ekrandan chiqarib yubormasin
    <section className={cn("flex min-w-0 flex-col rounded-xl border bg-card", className)}>
      <header className="flex min-h-14 flex-wrap items-center gap-3 px-5 pt-4 pb-3">
        {icon && <IconBox icon={icon} tone={iconTone} />}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold">{title}</h2>
          {description && <p className="truncate text-xs text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </header>
      <div className={cn("min-w-0 flex-1 px-5 pb-5", contentClassName)}>{children}</div>
    </section>
  );
}
```

Sarlavha **kichik** (`text-sm font-semibold`) — bu uslubning o'ziga xos jihati: sahifada faqat `PageHeader`
katta, bloklar sokin.

### StatCard — ko'rsatkich

```tsx
export function StatCard({
  icon,
  tone = "primary",
  label,
  value,
  hint,
  badge,
  loading = false,
  className,
}: {
  icon: LucideIcon;
  tone?: IconTone;
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  badge?: ReactNode;
  loading?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 rounded-xl border bg-card p-4", className)}>
      <div className="flex items-center gap-2.5">
        <IconBox icon={icon} tone={tone} />
        <span className="min-w-0 flex-1 truncate text-sm font-medium">{label}</span>
        {badge}
      </div>
      <div className="space-y-1">
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <p className="text-[1.75rem] leading-none font-semibold tracking-tight tabular-nums">
            {value}
          </p>
        )}
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
    </div>
  );
}
```

### InfoList — "nom — qiymat"

```tsx
export function InfoList({
  items,
  columns = 1,
  className,
}: {
  items: { label: ReactNode; value: ReactNode; wide?: boolean }[];
  columns?: 1 | 2;
  className?: string;
}) {
  return (
    <dl className={cn("grid gap-x-6 gap-y-4", columns === 2 && "sm:grid-cols-2", className)}>
      {items.map((item, i) => (
        <div key={i} className={cn("min-w-0 space-y-1", item.wide && "sm:col-span-2")}>
          <dt className="text-xs text-muted-foreground">{item.label}</dt>
          <dd className="text-sm font-medium break-words">
            {item.value === null || item.value === undefined || item.value === ""
              ? "—"
              : item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
```

### EmptyState — bo'sh ro'yxat

```tsx
<div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 py-8 text-center">
  {/* illyustratsiya yoki <IconBox icon={InboxIcon} size="md" /> */}
  <p className="mt-3 text-sm font-semibold">{title}</p>
  {description && (
    <p className="mt-1 max-w-sm text-sm text-pretty text-muted-foreground">{description}</p>
  )}
  {action && <div className="mt-5">{action}</div>}
</div>
```

Intalim'da tepada kichik animatsion SVG sahna bor (faqat token ranglarida, `reduced-motion` da to'xtaydi) —
yangi loyihada o'z mavzusiga mos sahna chizilsa, "jonli" his beradi.

### StatusScreen — 404 / 403 / xato

Markazda: `IconBox size="md"` (yoki illyustratsiya) → `text-sm font-semibold text-primary tabular-nums` kod
(`404`) → `text-2xl font-semibold tracking-tight text-balance` sarlavha → `text-sm text-muted-foreground` izoh →
tugmalar (`flex-col-reverse` mobilda, `sm:flex-row`). Konteyner `max-w-md`, `py-16`.

### ListPagination — jadval ostida

Chapda `21–40 / 135` (`text-sm text-muted-foreground tabular-nums`), o'ngda `ghost` tugmalar; joriy sahifa —
`variant="outline"`, qolganlari `text-muted-foreground`, `size-8`. Bitta sahifa bo'lsa — ko'rinmaydi.

---

## 8. Layout (kabinet karkasi)

```tsx
<SidebarProvider open={open} onOpenChange={saveToLocalStorage}>
  <Sidebar collapsible="icon" /> {/* 16rem, yig'ilganda 3rem (faqat ikonlar + tooltip) */}
  <SidebarInset className="min-w-0">
    <Header />
    <main className="flex-1 px-4 pt-6 pb-24 sm:px-6 lg:pt-8">
      <div className="mx-auto w-full max-w-[90rem]">{children}</div>
    </main>
  </SidebarInset>
</SidebarProvider>
```

- shadcn sidebar holatni cookie'ga yozadi, lekin o'qimaydi (SSR uchun) — biz `localStorage`'da saqlaymiz.
- `pb-24` — o'ng pastdagi suzuvchi tugma oxirgi qatorni yopmasin.

**Header:**

```tsx
<header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4 sm:px-6">
  <SidebarToggle /> {/* outline icon: PanelLeftClose / PanelLeftOpen / mobilda PanelLeft */}
  <div className="min-w-0 flex-1">
    <SearchCommand />
  </div>{" "}
  {/* ⌘K qidiruv (cmdk) */}
  <div className="flex items-center gap-2">{/* outline ikon tugmalar + profil */}</div>
</header>
```

**Sidebar:**

- Yuqorida `h-16 border-b` — header bilan bir chiziqda. Ochiq — wordmark logo (`h-7`), yig'ilgan — faqat belgi
  (bosilsa ochiladi).
- Guruh sarlavhasi: `text-xs font-normal text-muted-foreground`. Bandlar orasida `gap-0.5`.
- Mobilda band bosilganda panel yopiladi (`setOpenMobile(false)`).

**Sahifa tuzilishi:**

```tsx
<div className="space-y-4">
  <PageHeader title=… description=… actions=… />
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">{/* StatCard'lar */}</div>
  {/* grid-cols-1 (minmax(0,1fr)) — aks holda mobilda keng jadval ustunni ekrandan chiqarib yuboradi */}
  <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
    <div className="grid min-w-0 grid-cols-1 content-start gap-4 xl:col-span-8">{/* asosiy */}</div>
    <div className="grid min-w-0 grid-cols-1 content-start gap-4 sm:grid-cols-2 xl:col-span-4 xl:grid-cols-1">{/* yon */}</div>
  </div>
</div>
```

Bloklar orasidagi masofa doim `gap-4` / `space-y-4`.

---

## 9. Urg'u joylari (ataylab "minimal"dan chiqadigan)

### Hero banner (bosh sahifa)

```tsx
<section className="relative isolate overflow-hidden rounded-2xl bg-primary text-primary-foreground">
  {/* Bezak doiralari — yangi rang emas, faqat shaffof oq qatlam */}
  <span
    aria-hidden
    className="absolute -top-24 -right-16 -z-10 size-72 rounded-full bg-primary-foreground/10"
  />
  <span
    aria-hidden
    className="absolute top-24 -left-20 -z-10 size-56 rounded-full bg-primary-foreground/5"
  />
  <div className="px-6 py-7 sm:px-8 sm:py-8">
    <p className="text-sm font-medium text-primary-foreground/80">Bugun · sana</p>
    <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">Salom, Ism!</h1>
    {/* Chiplar: rounded-full bg-primary-foreground/15 px-3 py-1 text-sm */}
    {/* Avatar: size-14 sm:size-20 rounded-2xl ring-4 ring-primary-foreground/25 */}
  </div>
</section>
```

### Login — fotosurat + shisha kartochka

```tsx
<div className="dark relative isolate flex min-h-dvh animate-in overflow-hidden bg-scrim p-3 text-scrim-foreground duration-500 fade-in sm:p-5 lg:p-8">
  {/* Fon: surat sekin yaqinlashadi + pastdan to'q parda */}
  <img
    src="/login-bg.jpg"
    alt=""
    aria-hidden
    className="absolute inset-0 -z-20 size-full animate-kenburns object-cover"
  />
  <span
    aria-hidden
    className="absolute inset-0 -z-10 bg-linear-to-t from-scrim/75 via-scrim/35 to-scrim/15"
  />

  {/* Ekran chetidan ajralgan bitta katta shisha kartochka */}
  <div className="flex flex-1 flex-col rounded-3xl border border-scrim-foreground/25 bg-scrim-foreground/[0.06] shadow-2xl ring-1 ring-scrim-foreground/10 backdrop-blur-md backdrop-saturate-150 ring-inset">
    <header>logo | til tanlash</header>
    <main className="grid flex-1 items-center gap-10 px-5 py-8 sm:px-10 lg:grid-cols-2 lg:gap-0">
      <div>{/* gerb + nom, matnda [text-shadow:0_1px_12px_var(--color-scrim)] */}</div>
      <section className="flex justify-center lg:self-stretch lg:border-l lg:border-scrim-foreground/20 lg:px-12">
        <div className="w-full max-w-sm self-center">{/* forma */}</div>
      </section>
    </main>
    <footer>© yil · yordam havolasi · ilovalar</footer>
  </div>
</div>
```

Kalit nuqta: butun sahifa `dark` klassi ichida — umumiy mavzu yorug' bo'lsa ham input va matnlar surat ustida
o'qiladi. Fon surati `index.html` da `/login` uchun `preload` qilinadi.

### Suzuvchi vidjet

```tsx
<button className="fixed right-4 bottom-4 z-40 flex items-center gap-2.5 rounded-full glass p-1.5 pr-4 transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 sm:right-6 sm:bottom-6">
```

---

## 10. Mavzu (theme) — miltillashsiz

`ThemeProvider`: `light | dark | system`, `localStorage` kaliti (masalan `app.theme`), `<html>` ga `.dark` va
`style.colorScheme`. `system` — `matchMedia("(prefers-color-scheme: dark)")` o'zgarishini tinglaydi.

Birinchi chizishdan oldin `index.html` da (aks holda dark rejimda oq "miltillash" bo'ladi):

```html
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#0b0d12" media="(prefers-color-scheme: dark)" />
<script>
  (function () {
    try {
      var t = localStorage.getItem("app.theme") || "system";
      var dark =
        t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", dark);
    } catch (e) {}
  })();
</script>
```

**Boot splash** (JS yuklanguncha, React o'zi almashtiradi): `#root` ichida markazda logo (56px, `rounded-16px`) va
ostida ingichka chiziq (144×4px, `primary/15` fon) ichida chapdan o'ngga suzuvchi 40% bo'lak (`primary`, 1.1s).
Ranglar `tokens.css` dagi qiymatlar bilan bir xil yoziladi (inline `<style>`, chunki CSS hali yuklanmagan).

---

## 11. Tipografiya shkalasi

| Joy                | Klasslar                                                                |
| ------------------ | ----------------------------------------------------------------------- |
| Sahifa sarlavhasi  | `text-2xl font-semibold tracking-tight`                                 |
| Hero sarlavhasi    | `text-2xl sm:text-3xl font-semibold tracking-tight text-balance`        |
| Blok sarlavhasi    | `text-sm font-semibold`                                                 |
| Katta raqam (stat) | `text-[1.75rem] leading-none font-semibold tracking-tight tabular-nums` |
| Asosiy matn        | `text-sm`                                                               |
| Izoh / label       | `text-xs text-muted-foreground` yoki `text-sm text-muted-foreground`    |
| Jadval sarlavhasi  | `text-xs font-medium text-muted-foreground`                             |

Uzun sarlavhalarda `text-balance`, paragraflarda `text-pretty`. O'lchamlar faqat `rem` (Tailwind standart) —
foydalanuvchi shrift o'lchamini `<html style="font-size: N%">` bilan kattalashtirsa, hammasi birga o'sadi.

---

## 12. Qoidalar (ESLint/review'da tekshiriladi)

1. **Xom rang yo'q.** Faqat semantik token: `bg-primary`, `text-muted-foreground`, `border-border`, `bg-success/10`.
   Shaffoflik — `/10`, `/15`, `/25` modifikatorlari bilan.
2. **Har token light VA dark uchun.**
3. Komponent variantlari — `cva`. `className` faqat **joylashuv** uchun (margin, grid, width), ko'rinishni
   o'zgartirish uchun emas.
4. Ikonlar — faqat lucide, `size-4`. Ikonli tugmada **`aria-label` majburiy**.
5. Formada `Field` + `FieldLabel htmlFor`. Fokus halqasi (`ring`) **o'chirilmaydi**.
6. Mobil birinchi: `sm` 640, `md` 768 (sidebar → panel), `lg` 1024, `xl` 1280.
7. Grid/flex ichidagi kartochkaga `min-w-0` — keng jadval ekranni buzmasin; jadval `overflow-x-auto` ichida.
8. Kontrast: matn/fon kamida 4.5:1.
9. Har animatsiya `prefers-reduced-motion` da to'xtaydi.
10. Hover — `muted`. `accent` — faqat tanlangan/faol holat.

---

## 13. Yangi loyihada setup — tartib

1. Vite + React + TS loyiha, `@/` alias (`tsconfig` + `vite.config`).
2. 2-bo'limdagi paketlar, `components.json`, `.prettierrc`, `src/utils/cn.ts`.
3. `src/styles/theme/tokens.css` (4-bo'lim) — brend hue'sini almashtiring.
4. `src/styles/index.css` (5-bo'lim), `main.tsx` da import.
5. shadcn komponentlari: `button badge card table tabs skeleton sidebar sonner dialog dropdown-menu input field label
tooltip avatar separator sheet command empty alert alert-dialog switch progress select popover`.
6. 6-bo'limdagi moslashlarni qo'llang (card, badge, table, tabs, skeleton, sidebar, sonner).
7. `components/` ga IconBox, PageHeader, SectionCard, StatCard, InfoList, EmptyState, StatusScreen, ListPagination.
8. ThemeProvider + `index.html` dagi inline skript + boot splash.
9. Layout (8-bo'lim): Sidebar + Header + main.
10. Tekshiruv: login, sidebar (ochiq/yig'ilgan/mobil), dialog, badge, jadval, tab — **ikkala rejimda**.
