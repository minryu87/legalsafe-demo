/**
 * Theme Store
 * dark (Option A: Legal Navy) / light (Option C: Authority Slate) 토글
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "light",
      toggleTheme: () =>
        set({ mode: get().mode === "light" ? "dark" : "light" }),
    }),
    { name: "alean-theme" }
  )
);
