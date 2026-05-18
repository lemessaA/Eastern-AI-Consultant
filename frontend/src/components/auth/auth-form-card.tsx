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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-8 shadow-xl shadow-primary/5 backdrop-blur-sm",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/40 before:to-transparent",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
