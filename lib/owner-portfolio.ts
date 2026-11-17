import "server-only";
import { isObj, readRegistryRows, richText, selectName } from "@/data/projects";
import { hasOwnerSession } from "@/lib/owner-auth";

function repositoryLink(value: unknown) {
  const raw = isObj(value) ? value.url : undefined;
  if (typeof raw !== "string") return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol === "https:" && url.host === "github.com" &&
        !url.username && !url.password &&
        /^\/[\w.-]+\/[\w.-]+\/?$/.test(url.pathname)) {
      return url.origin + url.pathname;
    }
  } catch {
    return undefined;
  }
}

export function validProjectSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 100;
}

export function parseOwnerProject(value: unknown) {
  if (!isObj(value) || !isObj(value.properties) ||
      value.archived === true || value.in_trash === true) return null;
  const p = value.properties;
  const slug = richText(p.Slug);
  const name = richText(p["Project Name"]);
  if (!validProjectSlug(slug) || !name) return null;
  return {
    slug,
    name,
    status: selectName(p.Status),
    evidence: selectName(p.Evidence),
    action: richText(p["Next Action"]),
    repository: repositoryLink(p["Repository URL"]),
  };
}

type PortfolioResult =
  | { state: "signed-out" }
  | { state: "unavailable" }
  | { state: "ready"; projects: NonNullable<ReturnType<typeof parseOwnerProject>>[] };

export async function loadOwnerPortfolio(slug?: string): Promise<PortfolioResult> {
  if (!await hasOwnerSession()) return { state: "signed-out" };

  try {
    const rows = await readRegistryRows(parseOwnerProject, slug);
    const projects = rows.filter(project => slug === undefined || project.slug === slug);
    if (new Set(projects.map(project => project.slug)).size !== projects.length) {
      return { state: "unavailable" };
    }
    return { state: "ready", projects: projects.sort((a, b) => a.name.localeCompare(b.name)) };
  } catch {
    return { state: "unavailable" };
  }
}
