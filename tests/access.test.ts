// Unauthenticated-access tests: owner allowlist logic, the proxy gate, the
// route-handler denial, and static checks that every private entry point calls
// the server-side guard.
import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";
import { getAuthConfigStatus, isOwnerGithubId, parseOwnerIds } from "../lib/auth/owner";
import { proxy, config as proxyConfig } from "../proxy";
import { denialResponse } from "../lib/auth/denial";
import { DASHBOARD_NAV, isActivePath } from "../lib/dashboard-nav";

const root = path.resolve(import.meta.dirname, "..");
const FULL = { AUTH_SECRET: "s", AUTH_GITHUB_ID: "i", AUTH_GITHUB_SECRET: "x", OWNER_GITHUB_IDS: "12345, 678" };
const saved = { ...process.env };
afterEach(() => {
  for (const k of Object.keys(process.env)) if (!(k in saved)) delete process.env[k];
  Object.assign(process.env, saved);
});
function setEnv(env: Record<string, string | undefined>) {
  for (const k of ["AUTH_SECRET", "AUTH_GITHUB_ID", "AUTH_GITHUB_SECRET", "OWNER_GITHUB_IDS"]) delete process.env[k];
  for (const [k, v] of Object.entries(env)) if (v !== undefined) process.env[k] = v;
}

function walk(dir: string, name: RegExp, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, name, out);
    else if (name.test(e.name)) out.push(full);
  }
  return out;
}

// --- allowlist / fail-closed ---

test("auth fails closed: any missing variable means nobody is an owner", () => {
  assert.equal(getAuthConfigStatus({}).configured, false);
  for (const drop of Object.keys(FULL)) {
    const env = { ...FULL, [drop]: undefined };
    assert.equal(getAuthConfigStatus(env).configured, false, `${drop} missing should disable auth`);
    assert.equal(isOwnerGithubId("12345", env), false);
  }
  assert.equal(getAuthConfigStatus({ ...FULL, OWNER_GITHUB_IDS: "alice,bob" }).configured, false, "usernames are not valid owner ids");
  assert.equal(getAuthConfigStatus(FULL).configured, true);
});

test("allowlist matches numeric GitHub IDs exactly", () => {
  assert.deepEqual(parseOwnerIds(FULL), ["12345", "678"]);
  assert.equal(isOwnerGithubId(12345, FULL), true);
  assert.equal(isOwnerGithubId("678", FULL), true);
  assert.equal(isOwnerGithubId("1234", FULL), false);
  assert.equal(isOwnerGithubId("123456", FULL), false);
  assert.equal(isOwnerGithubId(undefined, FULL), false);
  assert.equal(isOwnerGithubId("", FULL), false);
});

// --- proxy gate ---

const req = (p: string, cookie?: string) => new NextRequest(`http://localhost:3000${p}`, cookie ? { headers: { cookie } } : undefined);

test("proxy matcher covers the dashboard and private API", () => {
  assert.deepEqual(proxyConfig.matcher, ["/dashboard/:path*", "/api/private/:path*"]);
});

test("proxy: unconfigured auth denies the dashboard and API (503) even with a cookie", async () => {
  setEnv({});
  const page = proxy(req("/dashboard", "authjs.session-token=x"));
  assert.equal(page.status, 307);
  assert.equal(new URL(page.headers.get("location")!).pathname, "/login");
  const api = proxy(req("/api/private/integrations", "authjs.session-token=x"));
  assert.equal(api.status, 503);
});

test("proxy: no session cookie redirects pages to /login and 401s the API", () => {
  setEnv(FULL);
  for (const p of ["/dashboard", "/dashboard/github", "/dashboard/revenue", "/dashboard/projects/sea-horizon"]) {
    const res = proxy(req(p));
    assert.equal(res.status, 307, p);
    assert.equal(new URL(res.headers.get("location")!).pathname, "/login");
  }
  assert.equal(proxy(req("/api/private/integrations")).status, 401);
});

test("proxy: a session cookie passes the optimistic gate (real check happens in the guard)", () => {
  setEnv(FULL);
  assert.equal(proxy(req("/dashboard", "__Secure-authjs.session-token=abc")).headers.get("x-middleware-next"), "1");
  assert.equal(proxy(req("/dashboard", "authjs.session-token.0=abc")).headers.get("x-middleware-next"), "1");
  // An unrelated cookie must not pass.
  assert.equal(proxy(req("/dashboard", "session=abc")).status, 307);
});

// --- route handler guard ---

