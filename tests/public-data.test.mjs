// Offline tests for the public-data boundary. This repository is PUBLIC, so
// these tests check what is committed, not what the server hides. Plain
// `node --test`: no TypeScript runtime, no network, no environment files.
//
// No client names, client identifiers or hashes of them appear in this file.
// Optional leak scan: set LEAK_TERMS_FILE to a local file (outside the repo)
// with one forbidden term per line; without it that one test is skipped.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

// ---------- policy (the allowlist) ----------

const PUBLIC_KEYS = ["id", "name", "zone", "assetType", "status", "description", "websiteUrl", "githubUrl", "category", "stack", "tags"];
const REQUIRED_PUBLIC_KEYS = ["id", "name", "zone", "assetType", "status", "description", "category", "stack", "tags"];
const NAME_ONLY_KEYS = ["id", "name", "zone", "assetType"];
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
const CLIENT_PLACEHOLDER = { id: "private-client-project", name: "Private client project", zone: "Undisclosed", assetType: "Client" };

function zonesFromSource() {
  const m = read("data/public-projects.ts").match(/ZONE_ORDER = \[([^\]]+)\]/);
  assert.ok(m, "ZONE_ORDER not found");
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]).concat(m[1].includes("UNDISCLOSED_ZONE") ? ["Undisclosed"] : []);
}

/** Returns a list of violations; empty means the data is publishable. */
function checkPublicData(data, zones) {
  const v = [];
  const ids = new Set();
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
  for (const p of data.namesOnly ?? []) {
    const keys = Object.keys(p).sort().join(",");
    if (keys !== [...NAME_ONLY_KEYS].sort().join(",")) v.push(`namesOnly ${p.id}: must have exactly ${NAME_ONLY_KEYS.join(", ")}`);
    if (!zones.includes(p.zone)) v.push(`namesOnly ${p.id}: unknown zone`);
    if (ids.has(p.id)) v.push(`duplicate id ${p.id}`);
    ids.add(p.id);
  }
  const text = JSON.stringify(data);
  for (const f of FORBIDDEN_FIELDS) if (new RegExp(`"${f}"\\s*:`).test(text)) v.push(`forbidden field "${f}" present`);
  if (/notion\.(so|com)|\b[0-9a-f]{32}\b/i.test(text)) v.push("Notion URL or 32-character id present");
  const clients = (data.namesOnly ?? []).filter((p) => p.assetType === "Client");
  for (const c of clients) if (JSON.stringify(c) !== JSON.stringify(CLIENT_PLACEHOLDER)) v.push("client entry must be exactly the neutral placeholder");
  return v;
}

// ---------- the checker itself, on synthetic data ----------

const ZONES = ["Alpha", "Beta", "Undisclosed"];
const goodPublic = { id: "demo-app", name: "Demo App", zone: "Alpha", assetType: "Product", status: "Live", description: "A synthetic demo.", websiteUrl: "https://demo.example.app/", githubUrl: "https://github.com/sahidattaf/sahid-ai-hub", category: "Demo", stack: ["X"], tags: ["t"] };
const goodNames = [{ id: "secret-thing", name: "Secret Thing", zone: "Beta", assetType: "Venture" }, { ...CLIENT_PLACEHOLDER }];

test("checker: clean synthetic data passes", () => {
  assert.deepEqual(checkPublicData({ public: [goodPublic], namesOnly: goodNames }, ZONES), []);
});

test("checker: internal fields on a public entry are rejected", () => {
  for (const field of ["ownerGate", "nextDecision", "nextAction", "notionUrl", "vercelProject", "priority", "evidenceStatus", "relatedRepositories"]) {
    const v = checkPublicData({ public: [{ ...goodPublic, [field]: "x" }], namesOnly: [] }, ZONES);
    assert.ok(v.some((m) => m.includes(field)), `${field} should be rejected`);
  }
});

test("checker: names-only entries cannot carry descriptions or links", () => {
  for (const extra of [{ description: "d" }, { githubUrl: "https://github.com/sahidattaf/x" }, { notionUrl: "https://www.notion.so/x" }, { status: "Live" }]) {
    const v = checkPublicData({ public: [], namesOnly: [{ id: "a", name: "A", zone: "Beta", assetType: "Venture", ...extra }] }, ZONES);
    assert.ok(v.length > 0, JSON.stringify(extra));
  }
});

test("checker: Notion URLs, ids, unapproved repositories and unknown zones are rejected", () => {
  assert.ok(checkPublicData({ public: [{ ...goodPublic, description: "see https://app.notion.com/p/abc" }], namesOnly: [] }, ZONES).length);
  assert.ok(checkPublicData({ public: [{ ...goodPublic, description: "id 0123456789abcdef0123456789abcdef" }], namesOnly: [] }, ZONES).length);
  assert.ok(checkPublicData({ public: [{ ...goodPublic, githubUrl: "https://github.com/sahidattaf/some-private-repo" }], namesOnly: [] }, ZONES).length);
  assert.ok(checkPublicData({ public: [{ ...goodPublic, zone: "Nowhere" }], namesOnly: [] }, ZONES).length);
});

test("checker: a client-type project is never a public entry, and the client label is the neutral placeholder only", () => {
  assert.ok(checkPublicData({ public: [{ ...goodPublic, assetType: "Client" }], namesOnly: [] }, ZONES).length);
  const disguised = { ...CLIENT_PLACEHOLDER, name: "Some Real Client Ltd" };
  assert.ok(checkPublicData({ public: [], namesOnly: [disguised] }, ZONES).length);
  const withZone = { ...CLIENT_PLACEHOLDER, zone: "Alpha" };
  assert.ok(checkPublicData({ public: [], namesOnly: [withZone] }, ZONES).length, "placeholder keeps the Undisclosed zone");
});

