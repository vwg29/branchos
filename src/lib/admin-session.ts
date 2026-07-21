import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

// Platform-admin session: an HMAC-signed cookie, signed with PLATFORM_ADMIN_SECRET.
// Deliberately shares NOTHING with NextAuth (different secret, different cookie).
const COOKIE = "branchos_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret(): string {
  const s = process.env.PLATFORM_ADMIN_SECRET;
  if (!s) throw new Error("PLATFORM_ADMIN_SECRET is not set");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export interface AdminSession {
  adminId: string;
  email: string;
  exp: number;
}

export function createAdminToken(session: Omit<AdminSession, "exp">): string {
  const body: AdminSession = { ...session, exp: Date.now() + MAX_AGE * 1000 };
  const payload = Buffer.from(JSON.stringify(body)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as AdminSession;
    if (session.exp < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export function setAdminCookie(token: string): void {
  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearAdminCookie(): void {
  cookies().delete(COOKIE);
}

export function readAdminSession(): AdminSession | null {
  return verifyAdminToken(cookies().get(COOKIE)?.value);
}

export const ADMIN_COOKIE_NAME = COOKIE;
