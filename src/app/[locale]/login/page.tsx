"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";

export default function LoginPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) setError(t("invalid"));
    else router.push("/dashboard");
  }

  return (
    <div className="bg-blobs flex min-h-screen items-center justify-center p-6">
      <GlassCard className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-bold text-white">{t("loginTitle")}</h1>
        <div className="space-y-4">
          <GlassInput label={t("email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <GlassInput label={t("password")} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-sm text-rose">{error}</p>}
          <GlassButton className="w-full" onClick={submit} disabled={loading}>
            {loading ? "..." : t("signIn")}
          </GlassButton>
          <p className="text-center text-sm text-white/60">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-aqua hover:underline">{t("createAccount")}</Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
