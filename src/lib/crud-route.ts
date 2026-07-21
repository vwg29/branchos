import { NextResponse } from "next/server";
import { z, type ZodTypeAny } from "zod";
import { requireTenant, hasPermission, type TenantContext } from "@/lib/session";

type Handler<S extends ZodTypeAny> = {
  resource: string; // permission prefix, e.g. "branches"
  schema: S;
  list: (ctx: TenantContext) => Promise<unknown[]>;
  create: (ctx: TenantContext, data: z.infer<S>) => Promise<unknown>;
  remove?: (ctx: TenantContext, id: string) => Promise<unknown>;
};

// Builds GET (list) / POST (create) / DELETE (?id=) for a tenant-scoped resource.
// Every handler resolves tenantId from the trusted session via requireTenant().
export function makeCrudRoute<S extends ZodTypeAny>(h: Handler<S>) {
  async function GET() {
    const guard = await requireTenant();
    if (!guard.ok) return guard.response;
    if (!hasPermission(guard.ctx, `${h.resource}:read`)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const items = await h.list(guard.ctx);
    return NextResponse.json({ items });
  }

  async function POST(req: Request) {
    const guard = await requireTenant();
    if (!guard.ok) return guard.response;
    if (!hasPermission(guard.ctx, `${h.resource}:write`)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const parsed = h.schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const created = await h.create(guard.ctx, parsed.data);
    return NextResponse.json({ item: created }, { status: 201 });
  }

  async function DELETE(req: Request) {
    const guard = await requireTenant();
    if (!guard.ok) return guard.response;
    if (!hasPermission(guard.ctx, `${h.resource}:write`)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!h.remove) {
      return NextResponse.json({ error: "Not supported" }, { status: 405 });
    }
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await h.remove(guard.ctx, id);
    return NextResponse.json({ ok: true });
  }

  return { GET, POST, DELETE };
}

// Coerce empty strings to undefined so optional fields stay clean.
export const optionalString = z
  .string()
  .optional()
  .transform((v) => (v === "" ? undefined : v));
