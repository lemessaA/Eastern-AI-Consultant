"use client";

import * as React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? "";

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  if (!clientId) {
    return <>{children}</>;
  }
  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
}

export function isGoogleAuthConfigured(): boolean {
  return Boolean(clientId);
}
