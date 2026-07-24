import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { SUPPORTED_LOCALES, type Locale } from "@/i18n/routing";
import { Providers } from "@/components/Providers";
import "../globals.css";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export const metadata = {
  title: {
    default: "AURA OS — Central Operating System for Multi-Branch Companies",
    template: "%s | AURA OS",
  },
  description: "AURA OS is the central operating system for companies that manage branches, agencies, teams, inventory, operations, and performance from one intelligent headquarters. One HQ. Total visibility. Complete control. Smarter operations.",
  keywords: [
    "multi-branch management",
    "branch management software",
    "franchise management system",
    "HQ management platform",
    "multi-location business software",
    "centralized business operations",
    "branch performance management",
    "enterprise branch management",
    "agency management system",
    "inventory management",
    "restaurant chain management",
    "pharmacy chain management",
    "retail chain management",
    "fashion retail management",
    "beauty salon management",
    "auto parts management",
    "furniture store management",
  ],
  authors: [{ name: "AURA OS" }],
  creator: "AURA OS",
  publisher: "AURA OS",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aura-os.app",
    siteName: "AURA OS",
    title: "AURA OS — Central Operating System for Multi-Branch Companies",
    description: "One HQ. Total visibility. Complete control. Smarter operations. Manage branches, agencies, teams, inventory, operations, and performance from one intelligent headquarters.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AURA OS - Central Operating System for Multi-Branch Companies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aura_os",
    creator: "@aura_os",
    title: "AURA OS — Central Operating System for Multi-Branch Companies",
    description: "One HQ. Total visibility. Complete control. Smarter operations.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as Locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
