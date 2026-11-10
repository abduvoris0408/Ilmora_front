import "@tanstack/react-router";

import type { Permission } from "@/lib/rbac/permissions";

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    /**
     * Sahifani ko'rish uchun kerakli ruxsat. Berilmasa — navigatsiya config'idagi band ruxsati ishlatiladi.
     * Ruxsat yo'q bo'lsa AppLayout 403 sahifasini ko'rsatadi.
     */
    permission?: Permission;
  }
}
