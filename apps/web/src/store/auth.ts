"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isHydrated: boolean;
  setSession: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }) => void;
  setUser: (user: User) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isHydrated: false,
      setSession: ({ user, accessToken, refreshToken, expiresIn }) =>
        set({
          user,
          accessToken,
          refreshToken,
          expiresAt: Date.now() + expiresIn * 1000,
        }),
      setUser: (user) => set({ user }),
      clear: () => set({ user: null, accessToken: null, refreshToken: null, expiresAt: null }),
    }),
    {
      name: "eai-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        expiresAt: s.expiresAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.isHydrated = true;
      },
    },
  ),
);
