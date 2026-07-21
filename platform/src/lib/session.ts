import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { scopedDb, type ScopedDb } from "@/lib/db/scoped";

export interface TenantContext {
  userId: string;
  tenantId: string;
  tenantSlug: string;
  permissions: string[];
  db: ScopedDb;
}

// Resolve the trusted tenant context from the NextAuth session.
// tenantId ALWAYS comes from here, never from request input.
export async function getTenantContext(): Promise<TenantContext | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.tenantId) return null;
  return {
    userId: session.user.id,
    tenantId: session.user.tenantId,
    tenantSlug: session.user.tenantSlug,
    permissions: session.user.permissions ?? [],
    db: scopedDb(session.user.tenantId),
  };
}

// Convenience guard for API routes: returns context or a 401 response.
export async function requireTenant():
  Promise<{ ok: true; ctx: TenantContext } | { ok: false; response: NextResponse }> {
  const ctx = await getTenantContext();
  if (!ctx) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true, ctx };
}

export function hasPermission(ctx: TenantContext, key: string): boolean {
  return ctx.permissions.includes(key);
}
