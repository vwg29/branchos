import { NextResponse } from "next/server";
import { readAdminSession, type AdminSession } from "@/lib/admin-session";

// Guard for platform-admin API routes. Returns the session or a 401 response.
export function requireAdmin():
  | { ok: true; session: AdminSession }
  | { ok: false; response: NextResponse } {
  const session = readAdminSession();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true, session };
}
