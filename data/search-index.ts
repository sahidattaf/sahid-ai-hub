import "server-only";
import { getPublicProjects } from "@/data/project-registry";
import type { SearchItem } from "@/lib/search-config";

export type { SearchCategory, SearchItem } from "@/lib/search-config";

// This index is passed (as props) to the browser-side command palette, so it
// may contain public information only: public pages plus projects whose
// registry visibility is "Public", reduced to the public project fields.

const PAGES: SearchItem[] = [
  { id: "page-home", title: "Home", category: "Pages", description: "Public overview of Sahid AI Hub", url: "/", icon: "🏠", keywords: ["home", "overview", "hub"], favorite: true },
  { id: "page-projects", title: "Projects", category: "Pages", description: "Public projects grouped by zone", url: "/projects", icon: "📁", keywords: ["projects", "portfolio", "zones"], favorite: true },
  { id: "page-live-apps", title: "Live Apps", category: "Pages", description: "Public applications with declared production URLs", url: "/live-apps", icon: "🚀", keywords: ["live", "apps", "vercel", "deployed"], favorite: true },
  { id: "page-command-center", title: "Command Center", category: "Pages", description: "Active AI toolchain", url: "/command-center", icon: "🧭", keywords: ["tools", "toolchain", "stack"] },
  { id: "page-roadmap", title: "Roadmap", category: "Pages", description: "Build progression", url: "/roadmap", icon: "🗺️", keywords: ["roadmap", "phases", "plan"] },
  { id: "page-about", title: "About", category: "Pages", description: "Background and principles", url: "/about", icon: "👤", keywords: ["about", "sahid", "background"] },
  { id: "page-dashboard", title: "Owner Dashboard", category: "Pages", description: "Sign-in required", url: "/dashboard", icon: "🔒", keywords: ["dashboard", "login", "sign in", "owner"], favorite: true },
];

const PROJECTS: SearchItem[] = getPublicProjects().map((p) => ({
  id: `project-${p.id}`,
  title: p.name,
  category: "Projects",
  description: p.description,
  url: `/projects/${p.id}`,
  icon: "📁",
  keywords: [...p.tags, ...p.stack, p.zone, p.category].map((k) => k.toLowerCase()),
}));

export const SEARCH_INDEX: SearchItem[] = [...PAGES, ...PROJECTS];
