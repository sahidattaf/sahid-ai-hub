import { ownerOrDenial } from "@/lib/auth/guard";
import { getGithubIntegration } from "@/lib/integrations/github";
import { getNotionIntegration } from "@/lib/integrations/notion";
import { getVercelIntegration } from "@/lib/integrations/vercel";
import type { IntegrationResult } from "@/lib/integrations/types";

export const dynamic = "force-dynamic";

// Status envelope only (state, source, timestamps, freshness, failure kind).
// Provider payloads such as repository or project names are deliberately omitted.
function envelope<T>(r: IntegrationResult<T>) {
  switch (r.state) {
    case "ok":
    case "empty":
      return { state: r.state, source: r.source, fetchedAt: r.fetchedAt, freshness: r.freshness };
    case "unconfigured":
      return { state: r.state, source: r.source, missing: r.missing };
    case "error":
      return { state: r.state, source: r.source, kind: r.kind, attemptedAt: r.attemptedAt, lastSuccessAt: r.lastSuccess?.fetchedAt ?? null };
  }
}

export async function GET() {
  const gate = await ownerOrDenial();
  if ("denial" in gate) return gate.denial;
  const [github, vercel, notion] = await Promise.all([getGithubIntegration(), getVercelIntegration(), getNotionIntegration()]);
  return Response.json({ github: envelope(github), vercel: envelope(vercel), notion: envelope(notion) }, { headers: { "Cache-Control": "private, no-store" } });
}
