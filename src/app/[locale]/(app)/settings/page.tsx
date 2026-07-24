"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassModal } from "@/components/ui/GlassModal";
import { useToast } from "@/components/ui/Feedback";

interface Settings { 
  timezone: string; 
  currency: string; 
  defaultLocale: string; 
}

const CURRENCIES = [
  { code: "IQD", label: "IQD — Iraqi Dinar" },
  { code: "USD", label: "USD — US Dollar" },
  { code: "SAR", label: "SAR — Saudi Riyal" },
  { code: "AED", label: "AED — UAE Dirham" },
  { code: "KWD", label: "KWD — Kuwaiti Dinar" },
  { code: "QAR", label: "QAR — Qatari Riyal" },
  { code: "BHD", label: "BHD — Bahraini Dinar" },
  { code: "OMR", label: "OMR — Omani Rial" },
  { code: "JOD", label: "JOD — Jordanian Dinar" },
  { code: "EGP", label: "EGP — Egyptian Pound" },
  { code: "MAD", label: "MAD — Moroccan Dirham" },
  { code: "TND", label: "TND — Tunisian Dinar" },
  { code: "DZD", label: "DZD — Algerian Dinar" },
] as const;

const TIMEZONES = [
  "Asia/Riyadh", "Asia/Baghdad", "Asia/Dubai", "Asia/Kuwait", 
  "Asia/Qatar", "Asia/Bahrain", "Asia/Muscat", "Asia/Amman",
  "Africa/Cairo", "Africa/Casablanca", "Africa/Tunis", "Africa/Algiers",
  "UTC"
];

export default function SettingsPage() {
  const t = useTranslations("settings");
  const ta = useTranslations("app");
  const { notify } = useToast();
  const [s, setS] = useState<Settings | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => setS(d.settings)).catch(() => {});
  }, []);

  async function save() {
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
    notify(res.ok ? ta("save") : ta("error"), res.ok ? "success" : "error");
  }

  async function deleteAccount() {
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    try {
      const res = await fetch("/api/settings", { method: "DELETE" });
      if (res.ok) {
        notify(ta("deleted"), "success");
        setTimeout(() => window.location.href = "/login", 2000);
      } else {
        notify(ta("error"), "error");
      }
    } catch {
      notify(ta("error"), "error");
    } finally {
      setDeleting(false);
    }
  }

  if (!s) return null;
  const upd = (k: keyof Settings, v: string) => setS({ ...s, [k]: v });

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <h1 className="text-h2 text-text-primary">{t("title")}</h1>

      <GlassCard panel className="space-y-6">
        <h2 className="text-h4 font-semibold text-text-primary">{t("general")}</h2>
        <div className="space-y-4">
          <GlassInput label={t("timezone")} value={s.timezone} onChange={(e) => upd("timezone", e.target.value)} />
          
          <div>
            <label className="block text-label text-text-secondary mb-1.5">{t("currency")}</label>
            <select
              value={s.currency}
              onChange={(e) => upd("currency", e.target.value)}
              className="w-full rounded-2xl bg-surface border border-border px-4 py-2.5 text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-aura/50 appearance-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-label text-text-secondary mb-1.5">{t("language")}</label>
            <select
              value={s.defaultLocale}
              onChange={(e) => upd("defaultLocale", e.target.value)}
              className="w-full rounded-2xl bg-surface border border-border px-4 py-2.5 text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-aura/50 appearance-none"
            >
              <option value="ar">Arabic (العربية)</option>
              <option value="en">English</option>
            </select>
          </div>

          <GlassButton variant="aura" onClick={save}>{ta("save")}</GlassButton>
        </div>
      </GlassCard>

      <GlassCard panel className="space-y-6 border-rose/20">
        <h2 className="text-h4 font-semibold text-rose">{t("deleteAccount")}</h2>
        <p className="text-text-secondary">{t("deleteAccountDescription")}</p>
        <GlassButton variant="danger" onClick={() => setShowDeleteModal(true)}>
          {t("deleteAccountButton")}
        </GlassButton>
      </GlassCard>

      <GlassModal 
        open={showDeleteModal} 
        onClose={() => { setShowDeleteModal(false); setDeleteConfirm(""); }}
        title={t("deleteAccountTitle")}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">{t("deleteAccountDescription")}</p>
          <div>
            <label className="block text-label text-text-secondary mb-1.5">{t("deleteAccountConfirm")}</label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="w-full rounded-2xl bg-surface border border-border px-4 py-2.5 text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-aura/50 font-mono"
              autoComplete="off"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <GlassButton variant="ghost" onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); }}>
              {ta("cancel")}
            </GlassButton>
            <GlassButton variant="danger" onClick={deleteAccount} disabled={deleteConfirm !== "DELETE" || deleting}>
              {deleting ? ta("loading") : t("deleteAccountButton")}
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
