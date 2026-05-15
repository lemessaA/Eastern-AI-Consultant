"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";

import { useAuthStore } from "@/store/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const token = useAuthStore((s) => s.accessToken);

  React.useEffect(() => {
    if (isHydrated && !token) {
      const redirect = encodeURIComponent(pathname);
      router.replace(`/auth/login?redirect=${redirect}`);
    }
  }, [isHydrated, token, pathname, router]);

  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-primary/40" />
      </div>
    );
  }

  if (!token) return null;
  return <>{children}</>;
}
