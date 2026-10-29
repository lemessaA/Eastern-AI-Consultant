"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Mail, CheckCircle2, AlertCircle, RotateCcw, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { AuthFormCard } from "@/components/auth/auth-form-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/use-translation";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

function ForgotPasswordFormFallback() {
  const { t } = useTranslation();
  return (
    <AuthFormCard>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight">{t("auth.resetPassword")}</h1>
          <p className="text-sm text-muted-foreground">{t("auth.resetPasswordSubtitle")}</p>
        </div>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-label="Loading" />
        </div>
      </div>
    </AuthFormCard>
  );
}

function ForgotPasswordFormInner() {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const validateEmail = (value: string) => {
    if (!value.trim()) return t("auth.emailRequired");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t("auth.emailInvalid");
    return "";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateEmail(value) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmail(value);
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateEmail(value) }));
    }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ email: true });
    const error = validateEmail(email);
    if (error) {
      setErrors({ email: error });
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      await api.post("/auth/password/forgot", { email }, { auth: false });
      setSent(true);
      toast.success(t("auth.resetEmailSent"));
    } catch {
      toast.error(t("auth.resetEmailFailed"));
    } finally {
      setLoading(false);
    }
  }

  async function onResend(e: React.MouseEvent) {
    e.preventDefault();
    const error = validateEmail(email);
    if (error) {
      setErrors({ email: error });
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      await api.post("/auth/password/forgot", { email }, { auth: false });
      toast.success(t("auth.resetEmailResent"));
    } catch {
      toast.error(t("auth.resetEmailFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFormCard>
      <div className="space-y-6">
        {!sent ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-2 text-center"
            >
              <h1 className="font-display text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                {t("auth.resetPassword")}
              </h1>
              <p className="text-sm text-muted-foreground">{t("auth.resetPasswordSubtitle")}</p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
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
                    value={email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={cn(
                      "pl-10",
                      errors.email && "border-destructive focus:border-destructive focus:ring-destructive/20"
                    )}
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
                    <span>{t("auth.sending")}</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" aria-hidden />
                    <span>{t("auth.sendResetLink")}</span>
                  </>
                )}
              </motion.button>
            </motion.form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 text-center"
          >
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold">{t("auth.checkYourInbox")}</h2>
              <p className="text-muted-foreground">{t("auth.checkInboxSubtitle")}</p>
            </div>

            <div className="rounded-lg border border-success/40 bg-success/5 p-4 text-sm text-success">
              <p className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                {t("auth.checkSpamFolder")}
              </p>
            </div>

            <div className="pt-4">
              <p className="text-xs text-muted-foreground/60 mb-4">{t("auth.noEmailYet")}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={onResend}
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t("auth.resending")}</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4" />
                    <span>{t("auth.resendEmail")}</span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: sent ? 0.4 : 0.5 }}
          className="text-center text-sm text-muted-foreground flex items-center justify-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <Link href="/auth/login" className="text-primary font-medium hover:underline transition-colors">
            {t("auth.backToSignIn")}
          </Link>
        </motion.p>
      </div>
    </AuthFormCard>
  );
}

import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  return (
    <React.Suspense fallback={<ForgotPasswordFormFallback />}>
      <ForgotPasswordFormInner />
    </React.Suspense>
  );
}