import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth-admin";

export async function GET() {
  const guard = requireAdmin();
  if (!guard.ok) return guard.response;
  const items = await prisma.plan.findMany({ orderBy: { priceMonthly: "asc" } });
  return NextResponse.json({ items });
}

const schema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  priceMonthly: z.number().int().min(0),
  maxBranches: z.number().int().min(1),
  maxEmployees: z.number().int().min(1),
});

export async function POST(req: Request) {
  const guard = requireAdmin();
  if (!guard.ok) return guard.response;

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const plan = await prisma.plan.create({ data: parsed.data });
  return NextResponse.json({ plan });
}
