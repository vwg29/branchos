import { getTranslations } from "next-intl/server";
import { getTenantContext } from "@/lib/session";
import { GlassCard } from "@/components/ui/GlassCard";

export default async function Dashboard() {
  const t = await getTranslations("app");
  const ctx = await getTenantContext();
  if (!ctx) return null;

  const [branches, agencies, employees, tasks, announcements] = await Promise.all([
    ctx.db.branches.count(),
    ctx.db.agencies.count(),
    ctx.db.employees.count(),
    ctx.db.tasks.count(),
    ctx.db.announcements.count(),
  ]);

  const cards = [
    { label: t("branches"), value: branches },
    { label: t("agencies"), value: agencies },
    { label: t("employees"), value: employees },
    { label: t("tasks"), value: tasks },
    { label: t("announcements"), value: announcements },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">{t("dashboard")}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <GlassCard key={c.label}>
            <p className="text-sm text-white/60">{c.label}</p>
            <p className="mt-2 text-4xl font-bold text-white">{c.value}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
