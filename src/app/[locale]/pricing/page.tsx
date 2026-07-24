import { setRequestLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db/prisma";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

export default async function Pricing({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");
  
  let plans: any[] = [];
  try {
    plans = await prisma.plan.findMany({ where: { isActive: true }, orderBy: { priceMonthly: "asc" } });
  } catch {
    plans = [
      { id: "trial", name: "Trial", priceMonthly: 0, features: ["Up to 2 branches", "Up to 10 employees", "Core modules"] },
      { id: "basic", name: "Basic", priceMonthly: 9900, features: ["Up to 10 branches", "Up to 100 employees", "Performance metrics", "Documents"] },
      { id: "pro", name: "Pro", priceMonthly: 29900, features: ["Unlimited branches", "Advanced roles", "Priority support", "All modules"] },
    ];
  }

  return (
    <div className="bg-blobs min-h-screen px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <header className="mb-16 text-center">
          <h1 className="mb-4 text-display text-white">{t("title")}</h1>
          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
            Start free for 30 days. No credit card required. $100/month after trial.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <GlassCard key={p.id} panel className="flex flex-col animate-fade-in">
              <h2 className="mb-2 text-h4 font-semibold text-text-primary">{p.name}</h2>
              <p className="mb-6 text-metric text-white">
                {p.priceMonthly === 0 ? t("free") : (p.priceMonthly / 100).toFixed(0)}
                {p.priceMonthly > 0 && <span className="text-metric-sm text-text-secondary"> {t("perMonth")}</span>}
              </p>
              <ul className="mb-6 flex-1 space-y-2 text-sm text-text-secondary">
                {p.features.map((f: string, i: number) => <li key={i} className="flex items-center gap-2">• {f}</li>)}
              </ul>
              <GlassButton variant={p.priceMonthly === 0 ? "secondary" : "aura"} className="w-full" asChild>
                <Link href="/register">{t("choose")}</Link>
              </GlassButton>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
