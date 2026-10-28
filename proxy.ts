import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthConfigStatus } from "@/lib/auth/owner";

// Optimistic gate only (cookie presence). The authoritative owner check is
// repeated in the dashboard layout, every page, every route handler and the
// data loaders via lib/auth/guard.ts.
const SESSION_COOKIE = /^(__Secure-)?authjs\.session-token(\.\d+)?$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/private");
  const hasSession = request.cookies.getAll().some((c) => SESSION_COOKIE.test(c.name));

  if (!getAuthConfigStatus().configured) {
    return isApi ? Response.json({ error: "Authentication is not configured" }, { status: 503 }) : NextResponse.redirect(new URL("/login", request.url));
  }
  if (!hasSession) {
    return isApi ? Response.json({ error: "Unauthorized" }, { status: 401 }) : NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/private/:path*"],
};
