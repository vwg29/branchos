import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/ui/GlassCard";

export default async function Landing({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");
  const nav = await getTranslations("nav");

  return (
    <div className="bg-blobs min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between p-6">
        <span className="text-xl font-bold text-white">BranchOS</span>
        <nav className="flex items-center gap-4 text-sm text-white/80">
          <Link href="/pricing" className="hover:text-white">{nav("pricing")}</Link>
          <Link href="/about" className="hover:text-white">{nav("about")}</Link>
          <Link href="/login" className="hover:text-white">{nav("login")}</Link>
          <Link href="/register" className="rounded-pill bg-gradient-to-tr from-aqua/80 to-violet/80 px-4 py-2 font-semibold text-night">
            {nav("start")}
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="mb-6 text-5xl font-extrabold leading-tight text-white md:text-6xl">
          {t("heroTitle")}
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-white/70">{t("heroSubtitle")}</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/register" className="rounded-pill bg-gradient-to-tr from-aqua/80 to-violet/80 px-7 py-3 font-semibold text-night hover:shadow-glow">
            {t("ctaPrimary")}
          </Link>
          <Link href="/pricing" className="glass-surface rounded-pill px-7 py-3 font-medium text-white">
            {t("ctaSecondary")}
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-24 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <GlassCard key={i} className="animate-floaty" >
            <h3 className="mb-2 text-lg font-semibold text-white">{t(`feature${i}Title`)}</h3>
            <p className="text-sm text-white/70">{t(`feature${i}Body`)}</p>
          </GlassCard>
        ))}
      </section>
    </div>
  );
}
