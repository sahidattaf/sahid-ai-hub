import "server-only";
import { cachedFetch } from "./cache";
import { isRecord, malformed, providerJson } from "./http";
import { IntegrationError, type FailureKind, type IntegrationResult } from "./types";

const PROVIDER = "Notion";
export const NOTION_SOURCE = "Notion API (api.notion.com)";
const BASE = "https://api.notion.com/v1";
// Data sources require Notion-Version 2025-09-03 or later; override with NOTION_API_VERSION.
const DEFAULT_VERSION = "2025-09-03";
const TTL_MS = 5 * 60_000;
const PAGE_SIZE = 25;
const ID_PATTERN = /^[0-9a-f]{32}$/i;

export interface NotionConfig {
  token: string;
  version: string;
  dataSourceIds: string[];
  pageIds: string[];
}

export interface NotionItem {
  id: string;
  title: string;
  url: string | null;
  lastEdited: string | null;
}

export type NotionScopeResult =
  | { kind: "data_source" | "page"; id: string; state: "ok"; items: NotionItem[]; hasMore: boolean }
  | { kind: "data_source" | "page"; id: string; state: "error"; failure: FailureKind; message: string; retryAfterSeconds?: number };

export interface NotionSnapshot {
  scopes: NotionScopeResult[];
}

function splitList(value: string | undefined): string[] {
  return (value ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

export function normalizeNotionId(raw: string): string | null {
  const id = raw.replace(/-/g, "");
  return ID_PATTERN.test(id) ? id.toLowerCase() : null;
}

export type NotionConfigCheck =
  | { ok: true; config: NotionConfig }
  | { ok: false; reason: "unconfigured"; missing: string[] }
  | { ok: false; reason: "misconfigured"; message: string };

/** Access is scoped to explicitly configured IDs only; nothing is searched or crawled. */
export function readNotionConfig(env: Record<string, string | undefined>): NotionConfigCheck {
  const token = env.NOTION_TOKEN?.trim();
  const rawSources = splitList(env.NOTION_DATA_SOURCE_IDS);
  const rawPages = splitList(env.NOTION_PAGE_IDS);
  const missing: string[] = [];
  if (!token) missing.push("NOTION_TOKEN");
  if (rawSources.length === 0 && rawPages.length === 0) missing.push("NOTION_DATA_SOURCE_IDS or NOTION_PAGE_IDS");
  if (missing.length || !token) return { ok: false, reason: "unconfigured", missing };
  const dataSourceIds = rawSources.map(normalizeNotionId);
  const pageIds = rawPages.map(normalizeNotionId);
  const clean = (ids: (string | null)[]): ids is string[] => ids.every((id) => id !== null);
  if (!clean(dataSourceIds) || !clean(pageIds)) return { ok: false, reason: "misconfigured", message: "NOTION_DATA_SOURCE_IDS / NOTION_PAGE_IDS contain a value that is not a 32-character Notion ID." };
  return { ok: true, config: { token, version: env.NOTION_API_VERSION?.trim() || DEFAULT_VERSION, dataSourceIds, pageIds } };
}

function titleOf(page: Record<string, unknown>): string {
  const props = isRecord(page.properties) ? page.properties : {};
  for (const prop of Object.values(props)) {
    if (isRecord(prop) && prop.type === "title" && Array.isArray(prop.title)) {
      return prop.title.map((t) => (isRecord(t) && typeof t.plain_text === "string" ? t.plain_text : "")).join("").trim() || "(untitled)";
    }
  }
  return "(untitled)";
}

export function parseNotionPage(raw: unknown): NotionItem {
  if (!isRecord(raw) || raw.object !== "page" || typeof raw.id !== "string") throw malformed(PROVIDER, "page object");
  const url = typeof raw.url === "string" && raw.url.startsWith("https://") ? raw.url : null;
  return { id: raw.id, title: titleOf(raw), url, lastEdited: typeof raw.last_edited_time === "string" ? raw.last_edited_time : null };
}

export function parseQueryResponse(raw: unknown): { items: NotionItem[]; hasMore: boolean } {
  if (!isRecord(raw) || !Array.isArray(raw.results)) throw malformed(PROVIDER, "results list");
  // Only the title, link and edit time of page rows are read; no other property leaves this function.
  return { items: raw.results.filter((r) => isRecord(r) && r.object === "page").map(parseNotionPage), hasMore: raw.has_more === true };
}

function notionHeaders(config: NotionConfig): Record<string, string> {
  return { Authorization: `Bearer ${config.token}`, "Notion-Version": config.version };
}

function failed(kind: "data_source" | "page", id: string, error: unknown): NotionScopeResult {
  const known = error instanceof IntegrationError;
  return { kind, id, state: "error", failure: known ? error.kind : "provider_error", message: known ? error.message : "Notion request failed.", retryAfterSeconds: known ? error.retryAfterSeconds : undefined };
}

export async function fetchNotionSnapshot(config: NotionConfig): Promise<NotionSnapshot> {
  const sources = config.dataSourceIds.map(async (id): Promise<NotionScopeResult> => {
    try {
      const raw = await providerJson({
        provider: PROVIDER,
        url: `${BASE}/data_sources/${id}/query`,
        method: "POST",
        headers: notionHeaders(config),
        body: { page_size: PAGE_SIZE, sorts: [{ timestamp: "last_edited_time", direction: "descending" }] },
      });
      return { kind: "data_source", id, state: "ok", ...parseQueryResponse(raw) };
    } catch (error) {
      return failed("data_source", id, error);
    }
  });
  const pages = config.pageIds.map(async (id): Promise<NotionScopeResult> => {
    try {
      const raw = await providerJson({ provider: PROVIDER, url: `${BASE}/pages/${id}`, headers: notionHeaders(config) });
      return { kind: "page", id, state: "ok", items: [parseNotionPage(raw)], hasMore: false };
    } catch (error) {
      return failed("page", id, error);
    }
  });
  const scopes = await Promise.all([...sources, ...pages]);
  const firstError = scopes.find((s) => s.state === "error");
  if (firstError?.state === "error" && scopes.every((s) => s.state === "error")) throw new IntegrationError(firstError.failure, firstError.message, firstError.retryAfterSeconds);
  return { scopes };
}

export async function getNotionIntegration(env: Record<string, string | undefined> = process.env): Promise<IntegrationResult<NotionSnapshot>> {
  const check = readNotionConfig(env);
  if (!check.ok) {
    if (check.reason === "unconfigured") return { state: "unconfigured", source: NOTION_SOURCE, missing: check.missing };
    return { state: "error", source: NOTION_SOURCE, kind: "misconfigured", message: check.message, attemptedAt: new Date().toISOString() };
  }
  const { config } = check;
  return cachedFetch({
    key: `notion:${config.dataSourceIds.join(",")}|${config.pageIds.join(",")}`,
    source: NOTION_SOURCE,
    ttlMs: TTL_MS,
    load: () => fetchNotionSnapshot(config),
    isEmpty: (s) => s.scopes.every((sc) => sc.state === "ok" && sc.items.length === 0),
  });
}
