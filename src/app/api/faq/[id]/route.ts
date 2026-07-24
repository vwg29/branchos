import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenant, hasPermission, isHQ } from "@/lib/session";
import { prisma } from "@/lib/db/prisma";

const faqSchema = z.object({
  question: z.string().min(5).optional(),
  answer: z.string().min(10).optional(),
  category: z.string().optional(),
  order: z.number().optional(),
  isPublished: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;
  
  if (!isHQ(guard.ctx)) {
    return NextResponse.json({ error: "Only HQ can manage FAQs" }, { status: 403 });
  }
  
  if (!hasPermission(guard.ctx, "faq:write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const parsed = faqSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.fAQ.findFirst({
    where: { id, tenantId: guard.ctx.tenantId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const item = await prisma.fAQ.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ item });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;
  
  if (!isHQ(guard.ctx)) {
    return NextResponse.json({ error: "Only HQ can manage FAQs" }, { status: 403 });
  }
  
  if (!hasPermission(guard.ctx, "faq:write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const existing = await prisma.fAQ.findFirst({
    where: { id, tenantId: guard.ctx.tenantId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.fAQ.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}