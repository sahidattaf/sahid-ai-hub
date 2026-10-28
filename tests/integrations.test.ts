// MOCKED provider tests. These prove the adapters classify failures correctly
// and never present a failed fetch as a successful zero. They do NOT verify the
// live GitHub, Vercel or Notion APIs.
import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { cachedFetch, resetIntegrationCache } from "../lib/integrations/cache";
import { classifyStatus, parseRetryAfter } from "../lib/integrations/http";
import { IntegrationError } from "../lib/integrations/types";
import { getGithubIntegration, parseLatestCommit, parseRepo } from "../lib/integrations/github";
import { getVercelIntegration, joinWithRegistry, parseProjectsPage } from "../lib/integrations/vercel";
import { getNotionIntegration, normalizeNotionId, readNotionConfig } from "../lib/integrations/notion";
import type { GithubTarget, VercelTarget } from "../data/project-registry";
import { SECRET, json, mockFetch, throwingFetch, timeoutError } from "./helpers";

let restore: (() => void) | undefined;
afterEach(() => {
  restore?.();
  restore = undefined;
});
const use = <T extends { restore(): void }>(m: T): T => ((restore = () => m.restore()), m);

const targets: GithubTarget[] = [
  { projectId: "a", projectName: "A", owner: "o", repo: "a", url: "https://github.com/o/a", declaredVisibility: "Public" },
  { projectId: "b", projectName: "B", owner: "o", repo: "b", url: "https://github.com/o/b", declaredVisibility: "Private" },
];
const repoBody = (name: string, extra: object = {}) => ({ full_name: `o/${name}`, default_branch: "main", private: false, archived: false, stargazers_count: 3, forks_count: 1, open_issues_count: 2, language: "TypeScript", pushed_at: "2026-10-01T00:00:00Z", ...extra });
const commitBody = [{ commit: { message: "feat: x\n\nbody", author: { date: "2026-10-01T00:00:00Z" } } }];
const env = { GITHUB_TOKEN: SECRET };

// --- shared http classification ---

test("status classification and retry-after parsing", () => {
  assert.equal(classifyStatus(401, new Headers()), "unauthorized");
  assert.equal(classifyStatus(403, new Headers()), "forbidden");
  assert.equal(classifyStatus(403, new Headers({ "x-ratelimit-remaining": "0" })), "rate_limited");
  assert.equal(classifyStatus(403, new Headers({ "retry-after": "30" })), "rate_limited");
  assert.equal(classifyStatus(429, new Headers()), "rate_limited");
  assert.equal(classifyStatus(404, new Headers()), "not_found");
  assert.equal(classifyStatus(503, new Headers()), "provider_outage");
  assert.equal(classifyStatus(504, new Headers()), "timeout");
  assert.equal(parseRetryAfter(new Headers({ "retry-after": "42" })), 42);
  assert.equal(parseRetryAfter(new Headers({ "x-ratelimit-reset": String(Math.floor(Date.now() / 1000) + 90) }), Date.now()) !== undefined, true);
  assert.equal(parseRetryAfter(new Headers()), undefined);
});

// --- GitHub ---

test("GitHub: missing token is a setup state, with no fetch attempted", async () => {
  const m = use(mockFetch(() => json({})));
  const r = await getGithubIntegration({}, targets);
  assert.equal(r.state, "unconfigured");
  assert.deepEqual(r.state === "unconfigured" && r.missing, ["GITHUB_TOKEN"]);
  assert.equal(m.calls.length, 0);
});

test("GitHub: success returns data with source, fetch time and freshness", async () => {
  use(mockFetch((url) => (url.includes("/commits") ? json(commitBody) : json(repoBody(url.split("/repos/o/")[1].split("?")[0])))));
  const r = await getGithubIntegration(env, targets);
  assert.equal(r.state, "ok");
  if (r.state !== "ok") return;
  assert.equal(r.freshness, "fresh");
  assert.match(r.source, /GitHub/);
  assert.ok(!Number.isNaN(Date.parse(r.fetchedAt)));
  assert.equal(r.data.repos.every((x) => x.state === "ok"), true);
  assert.equal(parseLatestCommit(commitBody).state, "ok");
});

test("GitHub: 401 is an error, never a zero-count success", async () => {
  use(mockFetch(() => json({ message: "Bad credentials" }, { status: 401 })));
  const r = await getGithubIntegration(env, targets);
  assert.equal(r.state, "error");
  assert.equal(r.state === "error" && r.kind, "unauthorized");
  assert.equal("data" in r, false);
});

