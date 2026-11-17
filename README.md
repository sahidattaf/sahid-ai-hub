<img width="1265" height="1200" alt="image" src="https://github.com/user-attachments/assets/8feae620-80bc-4c54-a167-6dfad5dc516a" />
# Sahid AI Hub

AI Operating System dashboard and multi-page command center for everything Sahid Attaf builds with AI.

Public projects, build zones and services in one operating system. All proof is in production.

## Sprint History

- **Sprint 1** — Public front door: static homepage, project showcase, live app links
- **Sprint 2** — OS Dashboard: status system, zone architecture, command center, revenue engine, roadmap
- **Sprint 3** — Multi-page routing: six dedicated pages, shared components, layout-level nav and footer
- **Sprint 4** — Integrations readiness: eight API integration specs with purpose, env vars, safety rules, and sprint targets
- **Sprint 5** — GitHub page: static list of public repositories, built from the public project data (no live API calls)
- **Sprint 6.1** — Project Registry foundation: `/registry` page with stats and zone-grouped cards; `/projects` and `/live-apps` pull from the public project data (`data/public-projects.json`)
- **Sprint 6.2** — `/vercel` redirects to `/live-apps`; live Vercel and GitHub data is not shown on the public site

## Stack

- **Framework:** Next.js 16, App Router, TypeScript
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel

## Routes

| Route | Description |
| --- | --- |
| `/` | Executive overview — hero, stats, OS dashboard, project preview, services and roadmap summaries |
| `/registry` | Public project registry — zone-grouped, with stats, stack and links; non-public projects are not listed |
| `/projects` | All projects grouped by zone — sourced from the public project data |
| `/live-apps` | Live Vercel deployments with tech stacks and direct links — sourced from the public project data |
| `/command-center` | Eight-tool active toolchain grouped by category |
| `/revenue` | Summary of the services offered (no pricing or income details) |
| `/roadmap` | Five-phase progression from public launch to client portal |
| `/about` | Sahid Attaf — background, focus areas, build categories, and principles |
| `/github` | Static list of public repositories, built from the public project data |
| `/vercel` | Redirects to `/live-apps` |
| `/integrations` | Eight API integrations — purpose, env vars, safety rules, and sprint targets |

## Structure

```text
app/
  page.tsx              — Homepage (executive overview)
  layout.tsx            — Root layout with shared Nav and Footer
  globals.css           — Design tokens, badge styles, utilities
  projects/page.tsx     — All projects grouped by zone
  live-apps/page.tsx    — Vercel deployments with tech stacks
  command-center/page.tsx — Active toolchain by category
  revenue/page.tsx      — Services summary
  roadmap/page.tsx      — Five-phase build progression
  about/page.tsx        — Builder background and principles
components/
  nav.tsx               — Sticky top navigation (all pages)
  footer.tsx            — Site footer (all pages)
  section-header.tsx    — Shared section label/title/description
  page-header.tsx       — Sub-page breadcrumb + hero header
  project-card.tsx      — Project card with status/visibility/next action (legacy, used on homepage)
  public-project-card.tsx — Public project card with zone, stack and links
  integration-card.tsx  — Integration card with env vars, safety rule, sprint target
  github/
    github-profile.tsx  — Avatar, bio, follower/following stats
    repo-card.tsx       — Repo card with status badge, health, language, links
    repo-health.tsx     — Stars, forks, issues, last pushed
    language-chart.tsx  — CSS-only language distribution bar chart
  vercel/
    vercel-project-card.tsx — Project card with framework, URL, deploy state, commit info
    deployment-status.tsx   — Inline deploy state badge (READY/ERROR/BUILDING/…)
    vercel-summary.tsx      — 4-stat summary bar (total, ready, failed, 24h deployments)
lib/
  github.ts             — GitHub REST API fetch functions, types, utilities
  vercel.ts             — Vercel REST API fetch functions, types, state helpers
data/
  public-projects.json / public-projects.ts — Public-only project data (the allowlist). Non-public projects and internal fields are not stored.
  projects.ts           — Legacy project data (used by homepage project-card)
  command-center.ts     — toolchain, services, roadmap data
  integrations.ts       — Eight API integration specs
```

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run lint
npm run build
```

## Environment Variables

The public site reads no provider tokens: `/github` and `/vercel` are static, and no environment variable is required to run it. Tokens for live data belong only to the future owner-only dashboard.

No API keys are committed to this repository. All secrets go in `.env.local` only.

## Projects

| Project | Live | Repository | Zone |
| --- | --- | --- | --- |
| JobHunterGPT | [Live](https://jobhunter-gpt-gamma.vercel.app/) | [Repo](https://github.com/sahidattaf/jobhunter-gpt) | Proof of Work |
| BOSSA Asado i Mar | [Live](https://bossa-asado-i-mar.vercel.app/) | [Repo](https://github.com/sahidattaf/BOSSA-ASADO-I-MAR) | Hospitality |
| BOSSA AI OS | [Live](https://bossa-ai-os.vercel.app/) | [Repo](https://github.com/sahidattaf/bossa-ai-os) | Hospitality |
| GPT OS Website | [Live](https://gpt-os-website.vercel.app/) | [Repo](https://github.com/sahidattaf/gpt-innovation-os) | GPT Innovation |
| AI Marketing Tools | [Live](https://ai-marketing-tools-six.vercel.app/) | [Repo](https://github.com/sahidattaf/ai_-marketing-_tools-_agent) | GPT Innovation |

## Contact

- GitHub: [github.com/sahidattaf](https://github.com/sahidattaf)
- Email: [sahidattaf@gmail.com](mailto:sahidattaf@gmail.com)
