import type { ReactNode } from "react";

import { ConfirmDialog } from "@/components/shared/overlays/ConfirmDialog";

import { overlay } from "./overlay.store";

export interface ConfirmOptions {
  title?: ReactNode;
  description?: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  /** Qizil tugma + ogohlantirish ikoni (o'chirish va h.k.) */
  destructive?: boolean;
  /** Tasdiqlanganda bajariladigan async amal — tugash/xato bo'lguncha tugma "loading" */
  onConfirm?: () => unknown | Promise<unknown>;
}

/**
 * Promise qaytaruvchi tasdiqlash oynasi:
 *
 *   if (await confirm({ title: "O'chirasizmi?", destructive: true })) { … }
 */
export function confirm(options: ConfirmOptions = {}): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    const settle = (value: boolean) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    overlay.open(({ open, close }) => (
      <ConfirmDialog
        {...options}
        open={open}
        onResult={(ok) => {
          settle(ok);
          close();
        }}
      />
    ));
  });
}
