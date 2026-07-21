import { NextResponse } from "next/server";
import { requireTenant, hasPermission } from "@/lib/session";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;
  if (!hasPermission(guard.ctx, "billing:read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const [items, tenant] = await Promise.all([
    guard.ctx.db.billing.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.tenant.findUnique({ where: { id: guard.ctx.tenantId }, include: { plan: true } }),
  ]);
  return NextResponse.json({ items, plan: tenant?.plan ?? null, status: tenant?.status });
}