test("GitHub: rate limit surfaces retry-after", async () => {
  use(mockFetch(() => new Response("{}", { status: 403, headers: { "x-ratelimit-remaining": "0", "retry-after": "120" } })));
  const r = await getGithubIntegration(env, targets);
  assert.equal(r.state === "error" && r.kind, "rate_limited");
  assert.equal(r.state === "error" && r.retryAfterSeconds, 120);
});

test("GitHub: provider outage, timeout and network failures are distinct errors", async () => {
  use(mockFetch(() => new Response("oops", { status: 502 })));
  assert.equal((await getGithubIntegration(env, targets)).state === "error" && ((await getGithubIntegration(env, targets)) as { kind: string }).kind, "provider_outage");
  restore?.();
  use(throwingFetch(timeoutError()));
  const t = await getGithubIntegration(env, targets);
  assert.equal(t.state === "error" && t.kind, "timeout");
  restore?.();
  use(throwingFetch(new TypeError("fetch failed")));
  const n = await getGithubIntegration(env, targets);
  assert.equal(n.state === "error" && n.kind, "network");
});

test("GitHub: malformed JSON and malformed shape are errors", async () => {
  use(mockFetch(() => new Response("<html>not json</html>", { status: 200 })));
  const a = await getGithubIntegration(env, targets);
  assert.equal(a.state === "error" && a.kind, "malformed");
  restore?.();
  use(mockFetch(() => json({ unexpected: true })));
  const b = await getGithubIntegration(env, targets);
  assert.equal(b.state === "error" && b.kind, "malformed");
  assert.throws(() => parseRepo({ full_name: "o/a" }), IntegrationError);
});

test("GitHub: partial failure keeps successes and flags the failed repo", async () => {
  use(mockFetch((url) => (url.includes("/repos/o/b") ? json({}, { status: 404 }) : url.includes("/commits") ? json(commitBody) : json(repoBody("a")))));
  const r = await getGithubIntegration(env, targets);
  assert.equal(r.state, "ok");
  if (r.state !== "ok") return;
  const failed = r.data.repos.filter((x) => x.state === "error");
  assert.equal(failed.length, 1);
  assert.equal(failed[0].state === "error" && failed[0].kind, "not_found");
});

test("GitHub: an empty commit list is 'none', a failing commit call is 'unavailable'", async () => {
  use(mockFetch((url) => (url.includes("/commits") ? json({}, { status: 500 }) : json(repoBody("a")))));
  const r = await getGithubIntegration(env, [targets[0]]);
  assert.equal(r.state, "ok");
  const repo = r.state === "ok" && r.data.repos[0];
  assert.equal(repo && repo.state === "ok" && repo.repo.lastCommit.state, "unavailable");
  assert.deepEqual(parseLatestCommit([]), { state: "none" });
});

test("GitHub: no registry targets is a confirmed empty result, not an error", async () => {
  use(mockFetch(() => json({})));
  const r = await getGithubIntegration(env, []);
  assert.equal(r.state, "empty");
});

test("errors never contain the token or provider response bodies", async () => {
  use(mockFetch(() => json({ message: `leaked ${SECRET}` }, { status: 500 })));
  const logged: string[] = [];
  const origError = console.error;
  console.error = (...a: unknown[]) => void logged.push(a.join(" "));
  try {
    const r = await getGithubIntegration(env, targets);
    assert.ok(!JSON.stringify(r).includes(SECRET));
    assert.ok(!logged.join("\n").includes(SECRET));
  } finally {
    console.error = origError;
  }
});

test("requests carry the token server-side and disable shared caching", async () => {
  const m = use(mockFetch((url) => (url.includes("/commits") ? json(commitBody) : json(repoBody("a")))));
  await getGithubIntegration(env, [targets[0]]);
  const init = m.calls[0].init!;
  assert.equal((init.headers as Record<string, string>).Authorization, `Bearer ${SECRET}`);
  assert.equal(init.cache, "no-store");
  assert.ok(init.signal, "a timeout signal must be attached");
});

// --- cache / last-success semantics ---

