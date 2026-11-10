import { create } from "zustand";

/** Vaqtinchalik UI holati (saqlanmaydi): customizer, ⌘K qidiruv */
interface UiState {
  customizerOpen: boolean;
  commandOpen: boolean;
  setCustomizerOpen: (open: boolean) => void;
  setCommandOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  customizerOpen: false,
  commandOpen: false,
  setCustomizerOpen: (customizerOpen) => set({ customizerOpen }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
}));
