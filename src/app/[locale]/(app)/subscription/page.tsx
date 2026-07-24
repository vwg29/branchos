"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { useToast } from "@/components/ui/Feedback";

interface Subscription {
  status: string;
  plan: { name: string; priceMonthly: number; features: string[] } | null;
  trialEndsAt: string | null;
  daysLeft: number;
  trialEndingSoon: boolean;
  nextBillingDate: string | null;
  priceMonthly: number;
  currency: string;
}

export default function SubscriptionPage() {
  const t = useTranslations("subscription");
  const { notify } = useToast();
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  async function loadSubscription() {
    try {
      const res = await fetch("/api/subscription");
      const data = await res.json();
      setSub(data.subscription);
    } catch {
      notify("Failed to load", "error");
    } finally {
      setLoading(false);
    }
  }

  function formatPrice(price: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency === "IQD" ? "IQD" : currency,
      minimumFractionDigits: 0,
    }).format(price / 100);
  }

  if (loading) return <div>Loading...</div>;
  if (!sub) return <div>No subscription data</div>;

  const isTrial = sub.status === "TRIAL";

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <h1 className="text-h2 text-text-primary">{t("title")}</h1>

      {sub.trialEndingSoon && (
        <GlassCard panel className="border-aura/30 bg-aura-soft/20">
          <div className="flex items-center gap-3 text-aura">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="font-medium">{t("trialEndingSoon")}</span>
          </div>
        </GlassCard>
      )}

      <GlassCard panel className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-label text-text-muted">{t("currentPlan")}</p>
            <p className="text-h4 font-bold text-text-primary">{sub.plan?.name || "Trial"}</p>
          </div>
          <div className="text-right">
            <p className="text-label text-text-muted">{t("price")}</p>
            <p className="text-metric text-text-primary">
              {sub.priceMonthly === 0 ? t("freeTrial") : formatPrice(sub.priceMonthly, sub.currency) + <span className="text-metric-sm text-text-muted"> {t("monthly")}</span>}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-label text-text-muted">{isTrial ? t("trialEnds") : t("nextBilling")}</p>
            <p className="font-medium text-text-primary">
              {sub.trialEndsAt ? new Date(sub.trialEndsAt).toLocaleDateString() : sub.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString() : "-"}
            </p>
          </div>
          {isTrial && (
            <div>
              <p className="text-label text-text-muted">{t("trialDaysLeft")}</p>
              <p className="font-bold text-2xl text-aura">{sub.daysLeft}</p>
            </div>
          )}
        </div>

        {sub.plan?.features && sub.plan.features.length > 0 && (
          <div className="pt-4 border-t border-border">
            <p className="text-label text-text-muted mb-2">{t("planFeatures")}</p>
            <ul className="space-y-1 text-sm text-text-secondary">
              {sub.plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">✓ {f}</li>
              ))}
            </ul>
          </div>
        )}
      </GlassCard>

      {isTrial && (
        <GlassCard panel>
          <p className="text-text-secondary mb-4">
            Your 30-day free trial ends on {sub.trialEndsAt ? new Date(sub.trialEndsAt).toLocaleDateString() : "soon"}. 
            After that, your subscription will automatically continue at {formatPrice(sub.priceMonthly, sub.currency)}/month.
            You'll receive a reminder 1 day before billing.
          </p>
        </GlassCard>
      )}

      <GlassCard panel>
        <h2 className="text-h4 font-semibold text-text-primary mb-4">{t("billingHistory")}</h2>
        <p className="text-text-secondary">Invoice history will appear here after your first payment.</p>
      </GlassCard>
    </div>
  );
}