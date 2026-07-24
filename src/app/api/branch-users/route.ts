import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { requireTenant, hasPermission, isHQ } from "@/lib/session";

const createBranchUserSchema = z.object({
  branchId: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
  roleId: z.string().optional(),
});

const createAgencyUserSchema = z.object({
  agencyId: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
  roleId: z.string().optional(),
});

export async function POST(req: Request) {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;
  
  // Only HQ can create branch/agency users
  if (!isHQ(guard.ctx)) {
    return NextResponse.json({ error: "Only HQ can create branch/agency accounts" }, { status: 403 });
  }
  
  if (!hasPermission(guard.ctx, "users:write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const { type, ...data } = body;

  if (type === "branch") {
    const parsed = createBranchUserSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    
    const { branchId, email, name, password, roleId } = parsed.data;
    
    // Verify branch exists and belongs to tenant
    const branch = await guard.ctx.db.branches.findFirst({ where: { id: branchId } });
    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    // Check if user already exists
    const existing = await guard.ctx.db.users.findFirst({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    // Get default role for branch users if not specified
    let finalRoleId = roleId;
    if (!finalRoleId) {
      const defaultRole = await guard.ctx.db.roles.findFirst({ 
        where: { name: "Branch Manager" } 
      });
      if (!defaultRole) {
        // Create default Branch Manager role
        const newRole = await guard.ctx.db.roles.create({
          data: {
            name: "Branch Manager",
            permissions: [
              "employees:read", "employees:write",
              "tasks:read", "tasks:write",
              "announcements:read",
              "performance:read",
              "documents:read",
            ],
          },
        });
        finalRoleId = newRole.id;
      } else {
        finalRoleId = defaultRole.id;
      }
    }

    const user = await guard.ctx.db.users.create({
      data: {
        email,
        name,
        passwordHash: await bcrypt.hash(password, 10),
        roleId: finalRoleId,
        userType: "BRANCH",
        branchId,
      },
    });

    return NextResponse.json({ 
      ok: true, 
      user: { id: user.id, email: user.email, name: user.name, branchId } 
    }, { status: 201 });
  }

  if (type === "agency") {
    const parsed = createAgencyUserSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    
    const { agencyId, email, name, password, roleId } = parsed.data;
    
    // Verify agency exists and belongs to tenant
    const agency = await guard.ctx.db.agencies.findFirst({ where: { id: agencyId } });
    if (!agency) {
      return NextResponse.json({ error: "Agency not found" }, { status: 404 });
    }

    // Check if user already exists
    const existing = await guard.ctx.db.users.findFirst({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    // Get default role for agency users if not specified
    let finalRoleId = roleId;
    if (!finalRoleId) {
      const defaultRole = await guard.ctx.db.roles.findFirst({ 
        where: { name: "Agency Manager" } 
      });
      if (!defaultRole) {
        const newRole = await guard.ctx.db.roles.create({
          data: {
            name: "Agency Manager",
            permissions: [
              "employees:read", "employees:write",
              "tasks:read", "tasks:write",
              "announcements:read",
              "documents:read",
            ],
          },
        });
        finalRoleId = newRole.id;
      } else {
        finalRoleId = defaultRole.id;
      }
    }

    const user = await guard.ctx.db.users.create({
      data: {
        email,
        name,
        passwordHash: await bcrypt.hash(password, 10),
        roleId: finalRoleId,
        userType: "AGENCY",
        agencyId,
      },
    });

    return NextResponse.json({ 
      ok: true, 
      user: { id: user.id, email: user.email, name: user.name, agencyId } 
    }, { status: 201 });
  }

  return NextResponse.json({ error: "Invalid type. Use 'branch' or 'agency'" }, { status: 400 });
}

export async function GET() {
  const guard = await requireTenant();
  if (!guard.ok) return guard.response;
  if (!hasPermission(guard.ctx, "users:read")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await guard.ctx.db.users.findMany({
    include: { role: true, branch: true, agency: true },
    orderBy: { createdAt: "desc" },
  });

  // Filter for branch/agency users based on access
  let filtered = users;
  if (!isHQ(guard.ctx)) {
    filtered = users.filter((u) => 
      (u.userType === "BRANCH" && u.branchId === guard.ctx.branchId) ||
      (u.userType === "AGENCY" && u.agencyId === guard.ctx.agencyId)
    );
  }

  return NextResponse.json({ 
    items: filtered.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      userType: u.userType,
      branchId: u.branchId,
      agencyId: u.agencyId,
      role: u.role,
      branch: u.branch,
      agency: u.agency,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
    }))
  });
}