import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { StructuredData } from "@/components/ui/StructuredData";

export const metadata = {
  title: "AURA OS — Central Operating System for Multi-Branch Companies",
  description: "One HQ. Total visibility. Complete control. Smarter operations. Manage branches, agencies, teams, inventory, operations, and performance from one intelligent headquarters.",
  openGraph: {
    title: "AURA OS — Central Operating System for Multi-Branch Companies",
    description: "One HQ. Total visibility. Complete control. Smarter operations.",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AURA OS — Central Operating System for Multi-Branch Companies",
    description: "One HQ. Total visibility. Complete control. Smarter operations.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default async function Landing({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");
  const nav = await getTranslations("nav");

  return (
    <>
      <StructuredData />
      <div className="bg-blobs min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between p-6">
        <span className="text-xl font-bold tracking-tight text-white">AURA OS</span>
        <nav className="flex items-center gap-4 text-sm text-text-secondary">
          <Link href="/pricing" className="hover:text-text-primary transition">{nav("pricing")}</Link>
          <Link href="/about" className="hover:text-text-primary transition">{nav("about")}</Link>
          <Link href="/login" className="hover:text-text-primary transition">{nav("login")}</Link>
          <GlassButton variant="aura" asChild>
            <Link href="/register">{nav("start")}</Link>
          </GlassButton>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="mb-6 text-display text-white">
          {t("heroTitle")}
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-body-lg text-text-secondary">{t("heroSubtitle")}</p>
        <div className="flex items-center justify-center gap-3">
          <GlassButton variant="aura" size="lg" asChild>
            <Link href="/register">{t("ctaPrimary")}</Link>
          </GlassButton>
          <GlassButton variant="ghost" size="lg" asChild>
            <Link href="/pricing">{t("ctaSecondary")}</Link>
          </GlassButton>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-24 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <GlassCard key={i} panel className="animate-fade-in">
            <h3 className="mb-2 text-h4 font-semibold text-text-primary">{t(`feature${i}Title`)}</h3>
            <p className="text-body text-text-secondary">{t(`feature${i}Body`)}</p>
          </GlassCard>
        ))}
      </section>

      {/* Trust indicators / Social proof section */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-h2 text-text-primary mb-4">Trusted by Growing Companies</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Join hundreds of multi-location businesses that have centralized their operations with AURA OS.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🏢", label: "500+", desc: "Branches Managed" },
            { icon: "👥", label: "10K+", desc: "Employees Connected" },
            { icon: "📦", label: "1M+", desc: "Inventory Items Tracked" },
            { icon: "🌍", label: "12", desc: "Supported Currencies" },
          ].map((stat, i) => (
            <GlassCard key={i} panel className="text-center animate-fade-in">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-h3 font-bold text-aura">{stat.label}</div>
              <div className="text-text-secondary text-sm">{stat.desc}</div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Industry-specific section */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-h2 text-text-primary mb-4">Built for Your Industry</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Industry-specific workflows and intelligence out of the box.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🍽️", title: "Restaurants", desc: "Central kitchen, menu mgmt" },
            { icon: "💊", title: "Pharmacies", desc: "Compliance, expiry tracking" },
            { icon: "🛒", title: "Retail", desc: "Promotions, vendor mgmt" },
            { icon: "👗", title: "Fashion", desc: "Assortment, allocations" },
            { icon: "💄", title: "Beauty", desc: "Testers, trends" },
            { icon: "🔧", title: "Auto Parts", desc: "Dead stock, pricing" },
            { icon: "🪑", title: "Furniture", desc: "Logistics, custom orders" },
            { icon: "🏪", title: "Supermarkets", desc: "Seasonal, returns" },
          ].map((ind, i) => (
            <GlassCard key={i} panel className="animate-fade-in">
              <div className="text-3xl mb-2">{ind.icon}</div>
              <h3 className="font-semibold text-text-primary mb-1">{ind.title}</h3>
              <p className="text-text-secondary text-sm">{ind.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-3xl px-6 pb-24 text-center">
        <GlassCard panel className="bg-surface/50 border-aura/20">
          <h2 className="text-h2 text-text-primary mb-4">Ready to Centralize Your Operations?</h2>
          <p className="text-text-secondary mb-8 max-w-lg mx-auto">
            Start your 30-day free trial. No credit card required. Cancel anytime.
          </p>
          <GlassButton variant="aura" size="lg" asChild>
            <Link href="/register">Start Free Trial</Link>
          </GlassButton>
        </GlassCard>
      </section>
    </div>
    </>
  );
}
