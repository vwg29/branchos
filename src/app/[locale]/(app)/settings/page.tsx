"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { useToast } from "@/components/ui/Feedback";

interface Settings { timezone: string; currency: string; defaultLocale: string; brandColor: string }

export default function SettingsPage() {
  const t = useTranslations("app");
  const { notify } = useToast();
  const [s, setS] = useState<Settings | null>(null);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => setS(d.settings)).catch(() => {});
  }, []);

  async function save() {
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
    notify(res.ok ? t("save") : t("error"), res.ok ? "success" : "error");
  }

  if (!s) return null;
  const upd = (k: keyof Settings, v: string) => setS({ ...s, [k]: v });

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-white">{t("settings")}</h1>
      <GlassCard className="space-y-4">
        <GlassInput label="Timezone" value={s.timezone} onChange={(e) => upd("timezone", e.target.value)} />
        <GlassInput label="Currency" value={s.currency} onChange={(e) => upd("currency", e.target.value)} />
        <GlassInput label="Brand color" value={s.brandColor} onChange={(e) => upd("brandColor", e.target.value)} />
        <GlassButton onClick={save}>{t("save")}</GlassButton>
      </GlassCard>
    </div>
  );
}
