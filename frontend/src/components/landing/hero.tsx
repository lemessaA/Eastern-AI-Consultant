"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Sparkles, Zap, Globe, Users, BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { marketingImages } from "@/lib/marketing-images";
import { cn } from "@/lib/utils";

export function Hero() {
  const { t } = useTranslation();

  const trustIndicators = [
    { icon: Users, label: "12.8k+", desc: "Learners" },
    { icon: Globe, label: "4", desc: "Languages" },
    { icon: Zap, label: "10", desc: "AI Agents" },
    { icon: BarChart3, label: "99%", desc: "Satisfaction" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 -z-20" aria-hidden>
        <div className="absolute inset-0 bg-mesh-gradient opacity-60" />
        <div className="absolute inset-0 grid-pattern-bg opacity-30" />
      </div>

      {/* Floating animated orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/15 blur-3xl"
        animate={{ x: [-20, 20, -20], y: [-20, 20, -20], scale: [1, 1.05, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/15 blur-3xl"
        animate={{ x: [20, -20, 20], y: [20, -20, 20], scale: [1, 1.08, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        aria-hidden
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      <div className="container relative pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-1.5 text-xs font-medium backdrop-blur-md"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="h-3.5 w-3.5 text-primary"
              >
                <Sparkles />
              </motion.span>
              <span className="text-muted-foreground">{t("hero.eyebrow")}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-8 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              <span className="gradient-text">{t("hero.title")}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <Link href="/auth/signup">
                <Button variant="gradient" size="xl" className="w-full sm:w-auto group">
                  {t("hero.startLearning")}
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    className="inline-block"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" size="xl" className="w-full sm:w-auto group">
                  <Bot className="h-4 w-4 mr-2" />
                  {t("hero.tryAssistant")}
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-12 flex flex-wrap items-center gap-6 sm:gap-8"
            >
              {trustIndicators.map((item, index) => (
                <motion.div
                  key={item.desc}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.08, duration: 0.4 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                    <item.icon className="h-4 w-4 text-primary" aria-hidden />
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Powered by */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-8 text-xs uppercase tracking-[0.2em] text-muted-foreground/60"
            >
              {t("hero.poweredBy")}
            </motion.p>
          </motion.div>

          {/* Photography + product preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-xl lg:max-w-none"
          >
            {/* Main image with glow effect */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/60 shadow-2xl shadow-primary/10 sm:aspect-[5/4]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" aria-hidden />
              <Image
                src={marketingImages.hero.main}
                alt="Diverse team using technology to learn and build"
                fill
                priority
                className="object-cover transition-transform duration-1000 hover:scale-[1.02]"
                sizes="(max-width: 1024px) 90vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
            </div>

            {/* Floating animated orbs around main image */}
            <motion.div
              className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/20 blur-2xl"
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />
            <motion.div
              className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-accent/20 blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              aria-hidden
            />

            {/* Floating inset card */}
            <motion.div
              className="absolute -bottom-6 -left-4 w-[55%] overflow-hidden rounded-2xl border border-border/60 shadow-xl sm:-left-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)" }}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={marketingImages.hero.float}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="240px"
                />
              </div>
            </motion.div>

            {/* Floating feature card */}
            <motion.div
              className="absolute -right-2 top-8 max-w-[220px] rounded-2xl border border-border/60 bg-card/95 p-4 shadow-xl backdrop-blur-md sm:right-4"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.2)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs font-medium text-primary">AI Business Consultant</p>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                "Here are 5 ways AI can grow your business this week…"
              </p>
            </motion.div>

            {/* New: Floating stats card */}
            <motion.div
              className="absolute bottom-6 right-4 w-[160px] rounded-2xl border border-border/60 bg-card/95 p-3 shadow-lg backdrop-blur-md"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-xl font-bold text-foreground">12.8k+</p>
                  <p className="text-xs text-muted-foreground">Active Users</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                  <ArrowRight className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Hero Preview - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
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
    <div className="relative rounded-2xl border border-border/60 bg-card/80 p-2 shadow-2xl shadow-primary/10 backdrop-blur-xl">
      <div className="rounded-xl bg-background/80 p-4 sm:p-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-destructive/70" />
            <span className="h-3 w-3 rounded-full bg-warning/70" />
            <span className="h-3 w-3 rounded-full bg-success/70" />
          </div>
          <span className="text-xs text-muted-foreground">eastern.ai · /chat</span>
        </div>

        <div className="grid gap-4 pt-4 md:grid-cols-[200px,1fr]">
          <div className="hidden md:flex flex-col gap-1 text-sm">
            {[
              { name: "AI Teacher", icon: "🎓" },
              { name: "Business Consultant", icon: "💼" },
              { name: "Agriculture Advisor", icon: "🌱" },
              { name: "Marketing Assistant", icon: "📢" },
              { name: "Career Coach", icon: "🎯" },
              { name: "Automation Expert", icon: "⚡" },
            ].map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${i === 1 ? "bg-primary/10 text-primary" : "hover:bg-muted/60 transition-colors cursor-pointer"}`}
              >
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-accent" />
                {a.name}
              </motion.div>
            ))}
          </div>

          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="rounded-lg bg-muted/50 p-3 text-sm"
            >
              {t("chat.promptExamples.0")}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-3 text-sm leading-relaxed"
            >
              <p className="mb-1 font-medium text-primary">Business Consultant</p>
              <p>
                WhatsApp FAQ bot, content calendar, and a 7-day action plan tailored to your city…
                <span className="ml-1 inline-block h-3.5 w-2 animate-blink bg-primary align-middle" />
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex items-center gap-2 rounded-lg border border-border/60 bg-background p-2 text-xs text-muted-foreground"
            >
              <Bot className="h-4 w-4" />
              {t("chat.placeholder")}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}