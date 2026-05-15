"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Globe2, Languages } from "lucide-react";

import { useTranslation } from "@/hooks/use-translation";

export function Stats() {
  const { t } = useTranslation();
  const items = [
    { icon: GraduationCap, value: "12,800+", label: t("stats.students") },
    { icon: Briefcase, value: "1,450+", label: t("stats.businesses") },
    { icon: Globe2, value: "18", label: t("stats.countries") },
    { icon: Languages, value: "4", label: t("stats.languages") },
  ];
  return (
    <section className="border-y border-border/60 bg-background/40 py-12">
      <div className="container">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
          {items.map((it, i) => (
            <motion.div
              key={it.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <it.icon className="h-6 w-6 text-primary" />
              <div className="font-display text-2xl font-bold sm:text-3xl">{it.value}</div>
              <div className="text-xs text-muted-foreground sm:text-sm">{it.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
