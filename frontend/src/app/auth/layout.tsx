import Link from "next/link";

import { AuthShell } from "@/app/auth/auth-shell";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — marketing panel */}
      <aside className="relative hidden overflow-hidden bg-muted/30 p-12 lg:flex lg:flex-col">
        <div className="absolute inset-0 -z-10 bg-mesh-gradient opacity-80" aria-hidden />
        <div className="absolute inset-0 -z-10 grid-pattern-bg opacity-40" aria-hidden />
        <Logo />
        <div className="flex flex-1 flex-col justify-center max-w-md mt-12">
          <h2 className="font-display text-4xl font-bold leading-tight">
            <span className="gradient-text">Learn AI.</span>
            <br />
            <span className="gradient-text">Automate business.</span>
            <br />
            <span className="gradient-text">Build the future.</span>
          </h2>
          <p className="mt-6 text-muted-foreground">
            Join thousands of African students, entrepreneurs and NGOs already using Eastern AI to
            grow with AI — in English, Amharic, Afaan Oromo, and Af-Soomaali.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border border-border bg-background/60 p-4 backdrop-blur">
              <div className="font-display text-2xl font-bold">12,800+</div>
              <div className="text-muted-foreground text-xs">Students trained</div>
            </div>
            <div className="rounded-lg border border-border bg-background/60 p-4 backdrop-blur">
              <div className="font-display text-2xl font-bold">1,450+</div>
              <div className="text-muted-foreground text-xs">Businesses served</div>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Eastern AI Consultant
        </p>
      </aside>

      {/* Right — form panel */}
      <main className="relative flex min-h-screen flex-col">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="lg:hidden">
            <Logo />
          </Link>
          <div className="ml-auto flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <AuthShell>
            <div className="w-full max-w-md">{children}</div>
          </AuthShell>
        </div>
      </main>
    </div>
  );
}
