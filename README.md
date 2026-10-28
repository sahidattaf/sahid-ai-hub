<img width="1265" height="1200" alt="image" src="https://github.com/user-attachments/assets/8feae620-80bc-4c54-a167-6dfad5dc516a" />
# Sahid AI Hub

AI Operating System dashboard and multi-page command center for everything Sahid Attaf builds with AI.

Project, zone and integration counts are derived from a single project registry.

## Sprint History

- **Sprint 1** — Public front door: static homepage, project showcase, live app links
- **Sprint 2** — OS Dashboard: status system, zone architecture, command center, revenue engine, roadmap
- **Sprint 3** — Multi-page routing: six dedicated pages, shared components, layout-level nav and footer
- **Sprint 4** — Integrations readiness: eight API integration specs with purpose, env vars, safety rules, and sprint targets
- **Sprint 5** — Live GitHub dashboard: profile, repos, language chart, aggregate stats — server-rendered from GitHub REST API
- **Sprint 6.1** — Project Registry foundation: `data/project-registry.ts` as single source of truth for 10 projects; `/registry` page with stats and zone-grouped cards; `/projects` and `/live-apps` updated to pull from registry
- **Sprint 6.2** — Live Vercel dashboard: `/vercel` route server-rendered from Vercel REST API; shows project status, frameworks, production URLs, deployment state, and commit info; graceful setup page when token is absent
- **Sprint 7** — Multi-page Command Center: authenticated `/dashboard` with a shared responsive sidebar (13 destinations); single project registry with a public projection; GitHub, Vercel and Notion adapters with honest failure states; owner-only authentication (Auth.js + GitHub OAuth, fail-closed)

## Stack

- **Framework:** Next.js 16, App Router, TypeScript
- **Styling:** Tailwind CSS v4
- **Authentication:** Auth.js (`next-auth` v5, pinned to `5.0.0-beta.32`) with GitHub OAuth and stateless JWT sessions
- **Deployment:** Vercel

## Routes

### Public (no sign-in)

| Route | Description |
| --- | --- |
| `/` | Overview derived from the **public** subset of the registry |
| `/projects`, `/projects/[id]` | Projects whose registry `visibility` is `Public`. Any other id is a 404 |
| `/live-apps` | Public projects with a **declared** production URL (not health-checked) |
| `/command-center`, `/roadmap`, `/about` | Static public pages |
| `/login` | Owner sign-in, or a setup state listing the missing variable names |

### Private (owner only)

All `/dashboard/*` routes and `/api/private/*` require the owner session. Sidebar destinations:

| Route | Content |
| --- | --- |
| `/dashboard` | Registry totals and integration setup status |
| `/dashboard/projects`, `/dashboard/projects/[id]` | Full registry, including private entries |
| `/dashboard/live-apps` | Declared URLs next to **verified** Vercel deployment state |
| `/dashboard/github` | Repository status from the GitHub API |
| `/dashboard/vercel` | Production state from the Vercel API compared with the registry |
| `/dashboard/notion` | Titles of explicitly configured pages / data sources |
| `/dashboard/revenue` | Declared commercial classification. No revenue figures are connected (setup state) |
| `/dashboard/investors` | No investor data is connected (setup state); lists registry entries that mention investors |
| `/dashboard/hospitality`, `/dashboard/kai-korsou`, `/dashboard/gpt-innovation`, `/dashboard/jobhunter` | Registry-backed project groups |
| `/dashboard/ai-stack` | Declared toolchain and technologies named in the registry |
| `/dashboard/settings` | Auth status, which environment variables are set (never their values), integration specs |
| `/api/private/integrations` | Integration status envelope (state, source, timestamps). No provider payloads |

Legacy URLs `/registry`, `/github`, `/vercel`, `/revenue`, `/integrations` redirect to their dashboard equivalents (and therefore to sign-in when signed out).

## Project registry

`data/project-registry.ts` is the only place projects are defined. Project lists, counts, zone summaries, GitHub targets, Vercel targets, the public pages and the command-palette search index are all derived from it. It is `server-only`, so it cannot be bundled into client code.

- `visibility: "Public"` is the only value treated as public. `Private` and `Hybrid` are owner-only.
- Public pages receive a `PublicProject` projection that omits Notion links, owner gates, decisions, next actions, commercial classification and evidence status.
- `websiteUrl` is a **declaration**. Deployment health appears only in the dashboard, from the Vercel API, and is labelled as verified provider data.

## Authentication and private data

