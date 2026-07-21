import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth-admin";

export async function GET() {
  const guard = requireAdmin();
  if (!guard.ok) return guard.response;

  const items = await prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    include: { plan: true, _count: { select: { users: true, branches: true } } },
  });
  return NextResponse.json({ items });
}
