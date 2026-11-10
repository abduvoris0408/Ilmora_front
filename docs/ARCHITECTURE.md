# Arxitektura

## Papka tuzilmasi

```
src/
├─ app/                    Ilova yig'ilishi: provider'lar, router daraxti, QueryClient
│  ├─ AppProviders.tsx
│  ├─ query-client.ts
│  └─ router/              root-route (auth guard), route-helpers, PagePending, index (daraxt)
│
├─ modules/                ⭐ BIZNES MODULLAR — har biri mustaqil
│  ├─ dashboard/
│  ├─ products/
│  │  ├─ routes.ts         modul route'lari (lazy sahifalar)
│  │  ├─ types.ts          domen tiplari
│  │  ├─ api/              TanStack Query hook'lari (hozir mock "baza")
│  │  ├─ mocks/            statik ma'lumot generatori
│  │  ├─ schemas/          zod schema'lar (forma validatsiyasi)
│  │  ├─ components/       modulga xos komponentlar (forma paneli, ustunlar…)
│  │  └─ pages/            sahifalar
│  ├─ sales/ customers/ marketing/ reports/ finance/ financing/ management/ settings/
│  ├─ auth/                login
│  └─ system/              403 / 404 / xato / "tez orada"
│
├─ layout/                 Kabinet karkasi: sidebar, header, tepa menyu, mobil tab-bar, customizer
├─ components/
│  ├─ ui/                  shadcn primitivlari (DESIGN_KIT 6-bo'lim bo'yicha moslangan)
│  └─ shared/              kompozit bloklar: PageHeader, SectionCard, StatCard, DataTable, form, overlays…
├─ config/                 navigation (yagona manba), theme, breakpoints, env, app
├─ lib/                    infratuzilma: rbac, i18n, overlays, theme, navigation, validation, hooks, mock
├─ stores/                 Zustand: preferences, navigation, auth, roles, branch, ui
├─ mocks/                  bir nechta modul ishlatadigan umumiy fixture'lar (filiallar)
├─ styles/                 index.css + theme/tokens.css + theme/sidebar.css
├─ types/                  global tip kengaytmalari (i18next, router)
├─ utils/                  cn, format (pul/sana/telefon)
└─ test/                   vitest setup
```

### Qatlam qoidalari

| Kim                 | Kimni import qila oladi                                   |
| ------------------- | --------------------------------------------------------- |
| `modules/X`         | `components`, `lib`, `stores`, `config`, `utils`, `mocks`, `layout` (faqat qayta ishlatiladigan bloklar) |
| `modules/X`         | ❌ `modules/Y` — **taqiqlangan** (ESLint xato beradi)     |
| `components/shared` | `components/ui`, `lib`, `utils`, `config`                 |
| `components/ui`     | faqat `utils/cn` va boshqa `ui`                           |

Ikki modulga kerak bo'lgan narsa → `components/shared`, `lib`, `stores` yoki `mocks` ga ko'chiriladi.

## Yagona manbalar (single source of truth)

| Nima               | Qayerda                          | Kim ishlatadi                                           |
| ------------------ | -------------------------------- | ------------------------------------------------------- |
| Menyu / sahifalar  | `config/navigation.ts`           | sidebar, tepa menyu, ⌘K, breadcrumb, tab-bar, menyu tahrirlovchisi, 403 guard |
| Ruxsatlar          | `lib/rbac/permissions.ts`        | rollar matritsasi, `<Can>`, `useCan`, route guard       |
| Ranglar            | `styles/theme/tokens.css`        | hamma komponentlar (xom rang taqiqlangan)               |
| Rang preset'lari   | `config/theme.ts`                | customizer, index.html inline skripti                   |
| Breakpoint'lar     | `config/breakpoints.ts`          | `useBreakpoint`, sidebar, DataTable, overlay'lar        |
| Tarjimalar         | `lib/i18n/locales/uz.ts`         | ru/en shu tipga bo'ysunadi                              |

## Yangi sahifa qo'shish (masalan, Kategoriyalar)

1. `modules/products/pages/CategoriesPage.tsx` — sahifa (PageHeader + SectionCard + DataTable).
2. `modules/products/routes.ts` — `comingSoon("/products/categories")` ni haqiqiy route'ga almashtiring:
   ```ts
   createRoute({
     getParentRoute: () => appLayoutRoute,
     path: "/products/categories",
     staticData: { permission: "products.view" },
     component: lazyRouteComponent(() => import("./pages/CategoriesPage"), "CategoriesPage"),
   });
   ```