test("after a failure the previous success is kept as lastSuccess, never as fresh data", async () => {
  resetIntegrationCache();
  let n = 0;
  const base = { key: "t", source: "Test", ttlMs: 0, isEmpty: () => false, now: () => 1_000_000 };
  const ok = await cachedFetch({ ...base, load: async () => ({ v: 1 }) });
  assert.equal(ok.state, "ok");
  const bad = await cachedFetch({
    ...base,
    load: async () => {
      n++;
      throw new IntegrationError("provider_outage", "down");
    },
  });
  assert.equal(n, 1);
  assert.equal(bad.state, "error");
  assert.deepEqual(bad.state === "error" && bad.lastSuccess?.data, { v: 1 });
  assert.equal("freshness" in bad, false);
  resetIntegrationCache();
});

test("a fresh cache entry is reused within its TTL (no extra provider call)", async () => {
  resetIntegrationCache();
  let calls = 0;
  const opts = { key: "ttl", source: "Test", ttlMs: 60_000, isEmpty: () => false, load: async () => ({ calls: ++calls }) };
  await cachedFetch(opts);
  const second = await cachedFetch(opts);
  assert.equal(calls, 1);
  assert.equal(second.state, "ok");
  resetIntegrationCache();
});

// --- Vercel ---

const vTargets: VercelTarget[] = [
  { projectId: "a", projectName: "A", vercelProject: "proj-a", declaredUrl: "https://a.example.app/" },
  { projectId: "b", projectName: "B", vercelProject: "proj-b", declaredUrl: "https://b.example.app/" },
];
const vProject = (name: string, extra: object = {}) => ({ id: `prj_${name}`, name, framework: "nextjs", updatedAt: 1, targets: { production: { readyState: "READY", alias: [`${name}.example.app`], createdAt: 5 } }, ...extra });

test("Vercel: missing token is a setup state", async () => {
  const m = use(mockFetch(() => json([])));
  const r = await getVercelIntegration({});
  assert.equal(r.state, "unconfigured");
  assert.equal(m.calls.length, 0);
});

test("Vercel: uses /v10/projects, sends the team id, and accepts both response shapes", async () => {
  const m = use(mockFetch(() => json({ projects: [vProject("proj-a")], pagination: { count: 1, next: null } })));
  const r = await getVercelIntegration({ VERCEL_TOKEN: SECRET, VERCEL_TEAM_ID: "team_1" });
  assert.equal(r.state, "ok");
  assert.match(m.calls[0].url, /\/v10\/projects\?/);
  assert.match(m.calls[0].url, /teamId=team_1/);
  assert.equal(parseProjectsPage([vProject("x")]).projects.length, 1);
  assert.equal(parseProjectsPage({ projects: [], pagination: {} }).projects.length, 0);
});

test("Vercel: follows pagination", async () => {
  let page = 0;
  const m = use(mockFetch(() => json({ projects: [vProject(`p${page}`)], pagination: { next: page++ === 0 ? 123 : null } })));
  const r = await getVercelIntegration({ VERCEL_TOKEN: SECRET });
  assert.equal(r.state === "ok" && r.data.projects.length, 2);
  assert.match(m.calls[1].url, /until=123/);
});

test("Vercel: 401, 429, 500 and malformed bodies are errors", async () => {
  for (const [status, kind] of [[401, "unauthorized"], [429, "rate_limited"], [500, "provider_outage"]] as const) {
    use(mockFetch(() => new Response("{}", { status })));
    const r = await getVercelIntegration({ VERCEL_TOKEN: SECRET });
    assert.equal(r.state === "error" && r.kind, kind);
    restore?.();
  }
  use(mockFetch(() => json({ nope: 1 })));
  const r = await getVercelIntegration({ VERCEL_TOKEN: SECRET });
  assert.equal(r.state === "error" && r.kind, "malformed");
});

test("Vercel: an account with no projects is 'empty'; join marks registry projects as missing, not READY", async () => {
  use(mockFetch(() => json({ projects: [], pagination: { next: null } })));
  const r = await getVercelIntegration({ VERCEL_TOKEN: SECRET });
  assert.equal(r.state, "empty");
  const { rows } = joinWithRegistry({ projects: [] }, vTargets);
  assert.ok(rows.every((x) => x.project === null));
});

test("Vercel: declared URL is compared with, never replaced by, the verified host", () => {
  const snapshot = { projects: [parseProjectsPage([vProject("proj-a")]).projects[0], parseProjectsPage([vProject("proj-b", { targets: { production: { readyState: "ERROR", alias: ["other.example.app"] } } })]).projects[0], parseProjectsPage([vProject("extra")]).projects[0]] };
  const { rows, unregistered } = joinWithRegistry(snapshot, vTargets);
  assert.equal(rows[0].urlCheck, "differs"); // declared a.example.app vs proj-a.example.app
  assert.equal(rows[1].project?.production?.readyState, "ERROR");
  assert.equal(rows[1].urlCheck, "differs");
  assert.deepEqual(unregistered.map((p) => p.name), ["extra"]);
});

