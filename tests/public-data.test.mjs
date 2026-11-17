// Offline tests for the public-data boundary. This repository is PUBLIC, so
// these tests check what is committed, not what the server hides. Plain
// `node --test`: no network, no environment files. data/projects.ts is loaded
// by transpiling it in memory (TypeScript is a dev dependency).
//
// No client names, client identifiers or hashes of them appear in this file.
// Optional leak scan: set LEAK_TERMS_FILE to a local file (outside the repo)
// with one forbidden term per line; without it that one test is skipped.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

// ---------- policy (the allowlist) ----------

const PUBLIC_KEYS = ["id", "name", "zone", "assetType", "status", "description", "websiteUrl", "githubUrl", "category", "stack", "tags"];
const REQUIRED_PUBLIC_KEYS = ["id", "name", "zone", "assetType", "status", "description", "category", "stack", "tags"];
const FORBIDDEN_FIELDS = [
  "ownerGate", "nextDecision", "nextAction", "notionUrl", "vercelProject", "relatedRepositories", "priority", "evidenceStatus",
  "commercialStatus", "revenuePotential", "operatingStatus", "visibility", "parentProject", "lastReviewed", "owner", "portfolioStream",
];
// Repositories verified public. Any other github.com/sahidattaf/<repo> link in published source is rejected.
const APPROVED_REPOS = new Set(
  [
    "gpt-innovation-os", "AI-Marketing-Tools-Agent", "ai_-marketing-_tools-_agent", "BOSSA-ASADO-I-MAR", "bossa-ai-os",
    "digital-korsou-boske-ai", "reflexhon-global", "sahid-ai-hub", "jobhunter-gpt", "dreamscape",
  ].map((r) => r.toLowerCase()),
);

function zonesFromSource() {
  const m = read("data/public-projects.ts").match(/ZONE_ORDER = \[([^\]]+)\]/);
  assert.ok(m, "ZONE_ORDER not found");
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

