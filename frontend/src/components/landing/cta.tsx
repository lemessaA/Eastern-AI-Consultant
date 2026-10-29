"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Globe, Zap, Shield, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

export function CTA() {
  const { t } = useTranslation();

  const benefits = [
    { icon: Users, label: "12.8k+ active learners" },
    { icon: Globe, label: "4 languages supported" },
    { icon: Zap, label: "10 AI agents" },
    { icon: Shield, label: "Enterprise security" },
  ];

  return (
    <section className="relative py-24 sm:py-32">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 -z-20" aria-hidden>
        <div className="absolute inset-0 bg-mesh-gradient opacity-70" />
        <div className="absolute inset-0 grid-pattern-bg opacity-40" />
      </div>

      {/* Floating animated orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
        animate={{ x: [-20, 20, -20], y: [-20, 20, -20], scale: [1, 1.08, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/20 blur-3xl"
        animate={{ x: [20, -20, 20], y: [20, -20, 20], scale: [1, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        aria-hidden
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-violet-500/15 blur-3xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 via-plum/10 to-accent/15 px-8 py-16 text-center sm:px-12 sm:py-24 lg:py-28"
        >
          {/* Decorative top accent */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-b-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          />

          {/* Floating particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/20"
              style={{
                width: `${4 + (i % 3) * 2}px`,
                height: `${4 + (i % 3) * 2}px`,
                left: `${10 + (i % 5) * 18}%`,
                top: `${15 + (i % 4) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 8 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
              aria-hidden
            />
          ))}

          {/* Benefits badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8 flex flex-wrap items-center justify-center gap-3"
          >
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent">
                  <benefit.icon className="h-2.5 w-2.5 text-primary-foreground" aria-hidden />
                </div>
                <span className="text-xs font-medium text-white/90">{benefit.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Main headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl"
          >
            <span className="gradient-text">{t("cta.title") || "Build the future, in your language."}</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground"
          >
            {t("cta.subtitle") || "Join 12,000+ African students, entrepreneurs and NGOs using Eastern AI to learn, build, and grow with AI."}
          </motion.p>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-white/70"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{t("cta.noCard") || "No credit card required"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{t("cta.cancelAnytime") || "Cancel anytime"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{t("cta.freeTrial") || "14-day free trial"}</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/auth/signup">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-4 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 group"
              >
                <span className="relative flex items-center gap-2">
                  {t("hero.startLearning") || "Start Learning Free"}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>
            </Link>
            <Link href="/chat">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "hsl(var(--accent))" }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden rounded-xl border-2 border-white/30 bg-transparent px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all duration-300 group backdrop-blur"
              >
                <span className="relative flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  {t("hero.tryAssistant") || "Try AI Assistant"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-12 flex items-center justify-center gap-4"
          >
            <div className="flex -space-x-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
                  className="relative h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-primary/20 to-accent/20"
                  aria-label="User avatar"
                />
              ))}
            </div>
            <div className="text-sm text-white/70">
              <span className="font-semibold text-white">{t("cta.trustedBy") || "Trusted by"}</span>{" "}
              <span className="font-bold text-primary">12,800+</span>{" "}
              {t("cta.innovators") || "innovators"}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}