// --- Notion ---

const A = "a".repeat(32);
const B = "b".repeat(32);
const notionEnv = { NOTION_TOKEN: SECRET, NOTION_DATA_SOURCE_IDS: A, NOTION_PAGE_IDS: B };
const page = (id: string, title: string) => ({ object: "page", id, url: `https://www.notion.so/${id}`, last_edited_time: "2026-10-01T00:00:00Z", properties: { Name: { type: "title", title: [{ plain_text: title }] }, Secret: { type: "rich_text", rich_text: [{ plain_text: "DO-NOT-LEAK" }] } } });

test("Notion: token without scope, or scope without token, is a setup state", async () => {
  const m = use(mockFetch(() => json({})));
  assert.equal((await getNotionIntegration({ NOTION_TOKEN: SECRET })).state, "unconfigured");
  assert.equal((await getNotionIntegration({ NOTION_DATA_SOURCE_IDS: A })).state, "unconfigured");
  assert.equal(m.calls.length, 0);
});

test("Notion: malformed IDs are rejected before any request", async () => {
  const m = use(mockFetch(() => json({})));
  const r = await getNotionIntegration({ NOTION_TOKEN: SECRET, NOTION_PAGE_IDS: "not-an-id" });
  assert.equal(r.state === "error" && r.kind, "misconfigured");
  assert.equal(m.calls.length, 0);
  assert.equal(normalizeNotionId(`${A.slice(0, 8)}-${A.slice(8, 12)}-${A.slice(12, 16)}-${A.slice(16, 20)}-${A.slice(20)}`), A);
  assert.equal(readNotionConfig(notionEnv).ok, true);
});

test("Notion: reads only the configured IDs and only exposes title, link and edit time", async () => {
  const m = use(mockFetch((url) => (url.includes("/data_sources/") ? json({ object: "list", results: [page("row1", "Row One")], has_more: false }) : json(page(B, "Page Title")))));
  const r = await getNotionIntegration(notionEnv);
  assert.equal(r.state, "ok");
  assert.deepEqual(m.calls.map((c) => c.url).sort(), [`https://api.notion.com/v1/data_sources/${A}/query`, `https://api.notion.com/v1/pages/${B}`].sort());
  const headers = m.calls[0].init!.headers as Record<string, string>;
  assert.ok(headers["Notion-Version"]);
  assert.ok(!JSON.stringify(r).includes("DO-NOT-LEAK"));
  assert.ok(!JSON.stringify(r).includes(SECRET));
});

test("Notion: an empty data source is a confirmed empty result", async () => {
  use(mockFetch(() => json({ object: "list", results: [], has_more: false })));
  const r = await getNotionIntegration({ NOTION_TOKEN: SECRET, NOTION_DATA_SOURCE_IDS: A });
  assert.equal(r.state, "empty");
});

test("Notion: one inaccessible scope is flagged; all failing is an error", async () => {
  use(mockFetch((url) => (url.includes("/pages/") ? json({}, { status: 404 }) : json({ object: "list", results: [page("r", "R")], has_more: true }))));
  const partial = await getNotionIntegration(notionEnv);
  assert.equal(partial.state, "ok");
  assert.equal(partial.state === "ok" && partial.data.scopes.some((s) => s.state === "error" && s.failure === "not_found"), true);
  restore?.();
  use(mockFetch(() => json({}, { status: 401 })));
  const all = await getNotionIntegration(notionEnv);
  assert.equal(all.state === "error" && all.kind, "unauthorized");
  restore?.();
  use(mockFetch(() => json({ object: "list" })));
  const bad = await getNotionIntegration(notionEnv);
  assert.equal(bad.state === "error" && bad.kind, "malformed");
});

test("Notion: 429 reports rate limiting with Retry-After", async () => {
  use(mockFetch(() => new Response("{}", { status: 429, headers: { "retry-after": "7" } })));
  const r = await getNotionIntegration(notionEnv);
  assert.equal(r.state === "error" && r.kind, "rate_limited");
  assert.equal(r.state === "error" && r.retryAfterSeconds, 7);
});
