"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { Locale } from "@/lib/i18n/translations";

interface LangState {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

export const useLanguageStore = create<LangState>()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "eai-locale",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
