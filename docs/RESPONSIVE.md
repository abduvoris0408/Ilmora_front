# Responsivlik qoidalari

Manba: `src/config/breakpoints.ts` (Tailwind standart breakpoint'lari bilan bir xil). JS'da —
`useBreakpoint("md")`, `useBelow("lg")`, `useCurrentBreakpoint()`, `useIsTouch()`.

| Breakpoint | Kenglik    | Qurilma        | Nima o'zgaradi                                                         |
| ---------- | ---------- | -------------- | ---------------------------------------------------------------------- |
| _base_     | 0–639      | telefon        | pastki tab-bar, jadval → kartochkalar, modal → bottom-sheet, 2 ustunli StatCard |
| `sm`       | 640+       | katta telefon  | modal → markazdagi Dialog, PageHeader tugmalari bir qatorda            |
| `md`       | 768+       | planshet       | sidebar ko'rinadi, tab-bar yo'qoladi, jadval to'liq, drawer → o'ngdan Sheet |
| `lg`       | 1024+      | noutbuk        | tepa menyu rejimi ishlaydi, filial tanlagich header'da                 |
| `xl`       | 1280+      | desktop        | sahifa grid'i 8 + 4, profil nomi header'da                             |
| `2xl`      | 1536+      | keng ekran     | ruxsatlar matritsasi 3 ustun                                           |

## Karkas

| Element           | Telefon (< md)                                  | Planshet+ (md+)                         |
| ----------------- | ----------------------------------------------- | --------------------------------------- |
| Sidebar           | chiquvchi panel (tab-bar'dagi "Menyu" yoki ☰)   | doimiy, yig'iladi (faqat ikon)          |
| Tepa menyu        | lg dan kichikda avtomatik sidebar rejimi        | lg+ da gorizontal                       |
| Header            | ☰ · logo · 🔍 · 🔔 · profil                     | + qidiruv maydoni, til, sozlash, filial |
| Pastki tab-bar    | Bosh sahifa + 3 sevimli + Menyu                 | yo'q                                    |
| `main` padding    | `px-4`, pastdan tab-bar uchun joy + safe-area   | `px-6`                                  |

## Komponentlar

- **DataTable** — `renderMobileCard` berilsa md dan kichikda kartochka ro'yxati, aks holda gorizontal scroll.
  Filtrlar qatori telefonda gorizontal suriladi. Bulk-panel tab-bar ustida suzadi.
- **SidePanel / ResponsiveModal** — o'zi moslashadi; footer tugmalari telefonda ustma-ust va to'liq kenglikda.
- **PageHeader** — telefonda tugmalar sarlavha ostida, teng kenglikda.
- **StatCard** — `grid-cols-2 lg:grid-cols-4`; telefonda ikon yashiriladi, badge qiymat ostiga tushadi.

## Qoidalar

1. **Mobil birinchi**: avval telefon uchun yozing, keyin `sm:` / `md:` / `lg:` bilan kengaytiring.
2. Grid/flex ichidagi kartochkaga `min-w-0`; sahifa grid'i `grid-cols-1` (minmax(0,1fr)) dan boshlanadi.
3. Keng jadval — faqat `overflow-x-auto` ichida (Table komponenti o'zi qiladi).
4. Sensorli nishonlar kamida 36–40px (`size-9`, `h-9`). Faqat hover'da ko'rinadigan amal bo'lmasin.
5. Fixed elementlarda `env(safe-area-inset-bottom)` (iPhone home indicator).
6. Balandlik — `dvh` (mobil brauzer paneli hisobga olinadi), `vh` emas.
7. JS'da breakpoint kerak bo'lsa — faqat `useBreakpoint`, xom `window.innerWidth` yo'q.
8. Tekshiruv: 390 (iPhone), 768 (iPad), 1280, 1440 — yorug' va qorong'i rejimda.
