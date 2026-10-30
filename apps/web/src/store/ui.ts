import { create } from "zustand";

type UI = {
  toast: string | null;
  notify: (message: string) => void;
  dismiss: () => void;
};
export const useUI = create<UI>((set) => ({
  toast: null,
  notify: (toast) => set({ toast }),
  dismiss: () => set({ toast: null }),
}));
