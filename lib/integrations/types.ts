// Shared result model for every provider integration.
//
// A failed fetch is NEVER represented as an empty or zero-valued success.
// Callers must switch on `state`; only "ok" and "empty" carry live data.

export type FailureKind =
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "rate_limited"
  | "timeout"
  | "provider_outage"
  | "network"
  | "malformed"
  | "provider_error"
  | "misconfigured";

export type Freshness = "fresh" | "stale";

interface Provenance {
  /** Human-readable provider + endpoint family, e.g. "GitHub REST API". */
  source: string;
}

export interface IntegrationSuccess<T> extends Provenance {
  /** "empty" = the provider answered successfully and returned nothing. */
  state: "ok" | "empty";
  data: T;
  /** ISO time of the last SUCCESSFUL provider response backing `data`. */
  fetchedAt: string;
  freshness: Freshness;
}

export interface IntegrationUnconfigured extends Provenance {
  state: "unconfigured";
  /** Environment variable names (never values) that are missing. */
  missing: string[];
}

export interface IntegrationFailure<T> extends Provenance {
  state: "error";
  kind: FailureKind;
  /** Safe to render: contains no tokens, URLs with credentials or provider bodies. */
  message: string;
  attemptedAt: string;
  retryAfterSeconds?: number;
  /** Previous successful data, if any. Must be shown as stale. */
  lastSuccess?: { data: T; fetchedAt: string };
}

export type IntegrationResult<T> = IntegrationSuccess<T> | IntegrationUnconfigured | IntegrationFailure<T>;

export class IntegrationError extends Error {
  readonly kind: FailureKind;
  readonly retryAfterSeconds?: number;
  constructor(kind: FailureKind, message: string, retryAfterSeconds?: number) {
    super(message);
    this.name = "IntegrationError";
    this.kind = kind;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export const FAILURE_LABELS: Record<FailureKind, string> = {
  unauthorized: "Authorization failed",
  forbidden: "Access denied",
  not_found: "Not found",
  rate_limited: "Rate limited",
  timeout: "Timed out",
  provider_outage: "Provider outage",
  network: "Network error",
  malformed: "Malformed response",
  provider_error: "Provider error",
  misconfigured: "Misconfigured",
};
