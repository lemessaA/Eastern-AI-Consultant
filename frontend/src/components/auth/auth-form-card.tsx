"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export function AuthFormCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-border/60 bg-card/95 p-8 shadow-2xl shadow-primary/10 backdrop-blur-xl",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/50 before:to-transparent",
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:ring-1 after:ring-inset after:ring-white/20",
        "data-[theme=dark]:shadow-primary/20 data-[theme=dark]:border-primary/20",
        className,
      )}
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 50% -20%, hsl(var(--primary)/0.15), transparent 60%),
          radial-gradient(ellipse at 50% 120%, hsl(var(--accent)/0.1), transparent 50%)
        `
      }}
    >
      {children}
    </motion.div>
  );
}