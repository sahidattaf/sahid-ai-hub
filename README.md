# Sahid AI Hub

AI Operating System dashboard and multi-page command center for everything Sahid Attaf builds with AI.

Six live applications. Five build zones. Seven revenue streams. One operating system. All proof is in production.

## Sprint History

- **Sprint 1** — Public front door: static homepage, project showcase, live app links
- **Sprint 2** — OS Dashboard: status system, zone architecture, command center, revenue engine, roadmap
- **Sprint 3** — Multi-page routing: six dedicated pages, shared components, layout-level nav and footer
- **Sprint 4** — Integrations readiness: eight API integration specs with purpose, env vars, safety rules, and sprint targets
- **Sprint 5** — Live GitHub dashboard: profile, repos, language chart, aggregate stats — server-rendered from GitHub REST API

## Stack

- **Framework:** Next.js 16, App Router, TypeScript
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel

## Routes

| Route | Description |
| --- | --- |
| `/` | Executive overview — hero, stats, OS dashboard, project preview, revenue and roadmap summaries |
| `/projects` | All six projects grouped by zone with status, visibility, and next actions |
| `/live-apps` | Six Vercel deployments with tech stacks and direct links |
| `/command-center` | Eight-tool active toolchain grouped by category |
| `/revenue` | Seven revenue streams with audience, income type, and how-it-earns breakdown |
| `/roadmap` | Five-phase progression from public launch to client portal |
| `/about` | Sahid Attaf — background, focus areas, build categories, and principles |
| `/github` | Live GitHub dashboard — profile, repos, language chart, aggregate stats (server-rendered, refreshes every 5 min) |
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
  revenue/page.tsx      — Revenue streams with income breakdown
  roadmap/page.tsx      — Five-phase build progression
  about/page.tsx        — Builder background and principles
components/
  nav.tsx               — Sticky top navigation (all pages)
  footer.tsx            — Site footer (all pages)
  section-header.tsx    — Shared section label/title/description
  page-header.tsx       — Sub-page breadcrumb + hero header
  project-card.tsx      — Project card with status/visibility/next action
  integration-card.tsx  — Integration card with env vars, safety rule, sprint target
  github/
    github-profile.tsx  — Avatar, bio, follower/following stats
    repo-card.tsx       — Repo card with status badge, health, language, links
    repo-health.tsx     — Stars, forks, issues, last pushed
    language-chart.tsx  — CSS-only language distribution bar chart
lib/
  github.ts             — GitHub REST API fetch functions, types, utilities
data/
  projects.ts           — Project data with status, zone, tech stack
  command-center.ts     — OS dashboard, toolchain, revenue, roadmap data
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

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `GITHUB_USERNAME` | No | GitHub username for the dashboard (default: `sahidattaf`) |
| `GITHUB_TOKEN` | No | Personal access token — increases rate limit from 60 to 5000 req/hr |

No API keys are committed to this repository. All secrets go in `.env.local` only.

## Projects

| Project | Live | Repository | Zone |
| --- | --- | --- | --- |
| JobHunterGPT | [Live](https://jobhunter-gpt-gamma.vercel.app/) | [Repo](https://github.com/sahidattaf/jobhunter-gpt) | Proof of Work |
| BOSSA Asado i Mar | [Live](https://bossa-asado-i-mar.vercel.app/) | [Repo](https://github.com/sahidattaf/BOSSA-ASADO-I-MAR) | Hospitality |
| BOSSA AI OS | [Live](https://bossa-ai-os.vercel.app/) | [Repo](https://github.com/sahidattaf/bossa-ai-os) | Hospitality |
| GPT OS Website | [Live](https://gpt-os-website.vercel.app/) | [Repo](https://github.com/sahidattaf/gpt-innovation-os) | GPT Innovation |
| Piskadera Marketplace | [Live](https://piskadera-marketplace.vercel.app/) | [Repo](https://github.com/sahidattaf/kai-korsou-command-center) | Real Estate / Kai Korsou |
| AI Marketing Tools | [Live](https://ai-marketing-tools-six.vercel.app/) | [Repo](https://github.com/sahidattaf/ai_-marketing-_tools-_agent) | GPT Innovation |

## Contact

- GitHub: [github.com/sahidattaf](https://github.com/sahidattaf)
- Email: [sahidattaf@gmail.com](mailto:sahidattaf@gmail.com)
