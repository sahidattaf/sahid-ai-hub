import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { denialResponse } from "./denial";
import { getAuthConfigStatus, isOwnerGithubId } from "./owner";

export interface OwnerSession {
  githubId: string;
  name: string | null;
}

/** Returns the signed-in owner, or null (unconfigured, signed out, or not on the allowlist). */
export async function getOwner(): Promise<OwnerSession | null> {
  if (!getAuthConfigStatus().configured) return null;
  const session = await auth();
  if (!session?.githubId || !isOwnerGithubId(session.githubId)) return null;
  return { githubId: session.githubId, name: session.user?.name ?? null };
}

/** For pages, layouts and data loaders. Every private data path must call this itself. */
export async function requireOwner(): Promise<OwnerSession> {
  const owner = await getOwner();
  if (!owner) redirect("/login");
  return owner;
}

/** For server actions: throws instead of redirecting. */
export async function assertOwner(): Promise<OwnerSession> {
  const owner = await getOwner();
  if (!owner) throw new Error("Unauthorized");
  return owner;
}

/** For route handlers: a ready-made denial, with 503 when auth is not configured. */
export async function ownerOrDenial(): Promise<{ owner: OwnerSession } | { denial: Response }> {
  const owner = await getOwner();
  const denial = denialResponse(getAuthConfigStatus().configured, owner !== null);
  if (denial) return { denial };
  return owner ? { owner } : { denial: denialResponse(true, false)! };
}
