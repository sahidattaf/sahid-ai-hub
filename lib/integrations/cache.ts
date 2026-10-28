import { IntegrationError, type IntegrationResult } from "./types";

// Process-local last-success store. Lives only in server memory; never sent to
// the client and never written to the shared Next.js data cache, so private
// provider data cannot be served to anyone who has not passed the auth guard
// in front of the caller.

interface Entry {
  data: unknown;
  fetchedAt: number;
}

const store = new Map<string, Entry>();

export function resetIntegrationCache(): void {
  store.clear();
}

export interface CachedFetchOptions<T> {
  key: string;
  source: string;
  ttlMs: number;
  load: () => Promise<T>;
  isEmpty: (data: T) => boolean;
  now?: () => number;
}

export async function cachedFetch<T>(opts: CachedFetchOptions<T>): Promise<IntegrationResult<T>> {
  const now = opts.now ?? Date.now;
  const t = now();
  const hit = store.get(opts.key) as { data: T; fetchedAt: number } | undefined;
  if (hit && t - hit.fetchedAt < opts.ttlMs) {
    return { state: opts.isEmpty(hit.data) ? "empty" : "ok", data: hit.data, source: opts.source, fetchedAt: new Date(hit.fetchedAt).toISOString(), freshness: "fresh" };
  }

  try {
    const data = await opts.load();
    const fetchedAt = now();
    store.set(opts.key, { data, fetchedAt });
    return { state: opts.isEmpty(data) ? "empty" : "ok", data, source: opts.source, fetchedAt: new Date(fetchedAt).toISOString(), freshness: "fresh" };
  } catch (error) {
    const known = error instanceof IntegrationError;
    // Log kind only: never the error object, which could carry request details.
    console.error(`[integration] ${opts.source} failed: ${known ? error.kind : "unexpected"}`);
    return {
      state: "error",
      source: opts.source,
      kind: known ? error.kind : "provider_error",
      message: known ? error.message : `${opts.source} failed unexpectedly.`,
      attemptedAt: new Date(now()).toISOString(),
      retryAfterSeconds: known ? error.retryAfterSeconds : undefined,
      lastSuccess: hit ? { data: hit.data as T, fetchedAt: new Date(hit.fetchedAt).toISOString() } : undefined,
    };
  }
}
