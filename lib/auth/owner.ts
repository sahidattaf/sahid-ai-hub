// Pure owner-allowlist and configuration logic (no framework imports) so it can
// be unit tested. The authoritative decision is always made on the server.

type Env = Record<string, string | undefined>;

export const REQUIRED_AUTH_ENV = ["AUTH_SECRET", "AUTH_GITHUB_ID", "AUTH_GITHUB_SECRET", "OWNER_GITHUB_IDS"] as const;

export function parseOwnerIds(env: Env): string[] {
  return (env.OWNER_GITHUB_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^\d+$/.test(s));
}

export type AuthConfigStatus = { configured: true } | { configured: false; missing: string[] };

/** Authentication is fail-closed: anything missing means nobody can sign in. */
export function getAuthConfigStatus(env: Env = process.env): AuthConfigStatus {
  const missing: string[] = REQUIRED_AUTH_ENV.filter((name) => !env[name]?.trim());
  if (!missing.includes("OWNER_GITHUB_IDS") && parseOwnerIds(env).length === 0) missing.push("OWNER_GITHUB_IDS (no valid numeric GitHub user IDs)");
  return missing.length ? { configured: false, missing } : { configured: true };
}

/** Allowlist is keyed on the immutable numeric GitHub user ID, never on login or email. */
export function isOwnerGithubId(id: unknown, env: Env = process.env): boolean {
  if (typeof id !== "string" && typeof id !== "number") return false;
  if (!getAuthConfigStatus(env).configured) return false;
  return parseOwnerIds(env).includes(String(id));
}
