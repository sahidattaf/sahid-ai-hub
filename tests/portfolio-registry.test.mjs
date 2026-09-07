import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(new URL("../data/project-registry.ts", import.meta.url), "utf8");

test("Registry v2 defines governance fields", () => {
  for (const field of ["portfolioStream", "assetType", "operatingStatus", "commercialStatus", "evidenceStatus", "nextAction", "lastReviewed"]) assert.match(source, new RegExp(field));
});

test("Top portfolio assets are classified", () => {
  for (const id of ["gpt-innovation-os", "bossa-asado-i-mar", "kai-korsou-waterfront", "sahid-ai-hub"]) assert.match(source, new RegExp(`id:\\"${id}\\"`));
});

test("Registry v2.1 includes reconciled canonical assets and routing", () => {
  for (const id of ["ai-marketing-tools", "piska-ecosystem", "digital-korsou"]) assert.match(source, new RegExp(`id:\\"${id}\\"`));
  assert.match(source, /relatedRepositories\?: string\[\]/);
  assert.match(source, /AI-Marketing-Tools-Agent/);
  assert.match(source, /piska-gpts-ecosystem/);
  assert.match(source, /digitalKorsou/);
});

test("Runtime registry validation covers URLs, related repositories, duplicate ids and parent references", () => {
  assert.match(source, /invalid \$\{label\}/);
  assert.match(source, /invalid relatedRepositories URL/);
  assert.match(source, /duplicate id/);
  assert.match(source, /unknown parent/);
  assert.match(source, /REGISTRY_VALIDATION_ERRORS/);
});

test("No placeholder navigation links are stored in registry data", () => {
  assert.doesNotMatch(source, /notionUrl:\s*["']#["']/);
  assert.doesNotMatch(source, /githubUrl:\s*["']#["']/);
  assert.doesNotMatch(source, /websiteUrl:\s*["']#["']/);
});

test("Sahid AI Hub no longer carries the pre-merge next action", () => {
  assert.doesNotMatch(source, /Complete Portfolio Registry v2 and stop for owner review before merge or deploy/);
  assert.match(source, /Maintain Registry v2\.1 accuracy/);
});
