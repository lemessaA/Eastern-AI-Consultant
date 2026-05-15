"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bot,
  Briefcase,
  Hammer,
  LayoutDashboard,
  LineChart,
  LogOut,
  MessageSquare,
  Settings,
  ShieldCheck,
  Sprout,
  UserCheck,
  Users,
  Workflow,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

interface NavGroup {
  label: string;
  items: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}

const NAV: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/chat", label: "AI Chat", icon: MessageSquare },
    ],
  },
  {
    label: "Learn",
    items: [
      { href: "/academy", label: "Academy", icon: BookOpen },
      { href: "/tools", label: "AI Tools", icon: Hammer },
      { href: "/community", label: "Community", icon: Users },
    ],
  },
  {
    label: "Build",
    items: [
      { href: "/business", label: "Business AI", icon: Briefcase },
      { href: "/automation", label: "Automation", icon: Workflow },
      { href: "/agriculture", label: "Agriculture", icon: Sprout },
      { href: "/career", label: "Career Coach", icon: UserCheck },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);

  const isAdmin = user?.role === "admin" || user?.is_superuser;

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card/50 backdrop-blur">
      <div className="p-4 border-b border-border">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-6">
        {NAV.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {isAdmin && (
          <div>
            <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Admin
            </p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/admin"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    pathname.startsWith("/admin")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/analytics"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <LineChart className="h-4 w-4" />
                  Analytics
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>

      <div className="border-t border-border p-3 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 px-3 text-muted-foreground hover:text-foreground"
          onClick={() => {
            clear();
            window.location.href = "/auth/login";
          }}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </aside>
  );
}
