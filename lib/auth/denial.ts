// Pure so it can be unit tested without the Next.js runtime.
const HEADERS = { "Cache-Control": "private, no-store" };

/** 503 when auth is unconfigured (fail closed), 401 when signed out, null when allowed. */
export function denialResponse(configured: boolean, isOwner: boolean): Response | null {
  if (!configured) return Response.json({ error: "Authentication is not configured" }, { status: 503, headers: HEADERS });
  if (!isOwner) return Response.json({ error: "Unauthorized" }, { status: 401, headers: HEADERS });
  return null;
}
