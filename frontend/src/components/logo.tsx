import type { MouseEventHandler } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
  showText = true,
  /** When true, tagline stays visible on narrow widths (drawers / compact headers). */
  responsiveBrand = false,
  onClick,
}: {
  className?: string;
  href?: string;
  showText?: boolean;
  responsiveBrand?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("inline-flex items-center gap-2 group", className)}
      aria-label="Eastern AI Consultant"
    >
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-plum to-accent shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
        <span className="text-white font-display font-bold text-sm">EA</span>
        <span className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-white/20" />
      </span>
      {showText && (
        <span
          className={
            responsiveBrand
              ? "inline-flex flex-col leading-none"
              : "hidden sm:inline-flex flex-col leading-none"
          }
        >
          <span className="font-display font-semibold text-sm tracking-tight">
            Eastern AI
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Consultant
          </span>
        </span>
      )}
    </Link>
  );
}
