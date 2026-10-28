// Test helpers. Everything here is MOCKED: no test in this suite contacts
// GitHub, Vercel or Notion. Live verification is a separate manual step.
import { resetIntegrationCache } from "../lib/integrations/cache";

export function json(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" }, ...init });
}

export function mockFetch(handler: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  const original = globalThis.fetch;
  const calls: { url: string; init?: RequestInit }[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init });
    return handler(String(input), init);
  }) as typeof fetch;
  resetIntegrationCache();
  return {
    calls,
    restore() {
      globalThis.fetch = original;
      resetIntegrationCache();
    },
  };
}

export function throwingFetch(error: Error) {
  return mockFetch(() => {
    throw error;
  });
}

export function timeoutError(): Error {
  const e = new Error("The operation was aborted due to timeout");
  e.name = "TimeoutError";
  return e;
}

export const SECRET = "ghp_SUPERSECRETTOKEN123";
