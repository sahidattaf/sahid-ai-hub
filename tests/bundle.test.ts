// Post-build check: private registry content must not appear in anything the
// browser downloads. Skipped (not passed) when no production build exists;
// run `npm run build` first. CI/local verification order: build, then test.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { REGISTRY } from "../data/project-registry";

const staticDir = path.resolve(import.meta.dirname, "..", ".next", "static");

function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (/\.(js|css|html|json)$/.test(e.name)) out.push(full);
  }
  return out;
}

test("client bundles contain no private registry data", { skip: !fs.existsSync(staticDir) && "no .next build present" }, () => {
  const privateProjects = REGISTRY.filter((p) => p.visibility !== "Public");
  const needles = [
    ...privateProjects.flatMap((p) => [p.nextAction, p.notionUrl].filter((v): v is string => Boolean(v))),
    ...REGISTRY.flatMap((p) => [p.notionUrl, p.ownerGate, p.nextDecision].filter((v): v is string => Boolean(v))),
    "ownerGate",
    "nextDecision",
    "OWNER_GITHUB_IDS=",
  ];
  const offenders = new Set<string>();
  for (const file of walk(staticDir)) {
    const text = fs.readFileSync(file, "utf8");
    for (const n of needles) if (text.includes(n)) offenders.add(`${path.relative(staticDir, file)} contains ${n.slice(0, 50)}`);
  }
  assert.deepEqual([...offenders], []);
});
