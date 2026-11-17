import type { NextRequest } from "next/server";
import { handlers, ownerLoginConfigured } from "@/lib/owner-auth";

export function GET(request: NextRequest) {
  return ownerLoginConfigured() ? handlers.GET(request) : new Response(null, { status: 404 });
}

export function POST(request: NextRequest) {
  return ownerLoginConfigured() ? handlers.POST(request) : new Response(null, { status: 404 });
}
