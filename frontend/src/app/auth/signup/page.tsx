"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, User, Globe, AlertCircle, CheckCircle2, Shield, HelpCircle } from "lucide-react";
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

function SignupFormFallback() {
  const { t } = useTranslation();
  return (
    <AuthFormCard>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight">{t("auth.signUpTitle")}</h1>
          <p className="text-sm text-muted-foreground">{t("auth.signUpSubtitle")}</p>
        </div>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-label="Loading" />
        </div>
      </div>
    </AuthFormCard>
  );
}

function passwordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak", color: "text-destructive" };
  if (score <= 4) return { score, label: "Fair", color: "text-yellow-500" };
  if (score <= 5) return { score, label: "Good", color: "text-blue-500" };
  return { score, label: "Strong", color: "text-green-500" };
}

function SignupFormInner() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "full_name":
        if (!value.trim()) return t("auth.fullNameRequired");
        if (value.trim().length < 2) return t("auth.fullNameMin");
        return "";
      case "email":
        if (!value.trim()) return t("auth.emailRequired");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t("auth.emailInvalid");
        return "";
      case "password":
        if (!value) return t("auth.passwordRequired");
        if (value.length < 8) return t("auth.passwordMin");
        return "";
      case "country":
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
    if (name === "password") setPassword(value);
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const strength = passwordStrength(password);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const full_name = String(formData.get("full_name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const pwd = String(formData.get("password") || "");
    const country = String(formData.get("country") || "").trim() || undefined;

    const newErrors = {
      full_name: validateField("full_name", full_name),
      email: validateField("email", email),
      password: validateField("password", pwd),
    };

    if (newErrors.full_name || newErrors.email || newErrors.password) {
      setErrors(newErrors);
      setTouched({ full_name: true, email: true, password: true });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const data = await api.post<TokenResponse>(
        "/auth/register",
        {
          email,
          password: pwd,
          full_name,
          country,
          preferred_language: locale,
        },
        { auth: false },
      );
      setSession({
        user: data.user,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
      });
      toast.success(`Welcome to Eastern AI, ${data.user.full_name.split(" ")[0]} 🎉`);
      router.replace("/dashboard");
    } catch (err) {
      const msg = err instanceof APIError ? err.message : "Could not create your account.";
      toast.error(msg);
      if (err instanceof APIError && err.status === 400 && err.detail) {
        if (typeof err.detail === "object" && err.detail !== null && "detail" in err.detail) {
          const detail = err.detail.detail as string;
          if (detail.includes("email")) setErrors({ email: "This email is already registered" });
        }
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
            {t("auth.signUpTitle")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm text-muted-foreground"
          >
            {t("auth.signUpSubtitle")}
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
            <Label htmlFor="full_name" className="group">
              {t("auth.fullName")}
              <User className="ml-1.5 h-3.5 w-3.5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" aria-hidden />
            </Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40 focus-within:text-primary transition-colors" aria-hidden />
              <Input
                id="full_name"
                name="full_name"
                required
                placeholder="Selamawit Tadesse"
                className={cn(
                  "pl-10",
                  errors.full_name && "border-destructive focus:border-destructive focus:ring-destructive/20"
                )}
                onBlur={handleBlur}
                onChange={handleChange}
                aria-invalid={errors.full_name ? "true" : "false"}
                aria-describedby={errors.full_name ? "full_name-error" : undefined}
                disabled={loading}
              />
            </div>
            {errors.full_name && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                id="full_name-error"
                className="text-sm text-destructive flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.full_name}
              </motion.p>
            )}
          </div>

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
            <Label htmlFor="country" className="group">
              {t("auth.country")}
              <Globe className="ml-1.5 h-3.5 w-3.5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" aria-hidden />
            </Label>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40 focus-within:text-primary transition-colors" aria-hidden />
              <Input
                id="country"
                name="country"
                placeholder="Ethiopia"
                className="pl-10"
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="group">
              {t("auth.password")}
              <Lock className="ml-1.5 h-3.5 w-3.5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" aria-hidden />
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40 focus-within:text-primary transition-colors" aria-hidden />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="Min. 8 characters"
                className={cn(
                  "pl-10 pr-12",
                  errors.password && "border-destructive focus:border-destructive focus:ring-destructive/20"
                )}
                onBlur={handleBlur}
                onChange={handleChange}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : "password-hint"}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Lock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-1.5"
              >
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(strength.score / 6) * 100}%` }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="h-full rounded-full transition-colors"
                    style={{ backgroundColor: strength.color.replace("text-", "bg-") }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className={cn("font-medium", strength.color)}>
                    {t("auth.passwordStrength")}: {strength.label}
                  </span>
                  <span className="text-muted-foreground/60">
                    {password.length}/8+ characters
                  </span>
                </div>
              </motion.div>
            )}

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

            {!errors.password && password && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                id="password-hint"
                className="text-xs text-muted-foreground/60 flex items-center gap-1"
              >
                <Shield className="h-3 w-3" />
                {t("auth.passwordHint")}
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
                <span>{t("auth.signUp")}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                <span>{t("auth.signUp")}</span>
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
          <Suspense fallback={null}>
            <GoogleSignInButton />
          </Suspense>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="text-center text-sm text-muted-foreground"
        >
          {t("auth.haveAccount")}{" "}
          <Link
            href="/auth/login"
            className="text-primary font-medium hover:underline transition-colors"
          >
            {t("auth.signIn")}
          </Link>
        </motion.p>
      </div>
    </AuthFormCard>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupFormFallback />}>
      <SignupFormInner />
    </Suspense>
  );
}