3. Navigatsiyada band allaqachon bor — tayyor. Matnlar: `lib/i18n/locales/{uz,ru,en}.ts`.

## Yangi modul qo'shish

1. `modules/<nom>/routes.ts` (+ `pages/`, `api/`, `types.ts`…)
2. `app/router/index.ts` — `...<nom>Routes` ni daraxtga qo'shing
3. `config/navigation.ts` — bo'lim va bandlar
4. `lib/rbac/permissions.ts` — modul ruxsatlari (rollar matritsasi avtomatik yangilanadi)
5. i18n: `nav.<nom>.*`, `permissions.modules.<nom>`
6. `pnpm test` — navigatsiya/ruxsat/tarjima mosligi testlari avtomatik tekshiradi

## RBAC

```tsx
// Komponentda
const canEdit = useCan("products.edit");
<Can permission="products.create"><Button>…</Button></Can>
<Can permission={["sales.refund", "sales.delete"]} mode="any">…</Can>

// Route'da
staticData: { permission: "roles.view" }   // yo'q bo'lsa — 403 (URL o'zgarmaydi)
```

- Ruxsatlar: `"*"` (hammasi), `"products.*"` (modul), `"products.edit"` (aniq).
- Menyu bandlari ruxsatga qarab avtomatik yashiriladi; bo'sh qolgan bo'lim ham yashiriladi.
- Hozir rollar `stores/roles.store.ts` da (localStorage). Backend ulanganda — API'dan keladi, `Role` tipi o'zgarmaydi.

## Modal / drawer

```tsx
// Istalgan joydan ochish (props'ni pastga tushirish shart emas)
overlay.open(({ open, close }) => <ProductFormPanel open={open} onClose={close} product={p} />);

// Tasdiqlash — Promise
if (await confirm({ destructive: true, title: "O'chirasizmi?", onConfirm: () => api.remove(id) })) { … }
```

| Komponent         | Desktop                 | Telefon                     | Qachon                     |
| ----------------- | ----------------------- | --------------------------- | -------------------------- |
| `SidePanel`       | o'ngdan Sheet           | pastdan 92% Drawer          | katta forma, batafsil ko'rinish |
| `ResponsiveModal` | markazdagi Dialog       | pastdan Drawer              | qisqa forma, tanlov        |
| `confirm()`       | AlertDialog             | AlertDialog                 | tasdiqlash                 |

## Formalar

`react-hook-form` + `zod` + `components/shared/form`. Xato xabarlari — i18n **kalitlari** (`msg("validation.required")`),
tarjima render paytida → til almashsa xatolar ham tarjima bo'ladi.

```tsx
const form = useForm<Input, unknown, Output>({ resolver: zodResolver(schema) });
<FormInput control={form.control} name="name" label={t("…")} />
<FormMoneyInput control={form.control} name="price" currency={t("common.currency")} />
```

## Holat (state)

| Tur                    | Vosita              | Misol                                   |
| ---------------------- | ------------------- | --------------------------------------- |
| Server ma'lumoti       | TanStack Query      | mahsulotlar, sotuvlar                   |
| Foydalanuvchi sozlamasi| Zustand + persist   | mavzu, menyu tartibi, filial            |
| Vaqtinchalik UI        | Zustand             | customizer ochiq/yopiq, ⌘K              |
| Lokal                  | `useState`          | tab, qidiruv matni                      |
| URL                    | TanStack Router     | sahifa, (keyin) filtrlar search params'da |

## Backend ulash

1. `src/lib/http.ts` — `fetch`/`ky` klient (`env.VITE_API_URL`, token `useAuthStore` dan).
2. Har modulning `api/*.api.ts` faylida `delay(db…)` → `http.get(...)`. Hook nomlari va qaytaradigan tiplar o'zgarmaydi —
   sahifalarga tegilmaydi.
3. `modules/*/mocks` ni o'chirish (yoki testlar uchun qoldirish).
4. Server pagination kerak bo'lsa — `DataTable` ga `manualPagination` rejimi qo'shiladi.
