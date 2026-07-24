import { NextResponse } from "next/server";
import { requireTenant, hasPermission, isHQ } from "@/lib/session";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;
  if (!hasPermission(guard.ctx, "billing:read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: guard.ctx.tenantId },
    include: { plan: true, settings: true },
  });

  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  const trialEndsAt = tenant.createdAt 
    ? new Date(tenant.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000)
    : null;
  
  const now = new Date();
  const isTrial = tenant.status === "TRIAL";
  const daysLeft = trialEndsAt ? Math.max(0, Math.ceil((trialEndsAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))) : 0;
  const trialEndingSoon = isTrial && daysLeft <= 1;

  return NextResponse.json({
    subscription: {
      status: tenant.status,
      plan: tenant.plan,
      trialEndsAt,
      daysLeft,
      trialEndingSoon,
      nextBillingDate: isTrial ? trialEndsAt : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      priceMonthly: tenant.plan?.priceMonthly || 0,
      currency: tenant.settings?.currency || "IQD",
    },
  });
}