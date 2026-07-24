"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";

type UserType = "HQ" | "BRANCH" | "AGENCY";

const USER_TYPES: { value: UserType; labelKey: string; descriptionKey: string }[] = [
  { value: "HQ", labelKey: "loginTypeHQ", descriptionKey: "loginTypeHint" },
  { value: "BRANCH", labelKey: "loginTypeBranch", descriptionKey: "loginTypeHint" },
  { value: "AGENCY", labelKey: "loginTypeBranch", descriptionKey: "loginTypeHint" },
];

export default function LoginPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<UserType>("HQ");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, userType, redirect: false });
    setLoading(false);
    if (res?.error) {
      if (res.error === "ACCOUNT_LOCKED") {
        setError("Account temporarily locked due to too many failed attempts. Try again in 15 minutes.");
      } else if (res.error === "INVALID_USER_TYPE") {
        setError("Invalid login type for this account. Please select the correct type.");
      } else if (res.error === "NO_BRANCH_ASSIGNED") {
        setError("No branch assigned to this account. Contact HQ administrator.");
      } else if (res.error === "NO_AGENCY_ASSIGNED") {
        setError("No agency assigned to this account. Contact HQ administrator.");
      } else {
        setError(t("invalid"));
      }
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="bg-blobs flex min-h-screen items-center justify-center p-6">
      <GlassCard className="w-full max-w-sm animate-scale-in">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-h3 font-bold text-text-primary">{t("loginTitle")}</h1>
          <Link href="/" className="text-sm text-text-muted hover:text-aura transition-colors flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {t("backHome")}
          </Link>
        </div>

        <div className="mb-6 p-4 rounded-xl bg-surface/50 border border-border">
          <label className="block text-label text-text-secondary mb-3">{t("loginType")}</label>
          <div className="grid grid-cols-3 gap-2">
            {USER_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setUserType(type.value)}
                className={`rounded-xl p-3 text-sm font-medium transition-all duration-fast text-start ${
                  userType === type.value
                    ? "bg-aura-soft border-aura/30 text-aura shadow-glow-aura-subtle"
                    : "bg-surface border-border text-text-secondary hover:bg-surface-hover hover:border-border-strong hover:text-text-primary"
                }`}
              >
                {t(type.labelKey)}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-text-muted text-center">{t("loginTypeHint")}</p>
        </div>

        <div className="space-y-4">
          <GlassInput label={t("email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <GlassInput label={t("password")} type="password" value={password} onChange={(e) => setPassword(e.target.value)} showToggle autoComplete="current-password" />
          {error && <p className="text-sm text-rose" role="alert">{error}</p>}
          <GlassButton variant="aura" className="w-full" onClick={submit} disabled={loading}>
            {loading ? "..." : t("signIn")}
          </GlassButton>
          <p className="text-center text-sm text-text-muted">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-aura hover:underline">{t("createAccount")}</Link>
          </p>
          <p className="text-center text-sm text-text-muted">
            <Link href="/login?forgot=true" className="text-aura hover:underline">{t("forgotPassword")}</Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
