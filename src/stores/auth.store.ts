import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/config/app";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  roleId: string;
  /** Foydalanuvchi ishlay oladigan filiallar ("*" — hammasi) */
  branchIds: string[] | "*";
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  /** Dev: rolni almashtirib ruxsatlarni tekshirish */
  switchRole: (roleId: string) => void;
}

export const DEMO_USER: AuthUser = {
  id: "u-1",
  firstName: "Abduvoris",
  lastName: "Mo'minov",
  phone: "+998 90 123 45 67",
  email: "owner@ilmora.uz",
  roleId: "owner",
  branchIds: "*",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      switchRole: (roleId) => set((s) => (s.user ? { user: { ...s.user, roleId } } : s)),
    }),
    { name: STORAGE_KEYS.auth, version: 1 }
  )
);

export const isAuthenticated = () => Boolean(useAuthStore.getState().token);
