#!/usr/bin/env node
/**
 * shadcn CLI wrapper: `pnpm ui:add <nom...> [--overwrite]`
 *
 * shadcn 4.x bizning alias'larda `cn` importini `from "cn"` deb yozadi, npm'dagi begona `cn` paketini
 * o'rnatadi va `"use client"` qo'yadi. Bu skript:
 *   1) shadcn add ni ishga tushiradi
 *   2) `from "cn"` → `from "@/utils/cn"`
 *   3) `"use client"` ni olib tashlaydi (bizda RSC yo'q)
 *   4) begona `cn` paketini o'chiradi
 *   5) prettier bilan formatlaydi
 *
 * ⚠️ DESIGN_KIT.md 6-bo'limdagi moslangan komponentlarni --overwrite bilan qayta o'rnatsangiz,
 *    moslashlar yo'qoladi — ularni qayta qo'llang.
 */
import { execSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Foydalanish: pnpm ui:add <komponent...> [--overwrite]");
  process.exit(1);
}

const run = (cmd) => execSync(cmd, { stdio: "inherit", shell: true });

run(`pnpm dlx shadcn@latest add ${args.join(" ")} --yes`);

const UI_DIRS = ["src/components/ui", "src/lib/hooks"];
const changed = [];

function walk(dir) {
  let entries = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(tsx?|jsx?)$/.test(name)) fix(full);
  }
}

function fix(file) {
  const src = readFileSync(file, "utf8");
  const out = src
    .replace(/from ["']cn["']/g, 'from "@/utils/cn"')
    .replace(/^["']use client["'];?\s*\n/m, "");
  if (out !== src) {
    writeFileSync(file, out);
    changed.push(file);
  }
}

UI_DIRS.forEach(walk);

try {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  if (pkg.dependencies?.cn || pkg.devDependencies?.cn) run("pnpm remove cn");
} catch {
  /* ignore */
}

if (changed.length) run(`pnpm prettier --write ${changed.map((f) => `"${f}"`).join(" ")}`);
console.log(`\n✔ ui:add tugadi. Tuzatilgan fayllar: ${changed.length}`);
