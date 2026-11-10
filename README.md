# Ilmora — Frontend

Savdo va biznesni boshqarish tizimi (CRM / POS / ERP) uchun web-kabinet.

```bash
pnpm install
pnpm dev            # http://localhost:5173  (login: istalgan parol)
```

| Buyruq               | Nima qiladi                                   |
| -------------------- | --------------------------------------------- |
| `pnpm dev`           | Dev server                                    |
| `pnpm build`         | Typecheck + production build (`dist/`)        |
| `pnpm preview`       | Build'ni lokal ko'rish                        |
| `pnpm check`         | typecheck + lint + test (push'dan oldin)      |
| `pnpm test`          | Vitest                                        |
| `pnpm lint:fix`      | ESLint avto-tuzatish                          |
| `pnpm format`        | Prettier (Tailwind klasslarini ham tartiblaydi) |
| `pnpm ui:add <nom>`  | shadcn komponent qo'shish (alias'larni tuzatadi) |

## Stack

React 19 · TypeScript (strict) · Vite 8 · Tailwind 4 · shadcn/ui (Radix) · TanStack Router / Query / Table ·
Zustand · react-hook-form + zod · i18next (uz / ru / en) · Recharts · dnd-kit · Vitest · ESLint + Prettier ·
Husky + lint-staged + commitlint · GitHub Actions · Docker + nginx

## Imkoniyatlar (tayyor)

- **Dizayn tizimi** — [DESIGN_KIT.md](DESIGN_KIT.md) asosida, token'lar `src/styles/theme/`. Jonli ko'rgazma:
  _Sozlamalar → Dizayn tizimi_.
- **Interfeys sozlagich** — rejim (yorug'/qorong'i/tizim), 8 ta rang preseti + istalgan tus, burchak radiusi,
  menyu uslubi (oq/to'q/brend), menyu joylashuvi (chap/o'ng/tepa), zichlik, shrift o'lchami, kontent kengligi.
- **Menyu sozlamasi** — bo'limlarni drag & drop bilan tartiblash, yashirish, sevimli sahifalar.
- **RBAC** — `modul.amal` ruxsatlari, rollar matritsasi (_Boshqaruv → Rollar_), sahifa/menyu/tugma darajasida.
  Dev rejimida profil menyusidan rolni almashtirib tekshirish mumkin.
- **Overlay tizimi** — `overlay.open()` va `await confirm()`; modal va drawer'lar avtomatik responsiv.
- **DataTable** — qidiruv, filtrlar, saralash, ustunlar, tanlash + bulk amallar, pagination, mobil kartochkalar.
- **3 til** — uz (asosiy) / ru / en, type-safe kalitlar, testlar kalitlar mosligini tekshiradi.
- **To'liq responsiv** — mobil pastki tab-bar, chiquvchi menyu, bottom-sheet modallar ([docs/RESPONSIVE.md](docs/RESPONSIVE.md)).

Hozircha barcha ma'lumotlar **statik (mock)** — `modules/*/mocks`. Backend ulash: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#backend-ulash).

## Hujjatlar

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — papka tuzilmasi, qatlamlar, yangi modul/sahifa qo'shish
- [docs/RESPONSIVE.md](docs/RESPONSIVE.md) — breakpoint'lar va responsivlik qoidalari
- [DESIGN_KIT.md](DESIGN_KIT.md) — vizual uslub, token'lar, komponent qoidalari
