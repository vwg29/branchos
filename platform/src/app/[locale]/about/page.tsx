import { setRequestLocale, getTranslations } from "next-intl/server";
import { GlassCard } from "@/components/ui/GlassCard";

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  return (
    <div className="bg-blobs flex min-h-screen items-center justify-center p-6">
      <GlassCard className="max-w-xl text-center">
        <h1 className="mb-4 text-3xl font-bold text-white">{t("title")}</h1>
        <p className="text-white/70">{t("body")}</p>
      </GlassCard>
    </div>
  );
}
