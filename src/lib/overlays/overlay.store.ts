import type { ReactNode } from "react";
import { create } from "zustand";

/**
 * OVERLAY MENEJERI — modal/drawer'larni istalgan joydan (hatto komponentdan tashqarida) ochish.
 *
 *   const { close } = overlay.open(({ open, close }) => (
 *     <ProductFormDrawer open={open} onOpenChange={(v) => !v && close()} />
 *   ));
 *
 * Har overlay o'z `open` holatini oladi — yopilganda avval animatsiya o'ynaydi,
 * keyin stack'dan olib tashlanadi. Bir nechta overlay ustma-ust ochilishi mumkin.
 */
export interface OverlayRenderProps {
  open: boolean;
  close: () => void;
}

type Render = (props: OverlayRenderProps) => ReactNode;

interface OverlayEntry {
  id: number;
  open: boolean;
  render: Render;
}

interface OverlayState {
  stack: OverlayEntry[];
}

const EXIT_ANIMATION_MS = 300;
let seq = 0;

export const useOverlayStore = create<OverlayState>(() => ({ stack: [] }));

function close(id: number) {
  useOverlayStore.setState((s) => ({
    stack: s.stack.map((e) => (e.id === id ? { ...e, open: false } : e)),
  }));
  window.setTimeout(() => {
    useOverlayStore.setState((s) => ({ stack: s.stack.filter((e) => e.id !== id) }));
  }, EXIT_ANIMATION_MS);
}

export const overlay = {
  open(render: Render) {
    const id = ++seq;
    useOverlayStore.setState((s) => ({ stack: [...s.stack, { id, open: true, render }] }));
    return { id, close: () => close(id) };
  },
  close,
  closeAll() {
    useOverlayStore.getState().stack.forEach((e) => close(e.id));
  },
};
