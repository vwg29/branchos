// Root Next.js config — MANDATORY. Without it: "Next.js cannot find app directory".
// Wired to the next-intl plugin pointing at the i18n request config.
const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep server build lean; Prisma is external on the server runtime.
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

module.exports = withNextIntl(nextConfig);
