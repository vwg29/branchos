"use client";

export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://aura-os.app/#organization",
        "name": "AURA OS",
        "url": "https://aura-os.app",
        "logo": {
          "@type": "ImageObject",
          "url": "https://aura-os.app/logo.png",
          "width": 512,
          "height": 512,
        },
        "sameAs": [
          "https://twitter.com/aura_os",
          "https://linkedin.com/company/aura-os",
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-800-AURA-OS",
          "contactType": "customer service",
          "availableLanguage": ["English", "Arabic"],
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://aura-os.app/#software",
        "name": "AURA OS",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Cloud",
        "offers": {
          "@type": "Offer",
          "price": "100",
          "priceCurrency": "USD",
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": 100,
            "priceCurrency": "USD",
            "billingDuration": "P1M",
          },
        },
        "description": "AURA OS is the central operating system for companies that manage branches, agencies, teams, inventory, operations, and performance from one intelligent headquarters.",
        "featureList": [
          "Multi-branch management",
          "Role-based permissions",
          "Real-time performance metrics",
          "Industry-specific workflows",
          "Inventory transfer between branches",
          "Centralized pricing control",
          "Arabic/English bilingual support",
        ],
        "screenshot": "https://aura-os.app/screenshot.png",
        "url": "https://aura-os.app",
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is AURA OS?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AURA OS is the central operating system for companies that manage multiple branches, agencies, teams, inventory, operations, and performance from one intelligent headquarters.",
            },
          },
          {
            "@type": "Question",
            "name": "Can I manage multiple branches?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. AURA OS is built specifically for multi-branch management. HQ can create unlimited branches (based on plan), assign managers, and control permissions.",
            },
          },
          {
            "@type": "Question",
            "name": "Is there a free trial?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Your first month is completely free. After that, it's $100/month billed automatically. You'll receive a reminder 1 day before billing.",
            },
          },
          {
            "@type": "Question",
            "name": "Can I change currency?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. IQD (Iraqi Dinar) is the default, with 12 major Arab currencies supported including USD, SAR, AED, KWD, QAR, BHD, OMR, JOD, EGP, MAD, TND, DZD.",
            },
          },
          {
            "@type": "Question",
            "name": "Can I use Arabic and English?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. AURA OS is fully bilingual with RTL support for Arabic and LTR for English. Switch languages instantly from the header.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}