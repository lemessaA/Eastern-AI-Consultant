"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Globe2, Sparkles, Users } from "lucide-react";

import { Logo } from "@/components/logo";
import { marketingImages } from "@/lib/marketing-images";

const stats = [
  { value: "12.8k+", label: "Learners", icon: Users },
  { value: "1.4k+", label: "Businesses", icon: Sparkles },
  { value: "4", label: "Languages", icon: Globe2 },
] as const;

export function AuthVisualPanel() {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden lg:block">
      {/* Primary photograph */}
      <Image
        src={marketingImages.auth.primary}
        alt="Team collaborating on innovative projects"
        fill
        priority
        className="object-cover object-center"
        sizes="50vw"
      />

      {/* Layered gradients for depth & readability */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-violet-950/90 via-background/40 to-amber-950/50"
        aria-hidden
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,hsl(var(--primary)/0.45),transparent_55%)]"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />

      {/* Floating secondary images */}
      <motion.div
        className="absolute right-8 top-[18%] w-36 overflow-hidden rounded-2xl border border-white/20 shadow-2xl shadow-black/30 ring-1 ring-white/10"
        initial={{ opacity: 0, y: 24, rotate: 6 }}
        animate={{ opacity: 1, y: 0, rotate: 6 }}
        transition={{ delay: 0.35, duration: 0.7 }}
      >
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={marketingImages.auth.secondary}
            alt=""
            fill
            className="object-cover"
            sizes="144px"
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-[32%] left-8 w-32 overflow-hidden rounded-2xl border border-white/20 shadow-2xl shadow-black/30 ring-1 ring-white/10"
        initial={{ opacity: 0, y: -20, rotate: -8 }}
        animate={{ opacity: 1, y: 0, rotate: -8 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        <div className="relative aspect-square w-full">
          <Image
            src={marketingImages.auth.accent}
            alt=""
            fill
            className="object-cover"
            sizes="128px"
          />
        </div>
      </motion.div>

      <div className="relative z-10 flex h-full flex-col p-10 xl:p-12">
        <Logo
          showText
          responsiveBrand
          className="text-white drop-shadow-sm [&_span]:text-white [&_.text-muted-foreground]:text-white/60"
        />

        <div className="mt-auto max-w-lg space-y-8 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Made for Eastern Africa & beyond
            </p>
            <h2 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white xl:text-5xl">
              Learn AI.
              <br />
              <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-amber-200 bg-clip-text text-transparent">
                Grow your future.
              </span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/75">
              One platform for students, founders, and teams — chat with specialist agents, take
              courses, and automate work in English, Amharic, Oromo, and Somali.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-3 gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            {stats.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl"
              >
                <Icon className="mb-2 h-4 w-4 text-violet-200" aria-hidden />
                <p className="font-display text-2xl font-bold text-white">{value}</p>
                <div className="text-xs text-white/60">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} Eastern AI Consultant
        </p>
      </div>
    </aside>
  );
}
