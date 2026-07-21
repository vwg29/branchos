"use client";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { useToast } from "@/components/ui/Feedback";

interface Plan { id: string; slug: string; name: string; priceMonthly: number; features: string[] }

const STEPS = 5;

export default function Onboarding() {
  const t = useTranslations("onboarding");
  const { notify } = useToast();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    company: "", slug: "", adminName: "", adminEmail: "", adminPassword: "", planSlug: "trial",
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
    step === 4 ||
    step === 5;

  return (
    <div className="bg-blobs flex min-h-screen items-center justify-center p-6">
      <GlassCard className="w-full max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">{t("title")}</h1>
          <span className="text-sm text-white/50">{t("step")} {step} {t("of")} {STEPS}</span>
        </div>

        <div className="mb-6 h-1.5 w-full rounded-pill bg-white/10">
          <div className="h-full rounded-pill bg-gradient-to-r from-aqua to-violet transition-all" style={{ width: `${(step / STEPS) * 100}%` }} />
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
              <GlassInput label={t("adminPassword")} type="password" value={form.adminPassword} onChange={(e) => set("adminPassword", e.target.value)} />
            </>
          )}
          {step === 4 && (
            <div className="space-y-3">
              <p className="text-sm text-white/70">{t("choosePlan")}</p>
              {plans.map((p) => (
                <button
                  key={p.id}
                  onClick={() => set("planSlug", p.slug)}
                  className={`w-full rounded-2xl border p-4 text-start transition ${
                    form.planSlug === p.slug ? "border-aqua bg-white/10" : "border-white/12 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{p.name}</span>
                    <span className="text-sm text-aqua">{p.priceMonthly === 0 ? "Free" : (p.priceMonthly / 100).toFixed(0)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          {step === 5 && (
            <div className="space-y-2 text-sm text-white/80">
              <p className="text-white/60">{t("review")}</p>
              <div className="rounded-2xl bg-white/5 p-4">
                <p>{form.company} ({form.slug})</p>
                <p>{form.adminName} — {form.adminEmail}</p>
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
            <GlassButton onClick={() => setStep((s) => s + 1)} disabled={!canNext}>{t("next")}</GlassButton>
          ) : (
            <GlassButton onClick={finish} disabled={busy}>{busy ? t("creating") : t("finish")}</GlassButton>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
