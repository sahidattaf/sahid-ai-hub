import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  REGISTRY,
  ZONE_ORDER,
  getDeclaredLiveApps,
  getGithubTargets,
  getPublicProjects,
  getRegistryStats,
  getVercelTargets,
  getZoneSummaries,
  parseGithubRepo,
  validateRegistry,
} from "../data/project-registry";
import { SEARCH_INDEX } from "../data/search-index";

const root = path.resolve(import.meta.dirname, "..");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

test("registry validates and every zone is declared in ZONE_ORDER", () => {
  assert.deepEqual(validateRegistry(), []);
  for (const p of REGISTRY) assert.ok(ZONE_ORDER.includes(p.zone), `${p.id} has undeclared zone ${p.zone}`);
});

test("registry validation rejects duplicates, bad URLs and unknown parents", () => {
  const [a] = REGISTRY;
  const errors = validateRegistry([a, { ...a }, { ...a, id: "x", githubUrl: "not a url", parentProject: "missing" }]);
  assert.ok(errors.some((e) => e.includes("duplicate id")));
  assert.ok(errors.some((e) => e.includes("invalid githubUrl")));
  assert.ok(errors.some((e) => e.includes("unknown parent")));
});

test("no project definitions exist outside data/project-registry.ts", () => {
  const offenders: string[] = [];
  for (const file of [...walk(path.join(root, "app")), ...walk(path.join(root, "components")), ...walk(path.join(root, "lib")), ...walk(path.join(root, "data"))]) {
    if (file.endsWith(path.join("data", "project-registry.ts"))) continue;
    const src = fs.readFileSync(file, "utf8");
    // Project repo URLs (profile link without a repo path is fine) and deployed hosts.
    if (/github\.com\/sahidattaf\/[A-Za-z0-9_.-]+/.test(src) || /\.vercel\.app/.test(src)) offenders.push(path.relative(root, file));
  }
  assert.deepEqual(offenders, []);
  for (const legacy of ["data/projects.ts", "data/github-repositories.ts"]) assert.equal(fs.existsSync(path.join(root, legacy)), false, `${legacy} must stay deleted`);
});

test("counts are derived from the registry", () => {
  const stats = getRegistryStats();
  assert.equal(stats.total, REGISTRY.length);
  const zones = getZoneSummaries(REGISTRY);
  assert.equal(zones.reduce((n, z) => n + z.count, 0), REGISTRY.length);
  assert.equal(getGithubTargets().length, REGISTRY.filter((p) => parseGithubRepo(p.githubUrl)).length);
  assert.equal(getVercelTargets().length, REGISTRY.filter((p) => p.vercelProject).length);
});

test("declared live apps are a registry claim, separate from verified health", () => {
  const apps = getDeclaredLiveApps(REGISTRY);
  assert.ok(apps.length > 0);
  for (const app of apps) assert.ok(app.websiteUrl.startsWith("http"));
  // The registry has no health/verified field to confuse with the declaration.
  for (const p of REGISTRY) assert.equal("deploymentHealth" in p || "verified" in p, false);
});

test("parseGithubRepo handles repo URLs and rejects others", () => {
  assert.deepEqual(parseGithubRepo("https://github.com/sahidattaf/jobhunter-gpt"), { owner: "sahidattaf", repo: "jobhunter-gpt" });
  assert.deepEqual(parseGithubRepo("https://github.com/a/b.git"), { owner: "a", repo: "b" });
  assert.equal(parseGithubRepo("https://github.com/sahidattaf"), null);
  assert.equal(parseGithubRepo("https://example.com/a/b"), null);
  assert.equal(parseGithubRepo(undefined), null);
});

test("public projection contains only Public projects and no private fields", () => {
  const publicProjects = getPublicProjects();
  const publicIds = new Set(REGISTRY.filter((p) => p.visibility === "Public").map((p) => p.id));
  assert.deepEqual(new Set(publicProjects.map((p) => p.id)), publicIds);
  assert.ok(publicProjects.length < REGISTRY.length, "fixture should contain non-public projects");

  const forbidden = ["notionUrl", "ownerGate", "nextDecision", "nextAction", "commercialStatus", "revenuePotential", "evidenceStatus", "relatedRepositories", "visibility", "priority", "lastReviewed"];
  for (const p of publicProjects) for (const key of forbidden) assert.equal(key in p, false, `${p.id} leaks ${key}`);

  const serialized = JSON.stringify(publicProjects);
  assert.doesNotMatch(serialized, /notion\.com|notion\.so/);
  for (const p of REGISTRY.filter((x) => x.visibility !== "Public")) {
    assert.ok(!publicProjects.some((x) => x.name === p.name || x.id === p.id), `private project "${p.name}" appears in public data`);
    assert.ok(!serialized.includes(p.nextAction), `private nextAction of ${p.id} appears in public data`);
  }
});

test("the browser-bundled search index contains no private project", () => {
  const blob = JSON.stringify(SEARCH_INDEX);
  for (const p of REGISTRY.filter((x) => x.visibility !== "Public")) {
    assert.ok(!SEARCH_INDEX.some((i) => i.title === p.name || i.id === `project-${p.id}`), `${p.name} is in the search index`);
  }
  assert.doesNotMatch(blob, /revenue|investor|notion\.|"\/github"|"\/vercel"/i);
});
