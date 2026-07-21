import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { ALL_PERMISSION_KEYS } from "../../../../../prisma/seed-permissions";

const schema = z.object({
  company: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, and dashes only"),
  adminName: z.string().min(2),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(8),
  planSlug: z.string().default("trial"),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const input = parsed.data;

  const existing = await prisma.tenant.findUnique({ where: { slug: input.slug } });
  if (existing) {
    return NextResponse.json({ error: "Workspace handle is taken" }, { status: 409 });
  }

  const plan = await prisma.plan.findUnique({ where: { slug: input.planSlug } });

  // Create tenant + owner role + first user + default settings atomically.
  const tenant = await prisma.tenant.create({
    data: {
      name: input.company,
      slug: input.slug,
      status: "TRIAL",
      planId: plan?.id,
      settings: { create: {} },
      roles: {
        create: {
          name: "Owner",
          isOwner: true,
          permissions: ALL_PERMISSION_KEYS,
        },
      },
    },
    include: { roles: true },
  });

  const ownerRole = tenant.roles[0];
  await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: input.adminEmail,
      name: input.adminName,
      passwordHash: await bcrypt.hash(input.adminPassword, 10),
      roleId: ownerRole.id,
    },
  });

  return NextResponse.json({ ok: true, tenantSlug: tenant.slug });
}
