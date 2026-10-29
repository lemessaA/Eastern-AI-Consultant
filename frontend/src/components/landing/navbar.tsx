"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

export function LandingNavbar() {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const scrolledNow = window.scrollY > 12;
      setScrolled(scrolledNow);
      const progress = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);
      setScrollProgress(progress);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#features", label: t("nav.features") },
    { href: "/academy", label: t("nav.academy") },
    { href: "/tools", label: t("nav.tools") },
    { href: "#pricing", label: t("nav.pricing") },
    { href: "/community", label: t("nav.community") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Scroll progress bar */}
      <motion.div
        className="absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r from-primary to-accent origin-left"
        style={{ transformOrigin: "0% 50%" }}
        animate={{ scaleX: scrollProgress }}
        transition={{ duration: 0.1, ease: "linear" }}
        aria-hidden
      />

      <nav
        className={cn(
          "relative transition-all duration-300",
          scrolled
            ? "glass-strong border-b border-border/60 shadow-lg shadow-primary/5"
            : "bg-transparent",
        )}
      >
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
              transition={{ duration: 0.4 }}
            >
              <Logo href="/" />
            </motion.div>

            <div className="hidden lg:flex items-center gap-1">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={l.href}
                    className={cn(
                      "relative px-3 py-2 rounded-md text-sm font-medium",
                      "text-muted-foreground hover:text-foreground",
                      "transition-all duration-200",
                      "before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-0.5",
                      "before:bg-gradient-to-r before:from-primary before:to-accent",
                      "before:-translate-x-1/2 before:transition-all before:duration-300",
                      "hover:before:w-[calc(100%-0.75rem)]",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    )}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop: Language + Theme + Auth */}
            <div className="hidden sm:flex items-center gap-1">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <LanguageSwitcher />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
              >
                <ThemeToggle />
              </motion.div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Sun className="h-4 w-4" />
                    {t("nav.signIn")}
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.3 }}
              >
                <Link href="/auth/signup">
                  <Button variant="gradient" size="sm" className="gap-2">
                    <ArrowRightIcon />
                    {t("nav.getStarted")}
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <motion.button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden overflow-hidden border-t border-border bg-background"
        >
          <div className="container py-4 space-y-1">
            {links.map((l, i) => (
              <motion.div key={l.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.03 }}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-sm font-medium hover:bg-muted transition-colors"
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-3 border-t border-border mt-3"
            >
              <LanguageSwitcher />
              <ThemeToggle />
              <Link href="/auth/login" className="ml-auto">
                <Button variant="ghost" size="sm">
                  {t("nav.signIn")}
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="gradient" size="sm">
                  {t("nav.getStarted")}
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </nav>
    </header>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}