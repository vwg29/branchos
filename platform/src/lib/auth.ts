import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { ALL_PERMISSION_KEYS } from "../../prisma/seed-permissions";

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
          include: { tenant: true, role: true },
        });
        if (!user) return null;

        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;

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
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.tenantId = token.tenantId;
      session.user.tenantSlug = token.tenantSlug;
      session.user.roleId = token.roleId;
      session.user.permissions = token.permissions;
      return session;
    },
  },
};
