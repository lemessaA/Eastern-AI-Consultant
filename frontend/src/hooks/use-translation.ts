"use client";

import { useCallback } from "react";

import { type Locale, t } from "@/lib/i18n/translations";
import { useLanguageStore } from "@/store/language";

export function useTranslation() {
  const locale = useLanguageStore((s) => s.locale);
  const setLocale = useLanguageStore((s) => s.setLocale);

  const translate = useCallback(
    (path: string, params?: Record<string, string | number>) => t(locale as Locale, path, params),
    [locale],
  );

  return { t: translate, locale: locale as Locale, setLocale };
}
