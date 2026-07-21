import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/session";

export async function GET(req: Request) {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;

  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const contains = { contains: q, mode: "insensitive" as const };
  const [branches, employees, tasks] = await Promise.all([
    guard.ctx.db.branches.findMany({ where: { name: contains }, take: 5 }),
    guard.ctx.db.employees.findMany({ where: { name: contains }, take: 5 }),
    guard.ctx.db.tasks.findMany({ where: { title: contains }, take: 5 }),
  ]);

  return NextResponse.json({
    results: [
      ...branches.map((b) => ({ type: "branch", id: b.id, label: b.name })),
      ...employees.map((e) => ({ type: "employee", id: e.id, label: e.name })),
      ...tasks.map((t) => ({ type: "task", id: t.id, label: t.title })),
    ],
  });
}
