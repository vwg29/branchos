"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmptyState } from "@/components/ui/Feedback";

interface Invoice { id: string; number: string; amount: number; status: string; period: string }
interface Plan { name: string; priceMonthly: number }

export default function BillingPage() {
  const t = useTranslations("app");
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    fetch("/api/billing").then((r) => r.json()).then((d) => {
      setInvoices(d.items ?? []);
      setPlan(d.plan ?? null);
      setStatus(d.status ?? "");
    }).catch(() => setInvoices([]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">{t("billing")}</h1>
      <GlassCard>
        <p className="text-sm text-white/60">Current plan</p>
        <p className="mt-1 text-2xl font-bold text-white">
          {plan?.name ?? "-"} <span className="text-sm font-normal text-white/50">({status})</span>
        </p>
      </GlassCard>

      {invoices === null ? null : invoices.length === 0 ? (
        <EmptyState title={t("empty")} hint={t("emptyHint")} />
      ) : (
        <GlassCard className="overflow-x-auto p-0">
          <table className="w-full text-start text-sm">
            <thead className="text-white/60">
              <tr><th className="px-4 py-3 text-start">#</th><th className="px-4 py-3 text-start">Amount</th><th className="px-4 py-3 text-start">Status</th><th className="px-4 py-3 text-start">Period</th></tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-white/8 text-white/90">
                  <td className="px-4 py-3">{inv.number}</td>
                  <td className="px-4 py-3">{(inv.amount / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">{inv.status}</td>
                  <td className="px-4 py-3">{inv.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}
    </div>
  );
}