- GitHub OAuth through Auth.js. Sign-in is refused unless the GitHub account's **numeric user ID** is in `OWNER_GITHUB_IDS`. The allowlist is re-checked on every session read.
- **Fail closed:** if any of `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `OWNER_GITHUB_IDS` is missing or the allowlist has no valid IDs, nobody is an owner: pages redirect to `/login` (setup state), `/api/private/*` returns 503.
- Defence in depth: `proxy.ts` is an optimistic cookie gate only. The authoritative check (`lib/auth/guard.ts`) runs in the dashboard layout, in **every** dashboard page, and in every private route handler. Tests fail if a page or handler omits it.
- All provider calls (`lib/integrations/*`) are server-only, use `cache: "no-store"` and a timeout, and never put tokens, provider bodies or request URLs into rendered output, errors or logs.
- Private responses are sent with `Cache-Control: private, no-store` and `X-Robots-Tag: noindex`.
- Known limit: sessions are stateless JWTs, so sign-out clears the cookie but does not revoke a stolen token before its 8-hour expiry. Removing an ID from `OWNER_GITHUB_IDS` takes effect immediately.
- Known limit: the integration cache is per server process (serverless instances do not share it), so "last successful fetch" reflects that instance.

## Integrations

Every integration page shows its **source**, the **last successful fetch time**, and **freshness**. A failed fetch is shown as a failure (with kind, safe message, retry-after if given, and last success time); it is never rendered as a zero count.

Handled failure kinds: not configured, unauthorized, forbidden, not found, rate limited (GitHub `403`/`429` with `x-ratelimit-remaining: 0` or `retry-after`, Notion/Vercel `429`), timeout (8s), provider outage (5xx), network error, malformed response, misconfiguration. Partial results (some repos or Notion scopes fail) keep the successes and flag each failure; totals only count what was read.

| Integration | API | Scope |
| --- | --- | --- |
| GitHub | REST `GET /repos/{owner}/{repo}` and `/commits?per_page=1` | Only repositories declared in the registry |
| Vercel | REST `GET /v10/projects` (paginated) | Compared with registry `vercelProject` names |
| Notion | `POST /v1/data_sources/{id}/query`, `GET /v1/pages/{id}` | Only IDs listed in `NOTION_DATA_SOURCE_IDS` / `NOTION_PAGE_IDS`; only title, link and edit time are read |

### Setup

1. `cp .env.example .env.local` (never overwrite an existing `.env.local`) and fill in values. Real values go only in `.env.local` or the Vercel project environment.
2. GitHub OAuth App (github.com/settings/developers): callback `<origin>/api/auth/callback/github`. Put its credentials in `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`; set `AUTH_SECRET` (`npx auth secret`); set `OWNER_GITHUB_IDS` to your numeric ID (`https://api.github.com/users/<username>` → `id`).
3. `GITHUB_TOKEN`: fine-grained PAT, read-only (Metadata, Contents) on the registry repositories.
4. `VERCEL_TOKEN` (and `VERCEL_TEAM_ID` for team projects).
5. Notion: internal integration with *Read content* only; share just the intended pages/databases with it; set `NOTION_TOKEN` plus the IDs.

## Environment variables

Names only; see `.env.example`. No values are committed.

| Variable | Required for | Description |
| --- | --- | --- |
| `AUTH_SECRET` | `/dashboard` | Session signing secret |
| `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` | `/dashboard` | GitHub OAuth App credentials |
| `OWNER_GITHUB_IDS` | `/dashboard` | Comma-separated numeric GitHub user IDs allowed to sign in |
| `GITHUB_TOKEN` | `/dashboard/github` | Read-only token |
| `VERCEL_TOKEN` | `/dashboard/vercel`, live-app verification | Read token |
| `VERCEL_TEAM_ID` | Team projects only | `team_…` |
| `NOTION_TOKEN` | `/dashboard/notion` | Internal integration token |
| `NOTION_DATA_SOURCE_IDS`, `NOTION_PAGE_IDS` | `/dashboard/notion` | Explicit scope (at least one) |
| `NOTION_API_VERSION` | Optional | Overrides the default `Notion-Version` (`2025-09-03`) |

## Structure

```text
app/
  layout.tsx            — Root layout (html, fonts)
  (site)/               — Public pages with Nav, Footer and command palette
  dashboard/            — Owner dashboard (sidebar layout, one folder per destination)
  api/auth/             — Auth.js route handler
  api/private/          — Owner-only JSON endpoints
auth.ts                 — Auth.js configuration (GitHub provider, owner allowlist)
proxy.ts                — Optimistic session-cookie gate for /dashboard and /api/private
data/project-registry.ts — The single project registry and its selectors
lib/auth/               — Allowlist logic, server guards, API denial
lib/integrations/       — GitHub, Vercel, Notion adapters, HTTP/error model, last-success cache
lib/dashboard-nav.ts    — Sidebar destinations
tests/                  — Registry, integration (mocked), access-control and bundle tests
```

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without auth variables the dashboard denies everyone and `/login` explains what is missing.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
npm test          # run after the build so the client-bundle leak test is not skipped
```

`npm test` is entirely **mocked**: no test contacts GitHub, Vercel or Notion. Live verification requires real credentials and is performed manually by signing in and opening `/dashboard/github`, `/dashboard/vercel` and `/dashboard/notion` (or `GET /api/private/integrations` with a session) and checking that each shows `fresh` with a recent fetch time.

## Contact

- GitHub: [github.com/sahidattaf](https://github.com/sahidattaf)
- Email: [sahidattaf@gmail.com](mailto:sahidattaf@gmail.com)
