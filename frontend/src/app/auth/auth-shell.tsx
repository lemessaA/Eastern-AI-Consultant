"use client";

import { GoogleAuthProvider } from "@/components/auth/google-auth-provider";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return <GoogleAuthProvider>{children}</GoogleAuthProvider>;
}
