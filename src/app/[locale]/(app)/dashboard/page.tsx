import { getTranslations } from "next-intl/server";
import { getTenantContext } from "@/lib/session";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { Link } from "@/i18n/navigation";

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
    { label: t("branches"), value: branches, icon: "branch" },
    { label: t("agencies"), value: agencies, icon: "agency" },
    { label: t("employees"), value: employees, icon: "employee" },
    { label: t("tasks"), value: tasks, icon: "task" },
    { label: t("announcements"), value: announcements, icon: "announcement" },
  ];

  function Icon({ name }: { name: string }) {
    const icons: Record<string, React.ReactNode> = {
      branch: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
      agency: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
      employee: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
      task: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" /></svg>,
      announcement: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
    };
    return <span className="text-aura">{icons[name]}</span>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-h2 text-text-primary">{t("dashboard")}</h1>
        <GlassButton variant="ghost" asChild>
          <Link href="/dashboard/customize">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Customize
          </Link>
        </GlassButton>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((c) => (
          <GlassCard key={c.label} panel className="group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-label text-text-muted">{c.label}</p>
                <p className="mt-1 text-metric text-text-primary">{c.value}</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name={c.icon} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
