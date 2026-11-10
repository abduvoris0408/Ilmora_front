import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/config/app";

/** Joriy filial. `null` — barcha filiallar (egasi/admin uchun umumiy ko'rinish) */
interface BranchState {
  branchId: string | null;
  setBranch: (id: string | null) => void;
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      branchId: null,
      setBranch: (branchId) => set({ branchId }),
    }),
    { name: STORAGE_KEYS.branch, version: 1 }
  )
);
