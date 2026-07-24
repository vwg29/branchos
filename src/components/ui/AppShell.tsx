"use client";
import { type ReactNode } from "react";
import { signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { GlassButton } from "./GlassButton";

const NAV = [
  "dashboard", "branches", "agencies", "regions", "employees", "roles",
  "tasks", "announcements", "performance", "documents", "billing", "subscription",
  "communications", "settings",
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const t = useTranslations("app");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="bg-blobs flex min-h-screen layer-1">
      <aside className="glass-panel sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-1 rounded-none p-4 md:flex layer-2">
        <div className="mb-6 px-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-aura-soft flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00F5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">AURA OS</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname === `/${item}` || pathname.startsWith(`/${item}/`);
            return (
              <Link
                key={item}
                href={`/${item}`}
                className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-fast ${
                  active 
                    ? "bg-aura-soft text-aura shadow-glow-aura-subtle" 
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                }`}
              >
                {t(item)}
              </Link>
            );
          })}
        </nav>
        <GlassButton 
          variant="ghost" 
          className="w-full justify-start"
          onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {t("logout")}
        </GlassButton>
      </aside>
      <main className="flex-1 p-4 md:p-8 layer-3">{children}</main>
    </div>
  );
}
