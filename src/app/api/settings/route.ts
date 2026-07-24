import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenant, hasPermission, isHQ } from "@/lib/session";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;
  if (!hasPermission(guard.ctx, "settings:read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const settings = await guard.ctx.db.settings.get();
  return NextResponse.json({ settings });
}

const schema = z.object({
  timezone: z.string().optional(),
  currency: z.string().optional(),
  defaultLocale: z.enum(["ar", "en"]).optional(),
});

export async function PATCH(req: Request) {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;
  if (!hasPermission(guard.ctx, "settings:write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const settings = await guard.ctx.db.settings.upsert(parsed.data);
  return NextResponse.json({ settings });
}

// Only HQ owner can delete the entire tenant account
export async function DELETE() {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;
  
  // Only HQ can delete account
  if (!isHQ(guard.ctx)) {
    return NextResponse.json({ error: "Only HQ can delete the account" }, { status: 403 });
  }
  
  if (!hasPermission(guard.ctx, "settings:write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Delete all tenant data (cascades should handle most, but we do it explicitly)
    await prisma.$transaction([
      prisma.user.deleteMany({ where: { tenantId: guard.ctx.tenantId } }),
      prisma.branch.deleteMany({ where: { tenantId: guard.ctx.tenantId } }),
      prisma.agency.deleteMany({ where: { tenantId: guard.ctx.tenantId } }),
      prisma.employee.deleteMany({ where: { tenantId: guard.ctx.tenantId } }),
      prisma.role.deleteMany({ where: { tenantId: guard.ctx.tenantId } }),
      prisma.region.deleteMany({ where: { tenantId: guard.ctx.tenantId } }),
      prisma.task.deleteMany({ where: { tenantId: guard.ctx.tenantId } }),
      prisma.announcement.deleteMany({ where: { tenantId: guard.ctx.tenantId } }),
      prisma.performanceMetric.deleteMany({ where: { tenantId: guard.ctx.tenantId } }),
      prisma.document.deleteMany({ where: { tenantId: guard.ctx.tenantId } }),
      prisma.invoice.deleteMany({ where: { tenantId: guard.ctx.tenantId } }),
      prisma.notification.deleteMany({ where: { tenantId: guard.ctx.tenantId } }),
      prisma.communication.deleteMany({ where: { tenantId: guard.ctx.tenantId } }),
      prisma.fAQ.deleteMany({ where: { tenantId: guard.ctx.tenantId } }),
      prisma.tenantSettings.deleteMany({ where: { tenantId: guard.ctx.tenantId } }),
      prisma.tenant.delete({ where: { id: guard.ctx.tenantId } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
