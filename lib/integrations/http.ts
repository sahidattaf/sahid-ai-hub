import { IntegrationError, type FailureKind } from "./types";

export interface ProviderRequest {
  provider: string;
  url: string;
  method?: "GET" | "POST";
  headers: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 8_000;
const MAX_RETRY_AFTER_SECONDS = 3_600;

export function parseRetryAfter(headers: Headers, now = Date.now()): number | undefined {
  const retryAfter = headers.get("retry-after");
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds >= 0) return Math.min(Math.ceil(seconds), MAX_RETRY_AFTER_SECONDS);
  }
  const reset = Number(headers.get("x-ratelimit-reset"));
  if (Number.isFinite(reset) && reset > 0) return Math.min(Math.max(Math.ceil(reset - now / 1000), 0), MAX_RETRY_AFTER_SECONDS);
  return undefined;
}

/** Maps an HTTP failure to a kind. Pure so it can be unit tested. */
export function classifyStatus(status: number, headers: Headers): FailureKind {
  if (status === 401) return "unauthorized";
  if (status === 429) return "rate_limited";
  if (status === 403) return headers.get("x-ratelimit-remaining") === "0" || headers.has("retry-after") ? "rate_limited" : "forbidden";
  if (status === 404) return "not_found";
  if (status === 408 || status === 504) return "timeout";
  if (status >= 500) return "provider_outage";
  return "provider_error";
}

/**
 * Authenticated provider call. Always server-side, never cached by the Next.js
 * data cache (responses are private), bounded by a timeout, and every error is
 * reduced to a safe message: no token, URL query or response body is retained.
 */
export async function providerJson(req: ProviderRequest): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(req.url, {
      method: req.method ?? "GET",
      headers: req.body === undefined ? req.headers : { ...req.headers, "Content-Type": "application/json" },
      body: req.body === undefined ? undefined : JSON.stringify(req.body),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(req.timeoutMs ?? DEFAULT_TIMEOUT_MS),
    });
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    if (name === "TimeoutError" || name === "AbortError") throw new IntegrationError("timeout", `${req.provider} did not respond in time.`);
    throw new IntegrationError("network", `${req.provider} could not be reached.`);
  }

  if (!res.ok) {
    const kind = classifyStatus(res.status, res.headers);
    const retryAfter = kind === "rate_limited" ? parseRetryAfter(res.headers) : undefined;
    throw new IntegrationError(kind, `${req.provider} returned HTTP ${res.status}.`, retryAfter);
  }

  try {
    return JSON.parse(await res.text()) as unknown;
  } catch {
    throw new IntegrationError("malformed", `${req.provider} returned a response that is not valid JSON.`);
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function malformed(provider: string, what: string): IntegrationError {
  return new IntegrationError("malformed", `${provider} response was missing expected ${what}.`);
}
