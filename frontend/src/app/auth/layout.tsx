import Link from "next/link";

import { AuthShell } from "@/app/auth/auth-shell";
import { AuthMobileBanner } from "@/components/auth/auth-mobile-banner";
import { AuthVisualPanel } from "@/components/auth/auth-visual-panel";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthVisualPanel />

      <main className="relative flex min-h-screen flex-col bg-background">
        {/* Soft ambient glow on form side */}
        <div
          className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />

        <div className="relative flex items-center justify-between p-4 sm:p-6">
          <Link href="/" className="lg:hidden">
            <Logo />
          </Link>
          <div className="ml-auto flex items-center gap-1 rounded-full border border-border/60 bg-card/50 p-1 backdrop-blur-md">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center px-4 pb-10 pt-2 sm:px-6">
          <AuthShell>
            <div className="w-full max-w-[420px]">
              <AuthMobileBanner />
              {children}
            </div>
          </AuthShell>
        </div>
      </main>
    </div>
  );
}
