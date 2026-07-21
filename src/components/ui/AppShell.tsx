"use client";
import { type ReactNode } from "react";
import { signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const NAV = [
  "dashboard", "branches", "agencies", "regions", "employees", "roles",
  "tasks", "announcements", "performance", "documents", "billing", "settings",
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const t = useTranslations("app");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="bg-blobs flex min-h-screen">
      <aside className="glass-surface sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-1 rounded-none p-4 md:flex">
        <div className="mb-4 px-2 text-xl font-bold tracking-tight text-white">BranchOS</div>
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname === `/${item}` || pathname.startsWith(`/${item}`);
            return (
              <Link
                key={item}
                href={`/${item}`}
                className={`block rounded-2xl px-3 py-2 text-sm transition ${
                  active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10"
                }`}
              >
                {t(item)}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
          className="rounded-2xl px-3 py-2 text-start text-sm text-rose hover:bg-white/10"
        >
          {t("logout")}
        </button>
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
