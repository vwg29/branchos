import { setRequestLocale, getTranslations } from "next-intl/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { Link } from "@/i18n/navigation";

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const nav = await getTranslations("nav");
  return (
    <div className="bg-blobs min-h-screen px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <GlassCard panel className="text-center animate-fade-in">
          <div className="mb-6 inline-flex items-center justify-center h-16 w-16 rounded-xl bg-aura-soft">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00F5A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <h1 className="mb-4 text-h2 text-white">{t("title")}</h1>
          <p className="mb-8 text-body-lg text-text-secondary">{t("body")}</p>
          <GlassButton variant="aura" asChild>
            <Link href="/register">{nav("start")}</Link>
          </GlassButton>
        </GlassCard>
      </div>
    </div>
  );
}
