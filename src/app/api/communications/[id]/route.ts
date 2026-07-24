import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenant, hasPermission, isHQ, canAccessBranch, canAccessAgency } from "@/lib/session";

const updateSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  body: z.string().optional(), // For replies
  category: z.enum(["GENERAL", "COMPLAINT", "ISSUE", "REQUEST", "ANNOUNCEMENT"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;
  if (!hasPermission(guard.ctx, "communication:write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Check access
  const existing = await guard.ctx.db.communication.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Check if user can access this communication
  let canAccess = false;
  if (isHQ(guard.ctx)) {
    canAccess = true;
  } else if (existing.toUserId === guard.ctx.userId) {
    canAccess = true;
  } else if (existing.toBranchId && canAccessBranch(guard.ctx, existing.toBranchId)) {
    canAccess = true;
  } else if (existing.toAgencyId && canAccessAgency(guard.ctx, existing.toAgencyId)) {
    canAccess = true;
  }

  if (!canAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updateData = parsed.data;
  if (updateData.status === "RESOLVED" || updateData.status === "CLOSED") {
    updateData.resolvedAt = new Date();
  }

  const item = await guard.ctx.db.communication.update({
    where: { id },
    data: updateData,
    include: { fromUser: true, toUser: true, toBranch: true, toAgency: true },
  });

  // Notify sender if status changed
  if (updateData.status && updateData.status !== existing.status && existing.fromUserId) {
    await guard.ctx.db.notification.create({
      data: {
        userId: existing.fromUserId,
        message: `Your ${existing.category.toLowerCase()} "${existing.subject}" was marked as ${updateData.status.toLowerCase()}`,
      },
    });
  }

  return NextResponse.json({ item });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;
  
  // Only HQ can delete communications
  if (!isHQ(guard.ctx)) {
    return NextResponse.json({ error: "Only HQ can delete communications" }, { status: 403 });
  }

  const { id } = await params;
  await guard.ctx.db.communication.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}