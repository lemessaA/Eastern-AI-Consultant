"use client";

import { DashboardNavContent } from "@/components/dashboard/nav-content";
import { Logo } from "@/components/logo";

export function DashboardSidebar() {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card/50 backdrop-blur">
      <div className="p-4 border-b border-border">
        <Logo href="/dashboard" responsiveBrand />
      </div>

      <DashboardNavContent />
    </aside>
  );
}
