"use client";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { useToast } from "@/components/ui/Feedback";

interface Plan { id: string; slug: string; name: string; priceMonthly: number; features: string[] }

const INDUSTRIES = [
  { key: "RESTAURANT", icon: "🍽️", labelKey: "restaurant", descKey: "restaurantDesc" },
  { key: "PHARMACY", icon: "💊", labelKey: "pharmacy", descKey: "pharmacyDesc" },
  { key: "SUPERMARKET", icon: "🛒", labelKey: "supermarket", descKey: "supermarketDesc" },
  { key: "FASHION", icon: "👗", labelKey: "fashion", descKey: "fashionDesc" },
  { key: "BEAUTY", icon: "💄", labelKey: "beauty", descKey: "beautyDesc" },
  { key: "AUTO_PARTS", icon: "🔧", labelKey: "autoParts", descKey: "autoPartsDesc" },
  { key: "FURNITURE", icon: "🪑", labelKey: "furniture", descKey: "furnitureDesc" },
] as const;

const STEPS = 6;

export default function Onboarding() {
  const t = useTranslations("onboarding");
  const ti = useTranslations("industries");
  const locale = useLocale();
  const { notify } = useToast();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    company: "", slug: "", adminName: "", adminEmail: "", adminPassword: "", planSlug: "trial", industry: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    fetch("/api/plans").then((r) => r.json()).then((d) => setPlans(d.items ?? [])).catch(() => {});
  }, []);

  async function finish() {
    setBusy(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(typeof body.error === "string" ? body.error : "Registration failed");
      }
      // Sign the new owner in, then go to the dashboard.
      await signIn("credentials", {
        email: form.adminEmail,
        password: form.adminPassword,
        tenantSlug: form.slug,
        redirect: false,
      });
      router.push("/dashboard");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Error", "error");
      setBusy(false);
    }
  }

  const canNext =
    (step === 1 && form.company.length > 1 && /^[a-z0-9-]+$/.test(form.slug)) ||
    (step === 2 && form.adminName.length > 1) ||
    (step === 3 && /.+@.+/.test(form.adminEmail) && form.adminPassword.length >= 8) ||
    (step === 4 && form.industry.length > 0) ||
    step === 5 ||
    step === 6;

  return (
    <div className="bg-blobs flex min-h-screen items-center justify-center p-6">
      <GlassCard className="w-full max-w-lg animate-scale-in">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">{t("title")}</h1>
          <Link href="/" className="text-sm text-text-muted hover:text-aura transition-colors flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {t("backHome")}
          </Link>
        </div>

        <div className="mb-6 h-1.5 w-full rounded-pill bg-white/10">
          <div className="h-full rounded-pill bg-gradient-to-r from-aura to-teal-400 transition-all" style={{ width: `${(step / STEPS) * 100}%` }} />
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <>
              <GlassInput label={t("company")} value={form.company} onChange={(e) => set("company", e.target.value)} />
              <GlassInput label={t("slug")} value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase())} placeholder="acme" />
            </>
          )}
          {step === 2 && (
            <GlassInput label={t("adminName")} value={form.adminName} onChange={(e) => set("adminName", e.target.value)} />
          )}
          {step === 3 && (
            <>
              <GlassInput label={t("adminEmail")} type="email" value={form.adminEmail} onChange={(e) => set("adminEmail", e.target.value)} />
              <GlassInput label={t("adminPassword")} type="password" value={form.adminPassword} onChange={(e) => set("adminPassword", e.target.value)} showToggle />
            </>
          )}
          {step === 4 && (
            <div className="space-y-3">
              <p className="text-sm text-text-secondary">{t("selectIndustry")}</p>
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind.key}
                  onClick={() => set("industry", ind.key)}
                  className={`w-full rounded-2xl border p-4 text-start transition flex items-center gap-4 ${
                    form.industry === ind.key
                      ? "border-aura bg-aura-soft shadow-glow-aura-subtle"
                      : "border-border hover:bg-surface hover:border-border-strong"
                  }`}
                >
                  <span className="text-3xl">{ind.icon}</span>
                  <div>
                    <p className="font-semibold text-white">{ti(ind.labelKey)}</p>
                    <p className="text-sm text-text-muted">{ti(ind.descKey)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {step === 5 && (
            <div className="space-y-3">
              <p className="text-sm text-text-secondary">{t("choosePlan")}</p>
              {plans.map((p) => (
                <button
                  key={p.id}
                  onClick={() => set("planSlug", p.slug)}
                  className={`w-full rounded-2xl border p-4 text-start transition ${
                    form.planSlug === p.slug ? "border-aura bg-surface/50" : "border-border hover:bg-surface hover:border-border-strong"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{p.name}</span>
                    <span className="text-sm text-aura">{p.priceMonthly === 0 ? "Free" : (p.priceMonthly / 100).toFixed(0)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          {step === 6 && (
            <div className="space-y-2 text-sm text-text-secondary">
              <p className="text-text-muted">{t("review")}</p>
              <div className="glass-panel rounded-xl p-4">
                <p>{form.company} ({form.slug})</p>
                <p>{form.adminName} — {form.adminEmail}</p>
                <p>Industry: {ti(form.industry.toLowerCase() as keyof typeof ti)}</p>
                <p>Plan: {form.planSlug}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <GlassButton variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
            {t("back")}
          </GlassButton>
          {step < STEPS ? (
            <GlassButton variant="aura" onClick={() => setStep((s) => s + 1)} disabled={!canNext}>{t("next")}</GlassButton>
          ) : (
            <GlassButton variant="aura" onClick={finish} disabled={busy}>{busy ? t("creating") : t("finish")}</GlassButton>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
