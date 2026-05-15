"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Briefcase,
  GraduationCap,
  Sprout,
  Workflow,
  UserCheck,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export function Features() {
  const { t } = useTranslation();
  const items = [
    { key: "chat", icon: Bot, color: "from-primary to-plum" },
    { key: "academy", icon: GraduationCap, color: "from-cobalt to-primary" },
    { key: "business", icon: Briefcase, color: "from-accent to-warning" },
    { key: "automation", icon: Workflow, color: "from-plum to-accent" },
    { key: "agriculture", icon: Sprout, color: "from-success to-baobab" },
    { key: "career", icon: UserCheck, color: "from-cobalt to-success" },
  ];

  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t("features.title")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("features.subtitle")}</p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="card-hover h-full overflow-hidden">
                <CardContent className="p-6">
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${it.color} text-white shadow-lg`}
                  >
                    <it.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">
                    {t(`features.items.${it.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`features.items.${it.key}.body`)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
