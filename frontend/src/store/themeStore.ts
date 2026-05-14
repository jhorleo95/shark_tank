import { create } from "zustand";

interface ThemeStore {
  primary: string;
  setPrimary: (color: string) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  primary: "#2563eb",

  setPrimary: (color) => {
    document.documentElement.style.setProperty("--primary", color);
    set({ primary: color });
  },
}));
