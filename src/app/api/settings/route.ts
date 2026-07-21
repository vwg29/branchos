import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTenant, hasPermission } from "@/lib/session";

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
  brandColor: z.string().optional(),
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
