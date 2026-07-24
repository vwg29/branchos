import type { DefaultSession } from "next-auth";

// Extend NextAuth session/JWT with our tenant-scoped fields. Zero use of `any`.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tenantId: string;
      tenantSlug: string;
      roleId: string | null;
      permissions: string[];
      userType: "HQ" | "BRANCH" | "AGENCY";
      branchId?: string;
      agencyId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    tenantId: string;
    tenantSlug: string;
    roleId: string | null;
    permissions: string[];
    userType: "HQ" | "BRANCH" | "AGENCY";
    branchId?: string;
    agencyId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    tenantId: string;
    tenantSlug: string;
    roleId: string | null;
    permissions: string[];
    userType: "HQ" | "BRANCH" | "AGENCY";
    branchId?: string;
    agencyId?: string;
  }
}
