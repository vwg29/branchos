import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { ALL_PERMISSION_KEYS } from "../../prisma/seed-permissions";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Tenant-client authentication (JWT session). Fully separate from platform admin.
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/ar/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        tenantSlug: { label: "Workspace", type: "text" },
        userType: { label: "Login as", type: "text" }, // "HQ" | "BRANCH" | "AGENCY"
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Resolve tenant either by explicit slug or by unique email match.
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
            ...(credentials.tenantSlug
              ? { tenant: { slug: credentials.tenantSlug } }
              : {}),
          },
          include: { tenant: true, role: true, branch: true, agency: true },
        });
        if (!user) return null;

        // Account lockout check
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error("ACCOUNT_LOCKED");
        }

        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) {
          // Increment failed attempts
          const attempts = user.failedLoginAttempts + 1;
          const updateData: Record<string, unknown> = { failedLoginAttempts: attempts };
          if (attempts >= MAX_FAILED_ATTEMPTS) {
            updateData.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
          }
          await prisma.user.update({
            where: { id: user.id },
            data: updateData,
          });
          return null;
        }

        // Reset failed attempts on successful login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
          },
        });

        // Validate user type matches the login type
        const requestedType = (credentials.userType || "HQ").toUpperCase();
        if (requestedType !== "HQ" && user.userType === "HQ") {
          // HQ user trying to log in as branch/agency - not allowed
          throw new Error("INVALID_USER_TYPE");
        }
        if (requestedType === "BRANCH" && user.userType !== "BRANCH") {
          throw new Error("INVALID_USER_TYPE");
        }
        if (requestedType === "AGENCY" && user.userType !== "AGENCY") {
          throw new Error("INVALID_USER_TYPE");
        }

        // Branch/Agency users can only access their assigned branch/agency
        if (user.userType === "BRANCH" && !user.branchId) {
          throw new Error("NO_BRANCH_ASSIGNED");
        }
        if (user.userType === "AGENCY" && !user.agencyId) {
          throw new Error("NO_AGENCY_ASSIGNED");
        }

        const permissions = user.role?.isOwner
          ? ALL_PERMISSION_KEYS
          : user.role?.permissions ?? [];

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          tenantId: user.tenantId,
          tenantSlug: user.tenant.slug,
          roleId: user.roleId,
          permissions,
          userType: user.userType,
          branchId: user.branchId,
          agencyId: user.agencyId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tenantId = user.tenantId;
        token.tenantSlug = user.tenantSlug;
        token.roleId = user.roleId;
        token.permissions = user.permissions;
        token.userType = user.userType;
        token.branchId = user.branchId;
        token.agencyId = user.agencyId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.tenantId = token.tenantId;
      session.user.tenantSlug = token.tenantSlug;
      session.user.roleId = token.roleId;
      session.user.permissions = token.permissions;
      session.user.userType = token.userType;
      session.user.branchId = token.branchId;
      session.user.agencyId = token.agencyId;
      return session;
    },
  },
};