// ---------- the real public data ----------

const data = JSON.parse(read("data/public-projects.json"));

test("real data passes the allowlist checker", () => {
  assert.deepEqual(checkPublicData(data, zonesFromSource()), []);
});

test("every project name is present: public entries plus names-only entries", () => {
  assert.equal(data.public.length, 10);
  assert.equal(data.namesOnly.length, 10);
  assert.ok(data.namesOnly.some((p) => p.name === "Piskadera Marketplace"), "Piskadera's name stays public (name only)");
  for (const p of [...data.public, ...data.namesOnly]) assert.ok(p.name.length > 0);
});

test("the client entry is the neutral placeholder with no identifying slug, links, description or zone", () => {
  const clients = [...data.public, ...data.namesOnly].filter((p) => p.assetType === "Client");
  assert.equal(clients.length, 1);
  assert.deepEqual(clients[0], CLIENT_PLACEHOLDER);
});

// ---------- the published tree ----------

const TEXT_EXT = /\.(ts|tsx|js|jsx|mjs|json|md|css|yml|yaml|txt)$/;
function publishedFiles() {
  const out = execFileSync("git", ["ls-files", "-co", "--exclude-standard"], { cwd: root, encoding: "utf8" });
  return out.split("\n").filter((f) => f && TEXT_EXT.test(f) && f !== "package-lock.json" && fs.existsSync(path.join(root, f)));
}
const SOURCE = () => publishedFiles().filter((f) => !f.startsWith("tests/"));
// Existing, unrelated uses of the word "nextAction" (module roadmap items, GitHub health hints), not project registry data.
const NEXT_ACTION_OK = new Set(["data/executive-modules.ts"]);

test("published source contains no internal registry fields", () => {
  const re = /ownerGate|nextDecision|notionUrl|evidenceStatus|commercialStatus|revenuePotential|operatingStatus|relatedRepositories|portfolioStream|lastReviewed|parentProject/;
  const hits = SOURCE().filter((f) => re.test(read(f)));
  assert.deepEqual(hits, []);
});

test("nextAction appears only in the known unrelated places", () => {
  const hits = SOURCE().filter((f) => /nextAction/.test(read(f)) && !NEXT_ACTION_OK.has(f));
  assert.deepEqual(hits, []);
});

test("published source contains no Notion page URLs or 32-character ids", () => {
  const hits = SOURCE().filter((f) => /notion\.(so|com)\/|\b[0-9a-f]{32}\b/i.test(read(f)));
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

test("search index sends non-public projects to the list, not to a detail page that does not exist", () => {
  const publicIds = new Set(data.public.map((p) => p.id));
  const src = read("data/search-index.ts");
  for (const m of src.matchAll(/url:\s*"\/projects\/([^"]+)"/g)) assert.ok(publicIds.has(m[1]), `search links to a non-public detail page: ${m[1]}`);
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
    if (/process\.env\.(GITHUB_TOKEN|VERCEL_TOKEN|VERCEL_TEAM_ID|NOTION_TOKEN)/.test(text)) hits.push(`${f}: reads a provider token`);
    if (/api\.github\.com|api\.vercel\.com|api\.notion\.com/.test(text)) hits.push(`${f}: calls a provider API`);
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
  for (const p of [...data.public, ...data.namesOnly]) {
    strings.push(p.name, p.description ?? "", ...(p.tags ?? []), ...(p.stack ?? []));
  }
  const zones = read("data/public-projects.ts").match(/ZONE_DESCRIPTIONS[^=]*=\s*\{([\s\S]*?)\n\};/);
  assert.ok(zones, "ZONE_DESCRIPTIONS not found");
  strings.push(...[...zones[1].matchAll(/:\s*"([^"]+)"/g)].map((m) => m[1]));
  const search = read("data/search-index.ts");
  strings.push(...[...search.matchAll(/category:\s*"Projects",\s*description:\s*"([^"]*)"/g)].map((m) => m[1]));
  assert.ok(strings.length > 40, "too few strings were checked");
  assert.deepEqual(strings.filter((s) => INTERNAL_WORDING.test(s)), []);
});

// ---------- search index (command palette) ----------

const fold = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

test("search index: non-public projects are name-only with name-derived keywords; no unlisted projects", () => {
  const publicIds = new Set(data.public.map((p) => p.id));
  const nameOnly = new Map(data.namesOnly.map((p) => [fold(p.name), p]));
  const src = read("data/search-index.ts");
  const re = /id:\s*"(proj-[^"]+)",\s*title:\s*"([^"]+)",\s*category:\s*"Projects",\s*description:\s*"([^"]*)",\s*url:\s*"([^"]*)",\s*icon:\s*"[^"]*",\s*keywords:\s*\[([^\]]*)\]/g;
  let seen = 0;
  for (const m of src.matchAll(re)) {
    seen++;
    const [, id, title, description, url, kw] = m;
    const detail = url.match(/^\/projects\/(.+)$/);
    if (detail) {
      assert.ok(publicIds.has(detail[1]), `${id}: links to a non-public detail page`);
      continue;
    }
    assert.ok(nameOnly.has(fold(title)), `${id}: "${title}" is neither a public project nor a listed name-only project`);
    assert.equal(description, "Listed by name only; details are not public", `${id}: non-public project must not have a description`);
    const keywords = [...kw.matchAll(/"([^"]+)"/g)].map((k) => fold(k[1]));
    for (const k of keywords) assert.ok(fold(title).includes(k), `${id}: keyword "${k}" is not part of the project name`);
  }
  assert.ok(seen >= 8, "search index project entries were not parsed");
});
