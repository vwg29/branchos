import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { createAdminToken, setAdminCookie } from "@/lib/admin-session";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const admin = await prisma.platformAdmin.findUnique({
    where: { email: parsed.data.email },
  });
  if (!admin || !(await bcrypt.compare(parsed.data.password, admin.passwordHash))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = createAdminToken({ adminId: admin.id, email: admin.email });
  setAdminCookie(token);
  return NextResponse.json({ ok: true });
}
