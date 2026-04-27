import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
}

interface AuthStore {
  user: User | null;
  users: User[];
  _hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (data: { name: string; email: string; password: string }) => { success: boolean; message: string };
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      _hasHydrated: false,

      setHasHydrated: (val) => set({ _hasHydrated: val }),

      register: ({ name, email, password }) => {
        const exists = get().users.find((u) => u.email === email);
        if (exists) return { success: false, message: "Email already registered" };
        const newUser = { name, email, password };
        set((state) => ({ users: [...state.users, newUser] }));
        return { success: true, message: "Account created!" };
      },

      login: (email, password) => {
        const found = get().users.find(
          (u) => u.email === email && u.password === password
        );
        if (!found) return { success: false, message: "Invalid email or password" };
        set({ user: found });
        return { success: true, message: `Welcome back, ${found.name}!` };
      },

      logout: () => set({ user: null }),
    }),
    {
      name: "auth-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);