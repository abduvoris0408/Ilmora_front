import { useRouterState } from "@tanstack/react-router";

import { findNavEntry } from "@/config/navigation";

/** Joriy sahifaga mos nav band (sidebar/tepa menyu/breadcrumb faol holati uchun) */
export function useActiveNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const entry = findNavEntry(pathname);
  return { pathname, entry, activeKey: entry?.key, activeSectionId: entry?.section.id };
}
