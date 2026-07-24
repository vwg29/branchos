import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenant } from "@/lib/session";
import { prisma } from "@/lib/db/prisma";

const layoutSchema = z.object({
  layout: z.array(z.object({
    id: z.string(),
    type: z.string(),
    position: z.object({
      x: z.number(),
      y: z.number(),
      w: z.number(),
      h: z.number(),
    }),
    config: z.record(z.unknown()).optional(),
  })),
});

export async function GET() {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;

  const layout = await prisma.dashboardLayout.findUnique({
    where: { userId: guard.ctx.userId },
  });

  return NextResponse.json({ 
    layout: layout?.layout || getDefaultLayout() 
  });
}

export async function POST(req: Request) {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;

  const parsed = layoutSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const layout = await prisma.dashboardLayout.upsert({
    where: { userId: guard.ctx.userId },
    update: { layout: parsed.data.layout },
    create: {
      userId: guard.ctx.userId,
      layout: parsed.data.layout,
    },
  });

  return NextResponse.json({ layout: layout.layout });
}

function getDefaultLayout() {
  return [
    { id: "branches", type: "metric", position: { x: 0, y: 0, w: 2, h: 1 }, config: { metric: "branches" } },
    { id: "agencies", type: "metric", position: { x: 2, y: 0, w: 2, h: 1 }, config: { metric: "agencies" } },
    { id: "employees", type: "metric", position: { x: 4, y: 0, w: 2, h: 1 }, config: { metric: "employees" } },
    { id: "tasks", type: "metric", position: { x: 6, y: 0, w: 2, h: 1 }, config: { metric: "tasks" } },
    { id: "announcements", type: "metric", position: { x: 8, y: 0, w: 2, h: 1 }, config: { metric: "announcements" } },
    { id: "recent-tasks", type: "list", position: { x: 0, y: 1, w: 6, h: 4 }, config: { resource: "tasks", limit: 5 } },
    { id: "recent-announcements", type: "list", position: { x: 6, y: 1, w: 6, h: 4 }, config: { resource: "announcements", limit: 5 } },
  ];
}