import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => {
          if (state.theme === "light") return { theme: "dark" };
          if (state.theme === "dark") return { theme: "light" };
          return { theme: "dark" };
        }),
    }),
    {
      name: "theme-storage",
    }
  )
);