test("private API denial: 503 unconfigured, 401 signed out, allowed only for an owner", () => {
  const unconfigured = denialResponse(false, true);
  assert.equal(unconfigured?.status, 503, "an owner flag must not override missing configuration");
  assert.equal(unconfigured?.headers.get("cache-control"), "private, no-store");
  assert.equal(denialResponse(true, false)?.status, 401);
  assert.equal(denialResponse(true, true), null);
});

// --- static coverage: no private entry point can skip the guard ---

test("every dashboard page and layout calls requireOwner()", () => {
  const files = walk(path.join(root, "app", "dashboard"), /^(page|layout)\.tsx$/);
  assert.ok(files.length >= DASHBOARD_NAV.length + 2);
  for (const f of files) assert.match(fs.readFileSync(f, "utf8"), /requireOwner\(\)/, `${path.relative(root, f)} must call requireOwner()`);
});

test("every private route handler uses the owner guard", () => {
  const files = walk(path.join(root, "app", "api", "private"), /^route\.ts$/);
  assert.ok(files.length > 0);
  for (const f of files) assert.match(fs.readFileSync(f, "utf8"), /ownerOrDenial\(\)/, `${path.relative(root, f)} must call ownerOrDenial()`);
});

test("server actions in the app assert authorization or are auth flows", () => {
  const files = walk(path.join(root, "app"), /\.tsx?$/).filter((f) => fs.readFileSync(f, "utf8").includes('"use server"'));
  for (const f of files) {
    const rel = path.relative(root, f).replaceAll("\\", "/");
    const src = fs.readFileSync(f, "utf8");
    const isAuthFlow = rel === "app/(site)/login/page.tsx" || rel === "app/dashboard/layout.tsx";
    assert.ok(isAuthFlow || /assertOwner\(\)/.test(src), `${rel} has an unguarded server action`);
  }
});

test("the 13 required destinations exist, are linked, and have pages", () => {
  const required = ["Projects", "Live Apps", "GitHub", "Vercel", "Notion", "Revenue", "Investors", "Hospitality", "Kai Korsou", "GPT Innovation", "JobHunter", "AI Stack", "Settings"];
  assert.deepEqual(DASHBOARD_NAV.map((n) => n.label), required);
  for (const n of DASHBOARD_NAV) assert.ok(fs.existsSync(path.join(root, "app", n.href, "page.tsx")), `${n.href} has no page`);
});

test("active navigation matches exact and nested dashboard routes only", () => {
  assert.equal(isActivePath("/dashboard", "/dashboard"), true);
  assert.equal(isActivePath("/dashboard/github", "/dashboard"), false);
  assert.equal(isActivePath("/dashboard/projects/abc", "/dashboard/projects"), true);
  assert.equal(isActivePath("/dashboard/projects-x", "/dashboard/projects"), false);
});

test("public site code never touches private data or provider adapters", () => {
  const files = [...walk(path.join(root, "app", "(site)"), /\.tsx?$/), path.join(root, "components", "command-palette.tsx"), path.join(root, "data", "search-index.ts")];
  for (const f of files) {
    const src = fs.readFileSync(f, "utf8");
    const rel = path.relative(root, f);
    assert.doesNotMatch(src, /lib\/integrations|\bREGISTRY\b|notionUrl|ownerGate|nextDecision|REVENUE_STREAMS/, `${rel} references private data`);
  }
});

test("client components do not import provider adapters, the full registry or secrets", () => {
  const files = walk(path.join(root, "components"), /\.tsx$/).concat(walk(path.join(root, "app"), /\.tsx$/));
  for (const f of files) {
    const src = fs.readFileSync(f, "utf8");
    if (!/^["']use client["']/.test(src.trimStart())) continue;
    assert.doesNotMatch(src, /lib\/integrations|\bREGISTRY\b|process\.env/, `${path.relative(root, f)} is a client component touching server-only data`);
  }
});

test("secrets are only read in server modules and .env files stay untracked", () => {
  const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
  assert.match(gitignore, /\.env\*/);
  assert.match(gitignore, /!\.env\.example/);
  const example = fs.readFileSync(path.join(root, ".env.example"), "utf8");
  for (const line of example.split("\n")) if (/^[A-Z_]+=/.test(line)) assert.match(line, /^[A-Z_]+=$/, `.env.example must not contain values: ${line.split("=")[0]}`);
  for (const f of walk(path.join(root, "lib", "integrations"), /\.ts$/).filter((x) => !x.endsWith("types.ts") && !x.endsWith("http.ts") && !x.endsWith("cache.ts"))) {
    assert.match(fs.readFileSync(f, "utf8"), /import "server-only"/, `${path.relative(root, f)} must be server-only`);
  }
});
