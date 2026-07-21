import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/session";

export async function GET() {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;
  const items = await guard.ctx.db.notifications.findMany({
    where: { userId: guard.ctx.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ items });
}

export async function PATCH(req: Request) {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await guard.ctx.db.notifications.markRead(id);
  return NextResponse.json({ ok: true });
}
