// Client-safe search types and constants. Contains NO project data: the index
// itself is built on the server (data/search-index.ts) and passed to the
// command palette as props, so the full registry is never bundled for the browser.
export type SearchCategory = "Projects" | "Pages";

export interface SearchItem {
  id: string;
  title: string;
  category: SearchCategory;
  description: string;
  url: string;
  icon: string;
  keywords: string[];
  recent?: boolean;
  favorite?: boolean;
}

export const CATEGORY_ICONS: Record<string, string> = {
  Projects: "📁",
  Pages: "🗂️",
};

export const CATEGORY_ORDER: string[] = ["Pages", "Projects"];
