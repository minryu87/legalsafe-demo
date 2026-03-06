/**
 * Auth Store
 * JWT 기반 로그인 상태 관리 (localStorage 영속화)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as apiLogin } from "@/lib/api/auth";

interface AuthState {
  token: string | null;
  username: string | null;
  displayName: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;

  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      displayName: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (value) => set({ _hasHydrated: value }),

      login: async (username, password) => {
        const res = await apiLogin({ username, password });
        set({
          token: res.access_token,
          username: res.username,
          displayName: res.display_name,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          token: null,
          username: null,
          displayName: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "alean-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
