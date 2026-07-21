import { setRequestLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db/prisma";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/ui/GlassCard";

export default async function Pricing({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");
  const plans = await prisma.plan.findMany({ where: { isActive: true }, orderBy: { priceMonthly: "asc" } });

  return (
    <div className="bg-blobs min-h-screen px-6 py-20">
      <h1 className="mb-12 text-center text-4xl font-bold text-white">{t("title")}</h1>
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <GlassCard key={p.id} className="flex flex-col">
            <h2 className="text-xl font-semibold text-white">{p.name}</h2>
            <p className="my-4 text-3xl font-bold text-aqua">
              {p.priceMonthly === 0 ? t("free") : (p.priceMonthly / 100).toFixed(0)}
              {p.priceMonthly > 0 && <span className="text-sm text-white/50"> {t("perMonth")}</span>}
            </p>
            <ul className="mb-6 flex-1 space-y-2 text-sm text-white/70">
              {p.features.map((f, i) => <li key={i}>• {f}</li>)}
            </ul>
            <Link href="/register" className="rounded-pill bg-gradient-to-tr from-aqua/80 to-violet/80 px-5 py-2.5 text-center font-semibold text-night">
              {t("choose")}
            </Link>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
