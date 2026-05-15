"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "@/hooks/use-translation";
import { translations, type Locale } from "@/lib/i18n/translations";

export function FAQ() {
  const { t, locale } = useTranslation();
  const dict = translations[locale as Locale] ?? translations.en;
  const items = dict.faq.items;
  return (
    <section className="py-24 sm:py-32">
      <div className="container max-w-3xl">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("faq.title")}</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10 w-full">
          {items.map((it, i) => (
            <AccordionItem key={it.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{it.q}</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