/** Returns a list of violations; empty means the data is publishable. */
function checkPublicData(data, zones) {
  const v = [];
  const ids = new Set();
  // Non-public projects are not listed at all, not even by name.
  if (Object.keys(data).some((k) => k !== "public")) v.push('data may only have a "public" list (no namesOnly or other lists)');
  for (const p of data.public ?? []) {
    for (const k of Object.keys(p)) if (!PUBLIC_KEYS.includes(k)) v.push(`public ${p.id}: key "${k}" is not on the allowlist`);
    for (const k of REQUIRED_PUBLIC_KEYS) if (p[k] === undefined) v.push(`public ${p.id}: missing "${k}"`);
    if (p.websiteUrl !== undefined && !/^https:\/\//.test(p.websiteUrl)) v.push(`public ${p.id}: websiteUrl must be https`);
    if (p.githubUrl !== undefined) {
      const m = p.githubUrl.match(/^https:\/\/github\.com\/sahidattaf\/([A-Za-z0-9_.-]+)$/);
      if (!m || !APPROVED_REPOS.has(m[1].toLowerCase())) v.push(`public ${p.id}: githubUrl is not an approved public repository`);
    }
    if (p.assetType === "Client") v.push(`public ${p.id}: a client-type project must not be a public entry`);
    if (!zones.includes(p.zone)) v.push(`public ${p.id}: unknown zone`);
    if (ids.has(p.id)) v.push(`duplicate id ${p.id}`);
    ids.add(p.id);
  }
  const text = JSON.stringify(data);
  for (const f of FORBIDDEN_FIELDS) if (new RegExp(`"${f}"\\s*:`).test(text)) v.push(`forbidden field "${f}" present`);
  if (/notion\.(so|com)|\b[0-9a-f]{32}\b/i.test(text)) v.push("Notion URL or 32-character id present");
  return v;
}

// ---------- the checker itself, on synthetic data ----------

const ZONES = ["Alpha", "Beta"];
const goodPublic = { id: "demo-app", name: "Demo App", zone: "Alpha", assetType: "Product", status: "Live", description: "A synthetic demo.", websiteUrl: "https://demo.example.app/", githubUrl: "https://github.com/sahidattaf/sahid-ai-hub", category: "Demo", stack: ["X"], tags: ["t"] };

test("checker: clean synthetic data passes", () => {
  assert.deepEqual(checkPublicData({ public: [goodPublic] }, ZONES), []);
});

test("checker: internal fields on a public entry are rejected", () => {
  for (const field of ["ownerGate", "nextDecision", "nextAction", "notionUrl", "vercelProject", "priority", "evidenceStatus", "relatedRepositories"]) {
    const v = checkPublicData({ public: [{ ...goodPublic, [field]: "x" }] }, ZONES);
    assert.ok(v.some((m) => m.includes(field)), `${field} should be rejected`);
  }
});

test("checker: a namesOnly list (or any other list) is rejected, so private names cannot come back", () => {
  const v = checkPublicData({ public: [], namesOnly: [{ id: "a", name: "A", zone: "Beta", assetType: "Venture" }] }, ZONES);
  assert.ok(v.some((m) => m.includes("namesOnly")));
  assert.ok(checkPublicData({ public: [], hidden: [] }, ZONES).length);
});

test("checker: Notion URLs, ids, unapproved repositories and unknown zones are rejected", () => {
  assert.ok(checkPublicData({ public: [{ ...goodPublic, description: "see https://app.notion.com/p/abc" }] }, ZONES).length);
  assert.ok(checkPublicData({ public: [{ ...goodPublic, description: "id 0123456789abcdef0123456789abcdef" }] }, ZONES).length);
  assert.ok(checkPublicData({ public: [{ ...goodPublic, githubUrl: "https://github.com/sahidattaf/some-private-repo" }] }, ZONES).length);
  assert.ok(checkPublicData({ public: [{ ...goodPublic, zone: "Nowhere" }] }, ZONES).length);
});

test("checker: a client-type project is never a public entry", () => {
  assert.ok(checkPublicData({ public: [{ ...goodPublic, assetType: "Client" }] }, ZONES).length);
});

// ---------- the real public data ----------

const data = JSON.parse(read("data/public-projects.json"));

test("real data passes the allowlist checker", () => {
  assert.deepEqual(checkPublicData(data, zonesFromSource()), []);
});

test("real data has only the public list and no names-only or client entries", () => {
  assert.deepEqual(Object.keys(data), ["public"]);
  assert.equal(data.public.length, 10);
  assert.equal(data.public.filter((p) => p.assetType === "Client").length, 0);
  assert.equal("namesOnly" in data, false);
});

// ---------- the published tree ----------

const TEXT_EXT = /\.(ts|tsx|js|jsx|mjs|json|md|css|yml|yaml|txt)$/;
function publishedFiles() {
  const out = execFileSync("git", ["ls-files", "-co", "--exclude-standard"], { cwd: root, encoding: "utf8" });
  return out.split("\n").filter((f) => f && TEXT_EXT.test(f) && f !== "package-lock.json" && fs.existsSync(path.join(root, f)));
}
const SOURCE = () => publishedFiles().filter((f) => !f.startsWith("tests/"));
// nextAction (internal to-do text) must not be published anywhere.
const NEXT_ACTION_OK = new Set([]);

test("namesOnly no longer exists anywhere in the published source", () => {
  const hits = SOURCE().filter((f) => /namesOnly|getNameOnlyProjects|NameOnlyProject|private-project-names|UNDISCLOSED_ZONE/.test(read(f)));
  assert.deepEqual(hits, []);
  assert.equal(fs.existsSync(path.join(root, "components/private-project-names.tsx")), false);
});

test("published source contains no internal registry fields", () => {
  const re = /ownerGate|nextDecision|notionUrl|evidenceStatus|commercialStatus|revenuePotential|operatingStatus|relatedRepositories|portfolioStream|lastReviewed|parentProject/;
  const hits = SOURCE().filter((f) => re.test(read(f)));
  assert.deepEqual(hits, []);
});

test("nextAction does not appear in the published source", () => {
  const hits = SOURCE().filter((f) => /nextAction/.test(read(f)) && !NEXT_ACTION_OK.has(f));
  assert.deepEqual(hits, []);
});

test("published source contains no Notion page URLs or 32-character ids", () => {
  // api.notion.com (the server-side API host in data/projects.ts) is not a page URL.
  const hits = SOURCE().filter((f) => /(?<!api\.)notion\.(so|com)\/|\b[0-9a-f]{32}\b/i.test(read(f)));
  assert.deepEqual(hits, []);
});

test("every GitHub repository link in published source is an approved public repository", () => {
  const bad = [];
  for (const f of SOURCE()) {
    for (const m of read(f).matchAll(/github\.com\/sahidattaf\/([A-Za-z0-9_.-]+)/g)) {
      if (!APPROVED_REPOS.has(m[1].toLowerCase())) bad.push(`${f}: ${m[1]}`);
    }
  }
  assert.deepEqual(bad, []);
});

// ---------- routes ----------

test("public routes still exist and read only the public data", () => {
  for (const f of ["app/projects/page.tsx", "app/projects/[id]/page.tsx", "app/registry/page.tsx", "app/live-apps/page.tsx", "app/github/page.tsx", "app/vercel/page.tsx", "app/revenue/page.tsx", "app/integrations/page.tsx"]) {
    assert.ok(fs.existsSync(path.join(root, f)), `${f} must still exist`);
  }
  assert.equal(fs.existsSync(path.join(root, "data/project-registry.ts")), false, "the internal registry module must be gone");
  for (const f of SOURCE().filter((f) => /\.(ts|tsx)$/.test(f))) assert.doesNotMatch(read(f), /data\/project-registry/, `${f} imports the removed internal registry`);
  for (const f of ["app/projects/page.tsx", "app/projects/[id]/page.tsx", "app/registry/page.tsx", "app/live-apps/page.tsx"]) assert.match(read(f), /data\/public-projects/, `${f} should read the public data`);
});

test("project detail pages are generated for public projects only", () => {
  const src = read("app/projects/[id]/page.tsx");
  assert.match(src, /dynamicParams\s*=\s*false/);
  assert.match(src, /getPublicProjects\(\)\.map/);
});

test("homepage numbers and zones come from the public data, not hard-coded", () => {
  const home = read("app/page.tsx");
  assert.match(home, /getPublicStats\(\)/);
  assert.doesNotMatch(home, /Six live applications|View all 6 projects|REVENUE_STREAMS|OS_DASHBOARD|\bZONES\b/);
});

// ---------- optional client-term scan (terms supplied locally, never committed) ----------

const termsFile = process.env.LEAK_TERMS_FILE;
test("no forbidden term from LEAK_TERMS_FILE appears anywhere in the published tree", { skip: !termsFile && "LEAK_TERMS_FILE not set (skipped, not passed)" }, () => {
  const terms = fs.readFileSync(termsFile, "utf8").split("\n").map((t) => t.trim().toLowerCase()).filter(Boolean);
  assert.ok(terms.length > 0, "terms file is empty");
  const hits = [];
  for (const f of publishedFiles()) {
    const text = read(f).toLowerCase();
    for (let i = 0; i < terms.length; i++) if (text.includes(terms[i])) hits.push(`${f}: term #${i + 1}`);
  }
  assert.deepEqual(hits, []);
});

// ---------- live integrations (tokens configured) ----------

test("the public site makes no live GitHub or Vercel calls and reads no provider tokens", () => {
  for (const f of ["lib/github.ts", "lib/github-api.ts", "lib/vercel.ts", "types/github.ts", "hooks/use-github.ts", "data/github-repositories.ts"]) {
    assert.equal(fs.existsSync(path.join(root, f)), false, `${f} (live integration code) must not be part of the public site`);
  }
  const hits = [];
  for (const f of SOURCE().filter((f) => /\.(ts|tsx|js|mjs)$/.test(f) && !f.startsWith("scripts/"))) {
    const text = read(f);
    const notionOk = f === "data/projects.ts"; // the one server-side, allowlisted Notion reader
    if (/process\.env\.(GITHUB_TOKEN|VERCEL_TOKEN|VERCEL_TEAM_ID)/.test(text) || (!notionOk && /process\.env\.NOTION_TOKEN/.test(text))) hits.push(`${f}: reads a provider token`);
    if (/api\.github\.com|api\.vercel\.com/.test(text) || (!notionOk && /api\.notion\.com/.test(text))) hits.push(`${f}: calls a provider API`);
    if (/@\/(lib\/(github|vercel)|types\/github|hooks\/use-github|components\/(github|vercel))/.test(text)) hits.push(`${f}: imports live integration code`);
  }
  assert.deepEqual(hits, []);
});

test("/github is a static list of approved public repositories; /vercel redirects to /live-apps", () => {
  const github = read("app/github/page.tsx");
  assert.match(github, /getPublicProjects\(\)/, "/github must be built from the public data");
  assert.doesNotMatch(github, /https?:\/\//, "/github must not hard-code links");
  const vercel = read("app/vercel/page.tsx");
  assert.match(vercel, /redirect\("\/live-apps"\)/);
  assert.doesNotMatch(vercel, /fetch\(|process\.env/);
});

// ---------- public wording: no internal portfolio decisions ----------

const INTERNAL_WORDING = /\b(top 3|founder|parked|retained|reconcil\w*|evidence|controlled|acquisition|proof environment|capacity|owner-side)\b/i;

test("public descriptions, tags and zone text contain no internal-decision wording", () => {
  const strings = [];
  for (const p of data.public) strings.push(p.name, p.description ?? "", ...(p.tags ?? []), ...(p.stack ?? []));
  const zones = read("data/public-projects.ts").match(/ZONE_DESCRIPTIONS[^=]*=\s*\{([\s\S]*?)\n\};/);
  assert.ok(zones, "ZONE_DESCRIPTIONS not found");
  strings.push(...[...zones[1].matchAll(/:\s*"([^"]+)"/g)].map((m) => m[1]));
  const search = read("data/search-index.ts");
  strings.push(...[...search.matchAll(/category:\s*"Projects",\s*description:\s*"([^"]*)"/g)].map((m) => m[1]));
  assert.ok(strings.length > 30, "too few strings were checked");
  assert.deepEqual(strings.filter((s) => INTERNAL_WORDING.test(s)), []);
});

// ---------- search index (command palette, Ctrl+K) ----------

test("search index: every project entry is a public project with a detail page; nothing is listed by name only", () => {
  const publicIds = new Set(data.public.map((p) => p.id));
  const src = read("data/search-index.ts");
  const re = /id:\s*"(proj-[^"]+)",\s*title:\s*"([^"]+)",\s*category:\s*"Projects",\s*description:\s*"([^"]*)",\s*url:\s*"([^"]*)"/g;
  let seen = 0;
  for (const m of src.matchAll(re)) {
    seen++;
    const [, id, , description, url] = m;
    const detail = url.match(/^\/projects\/(.+)$/);
    assert.ok(detail, `${id}: project entries must link to a public detail page, not the list`);
    assert.ok(publicIds.has(detail[1]), `${id}: links to a non-public detail page`);
    assert.doesNotMatch(description, /name only|not public/i, `${id}: no name-only wording`);
  }
  assert.ok(seen >= 8, "search index project entries were not parsed");
  assert.equal([...src.matchAll(/id:\s*"proj-/g)].length, seen, "every proj- entry must be parsed (and therefore public)");
  assert.doesNotMatch(src, /Listed by name only|namesOnly/);
});

test("search index: every /projects/<id> link points to a public project", () => {
  const publicIds = new Set(data.public.map((p) => p.id));
  const src = read("data/search-index.ts");
  for (const m of src.matchAll(/url:\s*"\/projects\/([^"]+)"/g)) assert.ok(publicIds.has(m[1]), `search links to a non-public detail page: ${m[1]}`);
});

test("search index: no internal revenue, client, CRM, document or Notion wording", () => {
  const src = read("data/search-index.ts");
  assert.doesNotMatch(src, /\b(mrr|arr|subscriptions|crm|contracts|decisions|health scores)\b/i);
  assert.doesNotMatch(src, /notion/i);
});

test("public data modules carry no revenue model, env var names, safety rules or per-module next actions", () => {
  assert.doesNotMatch(read("data/command-center.ts"), /howItEarns|incomeType|OS_DASHBOARD|ZONES\b/);
  assert.doesNotMatch(read("data/integrations.ts"), /envVars|safetyRule|sprintTarget|futureData|_KEY|_TOKEN/);
  assert.doesNotMatch(read("data/executive-modules.ts"), /nextAction|publicSafe/);
  assert.doesNotMatch(read("app/integrations/page.tsx") + read("components/integration-card.tsx"), /envVars|safetyRule|Environment variables/);
});

// ---------- homepage fallback and Notion data (data/projects.ts) ----------

function loadTs(rel, stubs) {
  const out = ts.transpileModule(read(rel), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const mod = { exports: {} };
  const req = (id) => {
    if (id in stubs) return stubs[id];
    throw new Error(`${rel}: unexpected import "${id}"`);
  };
  new Function("require", "module", "exports", out)(req, mod, mod.exports);
  return mod.exports;
}
const publicMod = loadTs("data/public-projects.ts", { "./public-projects.json": data });
const projectsMod = loadTs("data/projects.ts", { "server-only": {}, "next/cache": { unstable_cache: (fn) => fn }, "@/data/public-projects": publicMod });

const PROJECT_KEYS = ["category", "description", "live", "repo", "status", "tags", "techStack", "title", "visibility", "zone"];
const ALLOWED_TITLES = new Set(data.public.map((p) => p.name));
const ALLOWED_URLS = new Set(data.public.flatMap((p) => [p.websiteUrl, p.githubUrl].filter(Boolean)));

function assertOnlyAllowlisted(projects) {
  assert.equal(projects.length, data.public.length);
  for (const p of projects) {
    assert.deepEqual(Object.keys(p).filter((k) => p[k] !== undefined).sort(), PROJECT_KEYS.filter((k) => p[k] !== undefined).sort());
    assert.ok(ALLOWED_TITLES.has(p.title), `title not on the allowlist: ${p.title}`);
    assert.equal(p.visibility, "Public");
    for (const u of [p.live, p.repo].filter(Boolean)) assert.ok(ALLOWED_URLS.has(u), `URL not on the allowlist: ${u}`);
    const pub = data.public.find((x) => x.name === p.title);
    assert.equal(p.description, pub.description);
    assert.equal(p.zone, pub.zone);
    assert.deepEqual(p.techStack, pub.stack);
  }
}

test("homepage fallback is exactly the public allowlist (getPublicProjects), nothing more", () => {
  const fb = projectsMod.getFallbackProjects();
  assertOnlyAllowlisted(fb);
  assert.deepEqual(new Set(fb.map((p) => p.title)), ALLOWED_TITLES);
  assert.ok(fb.every((p) => ["Live", "Repo", "Prototype", "Planning"].includes(p.status)));
  assert.match(read("data/projects.ts"), /getPublicProjects\(\)/);
  assert.doesNotMatch(read("data/projects.ts"), /FALLBACK_PROJECTS|ai-marketing-tools-six|ai_-marketing-_tools-_agent/, "the old hard-coded snapshot must be gone");
});

const DB_ID = "0123456789abcdef0123456789abcdef";
const row = (slug, status, extra = {}) => ({
  archived: false,
  properties: {
    Slug: { rich_text: [{ plain_text: slug }] },
    Status: { select: { name: status } },
    "Project Name": { title: [{ plain_text: extra.name ?? "From Notion" }] },
    "Live App URL": { url: extra.live ?? null },
    "Repository URL": { url: extra.repo ?? null },
    Priority: { select: { name: "P0 internal" } },
    "Next Action": { rich_text: [{ plain_text: "INTERNAL-NEXT-ACTION" }] },
  },
});

async function withNotion(responder, fn) {
  const saved = { fetch: globalThis.fetch, token: process.env.NOTION_TOKEN, db: process.env.NOTION_DATABASE_ID, err: console.error };
  process.env.NOTION_TOKEN = "test-token";
  process.env.NOTION_DATABASE_ID = DB_ID;
  console.error = () => {};
  globalThis.fetch = async () => responder();
  try {
    return await fn();
  } finally {
    globalThis.fetch = saved.fetch;
    console.error = saved.err;
    if (saved.token === undefined) delete process.env.NOTION_TOKEN;
    else process.env.NOTION_TOKEN = saved.token;
    if (saved.db === undefined) delete process.env.NOTION_DATABASE_ID;
    else process.env.NOTION_DATABASE_ID = saved.db;
  }
}
const ok = (results) => new Response(JSON.stringify({ results, has_more: false }), { status: 200, headers: { "content-type": "application/json" } });

test("Notion data: a synthetic project outside the allowlist cannot appear, and Notion cannot change displayed fields", async () => {
  const rows = [
    row("secret-client-project", "Live", { name: "SYNTHETIC-OUTSIDER", live: "https://outsider.example.com/", repo: "https://github.com/sahidattaf/outsider" }),
    row("jobhunter-gpt", "Prototype", { name: "HIJACKED NAME", live: "https://evil.example.com/", repo: "https://github.com/sahidattaf/hijack" }),
    row("bossa-ai-os", "Not-A-Status"),
  ];
  const result = await withNotion(() => ok(rows), () => projectsMod.getProjectsWithSource());
  assert.equal(result.source, "notion");
  assertOnlyAllowlisted(result.projects);
  const text = JSON.stringify(result.projects);
  for (const leak of ["SYNTHETIC-OUTSIDER", "outsider", "secret-client-project", "HIJACKED", "evil.example.com", "hijack", "INTERNAL-NEXT-ACTION", "P0 internal"]) {
    assert.ok(!text.includes(leak), `leaked from Notion: ${leak}`);
  }
  const hunter = result.projects.find((p) => p.title === "JobHunterGPT");
  assert.equal(hunter.status, "Prototype", "a valid Notion status is applied to an allowlisted project");
  const bossa = result.projects.find((p) => p.title === "BOSSA AI OS");
  assert.equal(bossa.status, data.public.find((p) => p.id === "bossa-ai-os").status, "an invalid Notion status is ignored");
});

test("Notion data: a registry with only non-allowlisted rows falls back to the allowlist", async () => {
  const result = await withNotion(() => ok([row("secret-client-project", "Live"), row("another-outsider", "Repo")]), () => projectsMod.getProjectsWithSource());
  assert.equal(result.source, "fallback");
  assertOnlyAllowlisted(result.projects);
  assert.ok(!JSON.stringify(result.projects).includes("outsider"));
});

test("Notion data: auth errors, bad responses and missing config fall back to the allowlist and never throw", async () => {
  for (const responder of [() => new Response("{}", { status: 401 }), () => new Response("not json", { status: 200 }), () => new Response(JSON.stringify({ nope: 1 }), { status: 200 })]) {
    const result = await withNotion(responder, () => projectsMod.getProjectsWithSource());
    assert.equal(result.source, "fallback");
    assertOnlyAllowlisted(result.projects);
  }
  const saved = { token: process.env.NOTION_TOKEN, db: process.env.NOTION_DATABASE_ID, err: console.error };
  delete process.env.NOTION_TOKEN;
  delete process.env.NOTION_DATABASE_ID;
  console.error = () => {};
  try {
    const result = await projectsMod.getProjectsWithSource();
    assert.equal(result.source, "fallback");
    assertOnlyAllowlisted(result.projects);
  } finally {
    console.error = saved.err;
    if (saved.token !== undefined) process.env.NOTION_TOKEN = saved.token;
    if (saved.db !== undefined) process.env.NOTION_DATABASE_ID = saved.db;
  }
});

test("Notion data: archived and incomplete rows are ignored; only Slug and Status are read", () => {
  assert.equal(projectsMod.parseRow({ ...row("jobhunter-gpt", "Live"), archived: true }), null);
  assert.equal(projectsMod.parseRow(row("", "Live")), null);
  assert.deepEqual({ ...projectsMod.parseRow(row("jobhunter-gpt", "Live")) }, { slug: "jobhunter-gpt", status: "Live" });
  assert.match(read("data/projects.ts"), /const PROP = \{\s*slug: "Slug",\s*status: "Status",\s*\} as const;/);
});

test("owner portfolio reads only after owner authentication and excludes invalid rows", async () => {
  let authenticated = false;
  let reads = 0;
  const ownerMod = loadTs("lib/owner-portfolio.ts", {
    "server-only": {},
    "@/lib/owner-auth": { hasOwnerSession: async () => authenticated },
    "@/data/projects": {
      ...projectsMod,
      readRegistryRows: async (parse, slug) => {
        reads++;
        assert.equal(slug, "owner-demo");
        return [
          { properties: { Slug: { rich_text: [{ plain_text: "owner-demo" }] },
            "Project Name": { title: [{ plain_text: "Synthetic owner entry" }] },
            "Next Action": { rich_text: [{ plain_text: "Review the evidence" }] },
            "Repository URL": { url: "https://example.com/untrusted" } } },
          { properties: { "Project Name": { title: [{ plain_text: "Incomplete" }] } } },
        ].map(parse).filter(Boolean);
      },
    },
  });

  assert.deepEqual(await ownerMod.loadOwnerPortfolio("owner-demo"), { state: "signed-out" });
  assert.equal(reads, 0);
  authenticated = true;
  const result = await ownerMod.loadOwnerPortfolio("owner-demo");
  assert.equal(reads, 1);
  assert.equal(result.state, "ready");
  assert.deepEqual(result.projects.map(({ name, action, repository }) => [name, action, repository]),
    [["Synthetic owner entry", "Review the evidence", undefined]]);
});
