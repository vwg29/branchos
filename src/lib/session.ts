import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { scopedDb, type ScopedDb } from "@/lib/db/scoped";

export type UserType = "HQ" | "BRANCH" | "AGENCY";

export interface TenantContext {
  userId: string;
  tenantId: string;
  tenantSlug: string;
  userType: UserType;
  branchId?: string;
  agencyId?: string;
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
    userType: session.user.userType ?? "HQ",
    branchId: session.user.branchId,
    agencyId: session.user.agencyId,
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

// Check if user is HQ (full access)
export function isHQ(ctx: TenantContext): boolean {
  return ctx.userType === "HQ";
}

// Check if user is a branch user
export function isBranch(ctx: TenantContext): boolean {
  return ctx.userType === "BRANCH";
}

// Check if user is an agency user
export function isAgency(ctx: TenantContext): boolean {
  return ctx.userType === "AGENCY";
}

// Check if user has permission (HQ always has all permissions)
export function hasPermission(ctx: TenantContext, key: string): boolean {
  if (ctx.userType === "HQ") return true;
  return ctx.permissions.includes(key);
}

// Check if user can access a specific branch (HQ can access all, branch users only their own)
export function canAccessBranch(ctx: TenantContext, branchId: string): boolean {
  if (ctx.userType === "HQ") return true;
  if (ctx.userType === "BRANCH") return ctx.branchId === branchId;
  return false;
}

// Check if user can access a specific agency (HQ can access all, agency users only their own)
export function canAccessAgency(ctx: TenantContext, agencyId: string): boolean {
  if (ctx.userType === "HQ") return true;
  if (ctx.userType === "AGENCY") return ctx.agencyId === agencyId;
  return false;
}
