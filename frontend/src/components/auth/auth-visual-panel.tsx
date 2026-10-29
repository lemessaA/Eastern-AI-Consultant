"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Globe2, Sparkles, Users, Zap, Award, Shield, Brain, BarChart3 } from "lucide-react";

import { Logo } from "@/components/logo";
import { marketingImages } from "@/lib/marketing-images";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

const stats = [
  { value: "12.8k+", label: "Learners", icon: Users, color: "from-violet-500 to-fuchsia-500" },
  { value: "1.4k+", label: "Businesses", icon: Sparkles, color: "from-cyan-500 to-blue-500" },
  { value: "4", label: "Languages", icon: Globe2, color: "from-emerald-500 to-teal-500" },
  { value: "99%", label: "Satisfaction", icon: Award, color: "from-amber-500 to-orange-500" },
] as const;

const trustBadges = [
  { icon: Shield, label: "Enterprise Security", desc: "SOC 2 compliant" },
  { icon: Brain, label: "AI-Powered", desc: "Latest models" },
  { icon: BarChart3, label: "Analytics", desc: "Real-time insights" },
  { icon: Zap, label: "Automation", desc: "No-code workflows" },
] as const;

export function AuthVisualPanel() {
  const { t } = useTranslation();

  return (
    <aside className="relative hidden min-h-screen overflow-hidden lg:block">
      {/* Primary photograph with subtle parallax */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={marketingImages.auth.primary}
          alt="Team collaborating on innovative projects"
          fill
          priority
          className="object-cover object-center transition-transform duration-1000 hover:scale-[1.02]"
          sizes="50vw"
        />
      </div>

      {/* Layered gradients for depth & readability */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-violet-950/95 via-background/50 to-amber-950/60"
        aria-hidden
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,hsl(var(--primary)/0.5),transparent_55%),radial-gradient(ellipse_at_80%_80%,hsl(var(--accent)/0.35),transparent_50%)]"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Animated mesh gradients */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
          animate={{ x: [-20, 20, -20], y: [-20, 20, -20] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/20 blur-3xl"
          animate={{ x: [20, -20, 20], y: [20, -20, 20] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating secondary images with enhanced styling */}
      <motion.div
        className="absolute right-8 top-[15%] w-40 overflow-hidden rounded-2xl border border-white/20 shadow-2xl shadow-black/40 ring-1 ring-white/10"
        initial={{ opacity: 0, y: 30, rotate: 8 }}
        animate={{ opacity: 1, y: 0, rotate: 8 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.03, rotate: 6, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
      >
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={marketingImages.auth.secondary}
            alt=""
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="160px"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </motion.div>

      <motion.div
        className="absolute bottom-[28%] left-6 w-36 overflow-hidden rounded-2xl border border-white/20 shadow-2xl shadow-black/40 ring-1 ring-white/10"
        initial={{ opacity: 0, y: -25, rotate: -10 }}
        animate={{ opacity: 1, y: 0, rotate: -10 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.03, rotate: -6, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
      >
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={marketingImages.auth.accent}
            alt=""
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="144px"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </motion.div>

      {/* New: Third floating image */}
      <motion.div
        className="absolute top-[45%] right-4 w-24 overflow-hidden rounded-xl border border-white/15 shadow-xl shadow-black/30"
        initial={{ opacity: 0, x: 30, scale: 0.9 }}
        animate={{ opacity: 0.8, x: 0, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        style={{ opacity: 0.8 }}
      >
        <div className="relative aspect-square w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30" />
        </div>
      </motion.div>

      <div className="relative z-10 flex h-full flex-col p-8 xl:p-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <Logo
            href="/"
            showText
            responsiveBrand
            className="text-white drop-shadow-sm [&_span]:text-white [&_.text-muted-foreground]:text-white/60"
          />
        </motion.div>

        <div className="mt-auto max-w-lg space-y-8 pb-4">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                {t("auth.panel.madeFor") || "Made for Eastern Africa & beyond"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 backdrop-blur-md">
                <Zap className="h-3.5 w-3.5" />
                {t("auth.panel.aiPowered") || "AI-Powered Platform"}
              </span>
            </div>

            <h2 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white xl:text-5xl 2xl:text-6xl">
              {t("auth.panel.learnAI") || "Learn AI."}
              <br />
              <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-amber-200 bg-clip-text text-transparent">
                {t("auth.panel.growFuture") || "Grow your future."}
              </span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/75 max-w-xl">
              {t("auth.panel.description") || "One platform for students, founders, and teams — chat with specialist agents, take courses, and automate work in English, Amharic, Oromo, and Somali."}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 gap-3 xl:grid-cols-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            {stats.map(({ value, label, icon: Icon, color }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + 0.08 * stats.indexOf({ value, label, icon: Icon, color }), duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl border border-white/15 bg-white/5 p-4 xl:p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-2 mb-2">
                  <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl",
                    `bg-gradient-to-br ${color}`
                  )}>
                    <Icon className="h-5 w-5 text-white" aria-hidden />
                  </div>
                </div>
                <p className="relative font-display text-2xl xl:text-3xl font-bold text-white">{value}</p>
                <div className="relative text-xs text-white/60 font-medium">{label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Badges - NEW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="pt-4 border-t border-white/10"
          >
            <p className="mb-3 text-xs font-medium text-white/50 uppercase tracking-wider">
              {t("auth.panel.trustedBy") || "Trusted by innovators"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {trustBadges.map(({ icon: Icon, label, desc }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + index * 0.06, duration: 0.4 }}
                  className="flex items-start gap-3 rounded-xl bg-white/5 p-3 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <Icon className="h-4 w-4 text-white/80" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{label}</p>
                    <p className="text-xs text-white/50">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA hint */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="pt-4 flex items-center justify-center gap-2 text-sm text-white/50"
          >
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              →
            </motion.span>
            <span>{t("auth.panel.joinNow") || "Join thousands building with AI"}</span>
          </motion.div>

          <p className="text-xs text-white/40 text-center">
            © {new Date().getFullYear()} Eastern AI Consultant
          </p>
        </div>
      </div>
    </aside>
  );
}