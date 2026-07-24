import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenant, hasPermission, isHQ } from "@/lib/session";

const createSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  category: z.enum(["GENERAL", "COMPLAINT", "ISSUE", "REQUEST", "ANNOUNCEMENT"]).default("GENERAL"),
  toUserId: z.string().optional(),
  toBranchId: z.string().optional(),
  toAgencyId: z.string().optional(),
});

export async function GET() {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;
  if (!hasPermission(guard.ctx, "communication:read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL("");
  const status = searchParams.get("status");
  const category = searchParams.get("category");

  let items;
  if (isHQ(guard.ctx)) {
    items = await guard.ctx.db.communication.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(category ? { category } : {}),
      },
      include: { fromUser: true, toUser: true, toBranch: true, toAgency: true },
      orderBy: { createdAt: "desc" },
    });
  } else {
    // Branch/Agency users only see messages sent to them
    items = await guard.ctx.db.communication.findMany({
      where: {
        OR: [
          { toUserId: guard.ctx.userId },
          ...(guard.ctx.branchId ? [{ toBranchId: guard.ctx.branchId }] : []),
          ...(guard.ctx.agencyId ? [{ toAgencyId: guard.ctx.agencyId }] : []),
        ],
        ...(status ? { status } : {}),
        ...(category ? { category } : {}),
      },
      include: { fromUser: true, toBranch: true, toAgency: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;
  if (!hasPermission(guard.ctx, "communication:write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  
  // Validate that at least one recipient is specified for non-announcements
  if (data.category !== "ANNOUNCEMENT" && !data.toUserId && !data.toBranchId && !data.toAgencyId) {
    return NextResponse.json({ error: "At least one recipient required" }, { status: 400 });
  }

  const item = await guard.ctx.db.communication.create({
    data: {
      fromUserId: guard.ctx.userId,
      ...data,
    },
    include: { fromUser: true, toUser: true, toBranch: true, toAgency: true },
  });

  // Create notification for recipients
  if (data.toUserId) {
    await guard.ctx.db.notification.create({
      data: {
        userId: data.toUserId,
        message: `New ${data.category.toLowerCase()}: ${data.subject}`,
      },
    });
  }

  return NextResponse.json({ item }, { status: 201 });
}