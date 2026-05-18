"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { marketingImages } from "@/lib/marketing-images";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-mesh-gradient opacity-70" aria-hidden />
      <div className="absolute inset-0 -z-10 grid-pattern-bg opacity-40" aria-hidden />
      <div
        className="absolute -top-24 right-0 -z-10 h-[520px] w-[520px] rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />

      <div className="container relative pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-1.5 text-xs font-medium backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">{t("hero.eyebrow")}</span>
            </div>

            <h1 className="mt-8 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="gradient-text">{t("hero.title")}</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("hero.subtitle")}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
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

          {/* Photography + product preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="relative mx-auto w-full max-w-xl lg:max-w-none"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border shadow-2xl shadow-primary/15 sm:aspect-[5/4]">
              <Image
                src={marketingImages.hero.main}
                alt="Diverse team using technology to learn and build"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
            </div>

            {/* Floating inset card */}
            <motion.div
              className="absolute -bottom-6 -left-4 w-[55%] overflow-hidden rounded-2xl border border-border shadow-xl sm:-left-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={marketingImages.hero.float}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="240px"
                />
              </div>
            </motion.div>

            <motion.div
              className="absolute -right-2 top-8 max-w-[200px] rounded-2xl border border-border/80 bg-card/95 p-4 shadow-xl backdrop-blur-md sm:right-4"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <p className="text-xs font-medium text-primary">Business Consultant</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                “Here are 5 ways AI can grow your business this week…”
              </p>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="relative mx-auto mt-20 max-w-5xl hidden md:block"
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
          <div className="hidden md:flex flex-col gap-1 text-sm">
            {["AI Teacher", "Business", "Agriculture", "Marketing", "Career", "Automation"].map(
              (a, i) => (
                <div
                  key={a}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${i === 1 ? "bg-primary/10 text-primary" : "hover:bg-muted/60"}`}
                >
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-accent" />
                  {a}
                </div>
              ),
            )}
          </div>

          <div className="space-y-3">
            <div className="rounded-lg bg-muted/50 p-3 text-sm">{t("chat.promptExamples.0")}</div>
            <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-3 text-sm leading-relaxed">
              <p className="mb-1 font-medium text-primary">Business Consultant</p>
              <p>
                WhatsApp FAQ bot, content calendar, and a 7-day action plan tailored to your city…
                <span className="ml-1 inline-block h-3.5 w-2 animate-blink bg-primary align-middle" />
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
