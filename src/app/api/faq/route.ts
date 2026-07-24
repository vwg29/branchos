import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenant, hasPermission, isHQ } from "@/lib/session";
import { prisma } from "@/lib/db/prisma";

const faqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(10),
  category: z.string().default("general"),
  order: z.number().default(0),
  isPublished: z.boolean().default(true),
});

export async function GET() {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;
  
  if (!hasPermission(guard.ctx, "faq:read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const items = await prisma.fAQ.findMany({
    where: { tenantId: guard.ctx.tenantId },
    orderBy: [{ category: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;
  
  if (!isHQ(guard.ctx)) {
    return NextResponse.json({ error: "Only HQ can manage FAQs" }, { status: 403 });
  }
  
  if (!hasPermission(guard.ctx, "faq:write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = faqSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const item = await prisma.fAQ.create({
    data: {
      tenantId: guard.ctx.tenantId,
      ...parsed.data,
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}