"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { Loader2, CheckCircle2, AlertCircle, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { isGoogleAuthConfigured } from "@/components/auth/google-auth-provider";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { api, APIError } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { TokenResponse } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GoogleSignInButtonProps {
  redirectTo?: string;
}

export function GoogleSignInButton({ redirectTo }: GoogleSignInButtonProps) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const [loading, setLoading] = React.useState(false);
  const [fallbackLoading, setFallbackLoading] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = React.useState(360);
  const [showFallback, setShowFallback] = React.useState(false);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setButtonWidth(Math.max(280, Math.floor(el.offsetWidth)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const destination = redirectTo ?? params.get("redirect") ?? "/dashboard";

  async function handleCredential(response: CredentialResponse) {
    const idToken = response.credential;
    if (!idToken) {
      toast.error("Google did not return a sign-in token.");
      return;
    }
    setLoading(true);
    try {
      const data = await api.post<TokenResponse>(
        "/auth/google",
        { id_token: idToken, preferred_language: locale },
        { auth: false },
      );
      setSession({
        user: data.user,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
      });
      toast.success(`Welcome, ${data.user.full_name.split(" ")[0]} 👋`);
      router.replace(destination);
    } catch (err) {
      const msg = err instanceof APIError ? err.message : "Google sign-in failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleFallbackClick() {
    if (!isGoogleAuthConfigured()) {
      toast.info("Google Sign-In requires configuration. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment variables.");
      return;
    }
    setFallbackLoading(true);
    setShowFallback(true);
  }

  if (!isGoogleAuthConfigured()) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button
          variant="outline"
          size="lg"
          className={cn(
            "w-full gap-3",
            "border-border/60 hover:border-primary/50",
            "bg-gradient-to-br from-background to-muted/50",
            "hover:shadow-lg hover:shadow-primary/10",
            "transition-all duration-300",
            "disabled:opacity-50"
          )}
          onClick={handleFallbackClick}
          disabled={fallbackLoading}
          whileHover={{ scale: fallbackLoading ? 1 : 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <GoogleIcon className="h-5 w-5 flex-shrink-0" />
          <span className="flex-1 text-left font-medium">
            {t("auth.google")}
          </span>
          {fallbackLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-muted-foreground/50" aria-hidden />
          )}
        </Button>
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2 text-xs text-muted-foreground/60 text-center"
        >
          {t("auth.googleNotConfigured") || "Configure GOOGLE_CLIENT_ID to enable"}
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full min-h-[48px]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-background/80 backdrop-blur-sm"
        >
          <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
        </motion.div>
      )}
      <div className={cn(loading ? "pointer-events-none opacity-60" : "")}>
        <GoogleLogin
          onSuccess={handleCredential}
          onError={() => toast.error("Google sign-in was cancelled or failed.")}
          useOneTap={false}
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          width={buttonWidth}
          locale={locale === "am" ? "am" : locale === "om" ? "om" : locale === "so" ? "so" : "en"}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground/60"
      >
        <div className="flex items-center gap-1 h-4">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-400" />
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-green-400" />
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400" />
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-red-400" />
        </div>
        <span>{t("auth.secureSignIn") || "Secure sign-in with Google"}</span>
      </motion.div>
    </motion.div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285f4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34a853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#fbbc05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
      />
      <path
        fill="#ea4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}