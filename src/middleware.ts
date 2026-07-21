import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { intlMiddleware } from "@/i18n/middleware";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/i18n/routing";
import { rateLimit, clientKey } from "@/lib/rate-limit";

// Locale-prefixed segments that require an authenticated tenant session.
// These live under the (app) route group, which does not appear in the URL,
// so we match the underlying page paths directly.
const PROTECTED = [
  "dashboard", "branches", "agencies", "regions", "employees", "roles",
  "tasks", "announcements", "performance", "documents", "settings", "billing",
];

function localeAndRest(pathname: string): { locale: string; rest: string } {
  const [, maybeLocale, ...segments] = pathname.split("/");
  if (SUPPORTED_LOCALES.includes(maybeLocale as (typeof SUPPORTED_LOCALES)[number])) {
    return { locale: maybeLocale, rest: segments.join("/") };
  }
  return { locale: DEFAULT_LOCALE, rest: pathname.replace(/^\//, "") };
}

function securityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return res;
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rate limit auth + write-heavy API paths.
  if (pathname.startsWith("/api/")) {
    const limited = pathname.includes("/auth/") ? 20 : 120;
    const result = rateLimit(clientKey(req, pathname), limited);
    if (!result.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    return securityHeaders(NextResponse.next());
  }

  // i18n handles locale routing/redirects for pages.
  const intlResponse = intlMiddleware(req);

  // Auth guard for protected app pages.
  const { locale, rest } = localeAndRest(pathname);
  const firstSegment = rest.split("/")[0];
  if (PROTECTED.includes(firstSegment)) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      url.searchParams.set("from", pathname);
      return securityHeaders(NextResponse.redirect(url));
    }
  }

  return securityHeaders(intlResponse);
}

export const config = {
  // Run on everything except static assets and Next internals.
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
