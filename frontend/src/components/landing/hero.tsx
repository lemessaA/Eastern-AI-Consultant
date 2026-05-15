"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-mesh-gradient opacity-70" aria-hidden />
      <div className="absolute inset-0 -z-10 grid-pattern-bg opacity-50" aria-hidden />
      <div className="absolute -top-32 left-1/2 -z-10 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" aria-hidden />

      <div className="container relative pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-xs font-medium backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">{t("hero.eyebrow")}</span>
          </div>

          <h1 className="mt-8 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
            <span className="gradient-text">{t("hero.title")}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("hero.subtitle")}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/auth/signup">
              <Button variant="gradient" size="xl" className="w-full sm:w-auto">
                {t("hero.startLearning")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                <Bot className="h-4 w-4" /> {t("hero.tryAssistant")}
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t("hero.poweredBy")}
          </p>
        </motion.div>

        {/* Floating cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <HeroPreview />
        </motion.div>
      </div>
    </section>
  );
}

function HeroPreview() {
  const { t } = useTranslation();
  return (
    <div className="relative rounded-2xl border border-border bg-card/80 p-2 shadow-2xl shadow-primary/10 backdrop-blur-xl">
      <div className="rounded-xl bg-background/80 p-4 sm:p-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-destructive/70" />
            <span className="h-3 w-3 rounded-full bg-warning/70" />
            <span className="h-3 w-3 rounded-full bg-success/70" />
          </div>
          <span className="text-xs text-muted-foreground">eastern.ai · /chat</span>
        </div>

        <div className="grid gap-4 pt-4 md:grid-cols-[180px,1fr]">
          {/* Agents column */}
          <div className="hidden md:flex flex-col gap-1 text-sm">
            {[
              "AI Teacher",
              "Business",
              "Agriculture",
              "Marketing",
              "Career",
              "Automation",
            ].map((a, i) => (
              <div
                key={a}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${i === 1 ? "bg-primary/10 text-primary" : "hover:bg-muted/60"}`}
              >
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-accent" />
                {a}
              </div>
            ))}
          </div>

          {/* Chat preview */}
          <div className="space-y-3">
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              {t("chat.promptExamples.0")}
            </div>
            <div className="rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 p-3 text-sm leading-relaxed">
              <p className="font-medium text-primary mb-1">Business Consultant</p>
              <p>
                Here are 5 ways AI can grow your business this week — starting with a WhatsApp
                FAQ bot that answers customers 24/7…
                <span className="inline-block h-3.5 w-2 bg-primary align-middle ml-1 animate-blink" />
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-2 text-xs text-muted-foreground">
              <Bot className="h-4 w-4" />
              {t("chat.placeholder")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
