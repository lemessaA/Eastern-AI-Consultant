"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { AuthFormCard } from "@/components/auth/auth-form-card";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/use-translation";
import { api, APIError } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { TokenResponse } from "@/types";
import { cn } from "@/lib/utils";

function LoginFormFallback() {
  const { t } = useTranslation();
  return (
    <AuthFormCard>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight">{t("auth.signInTitle")}</h1>
          <p className="text-sm text-muted-foreground">{t("auth.signInSubtitle")}</p>
        </div>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-label="Loading" />
        </div>
      </div>
    </AuthFormCard>
  );
}

function LoginFormInner() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "email":
        if (!value.trim()) return t("auth.emailRequired");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t("auth.emailInvalid");
        return "";
      case "password":
        if (!value) return t("auth.passwordRequired");
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const newErrors = {
      email: validateField("email", email),
      password: validateField("password", password),
    };

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      setTouched({ email: true, password: true });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const data = await api.post<TokenResponse>("/auth/login", { email, password }, { auth: false });
      setSession({
        user: data.user,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
      });
      toast.success(`Welcome back, ${data.user.full_name.split(" ")[0]} 👋`);
      router.replace(params.get("redirect") || "/dashboard");
    } catch (err) {
      const msg = err instanceof APIError ? err.message : "Could not sign in.";
      toast.error(msg);
      if (err instanceof APIError && err.status === 401) {
        setErrors({ password: "Invalid email or password" });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFormCard>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-display text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent"
          >
            {t("auth.signInTitle")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm text-muted-foreground"
          >
            {t("auth.signInSubtitle")}
          </motion.p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          onSubmit={onSubmit}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="group">
              {t("auth.email")}
              <Mail className="ml-1.5 h-3.5 w-3.5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" aria-hidden />
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40 focus-within:text-primary transition-colors" aria-hidden />
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className={cn(
                  "pl-10",
                  errors.email && "border-destructive focus:border-destructive focus:ring-destructive/20"
                )}
                onBlur={handleBlur}
                onChange={handleChange}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                disabled={loading}
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                id="email-error"
                className="text-sm text-destructive flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="group">
                {t("auth.password")}
                <Lock className="ml-1.5 h-3.5 w-3.5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" aria-hidden />
              </Label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {t("auth.forgot")}
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40 focus-within:text-primary transition-colors" aria-hidden />
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={cn(
                  "pl-10",
                  errors.password && "border-destructive focus:border-destructive focus:ring-destructive/20"
                )}
                onBlur={handleBlur}
                onChange={handleChange}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined}
                disabled={loading}
              />
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                id="password-error"
                className="text-sm text-destructive flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.password}
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
              "w-full size-lg gap-2 justify-center",
              "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90",
              "text-primary-foreground font-medium",
              "shadow-lg shadow-primary/25 hover:shadow-primary/40",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              loading && "animate-pulse"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                <span>{t("auth.signIn")}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                <span>{t("auth.signIn")}</span>
              </>
            )}
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="relative"
        >
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-3 text-muted-foreground/60">{t("auth.orContinueWith")}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <GoogleSignInButton />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="text-center text-sm text-muted-foreground"
        >
          {t("auth.noAccount")}{" "}
          <Link
            href="/auth/signup"
            className="text-primary font-medium hover:underline transition-colors"
          >
            {t("auth.signUp")}
          </Link>
        </motion.p>
      </div>
    </AuthFormCard>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<LoginFormFallback />}>
      <LoginFormInner />
    </React.Suspense>
  );
}