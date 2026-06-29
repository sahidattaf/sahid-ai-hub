import { SearchItem, SEARCH_INDEX, CATEGORY_ORDER } from "@/data/search-index";

function normalize(str: string): string {
  return str.toLowerCase().trim();
}

function scoreItem(item: SearchItem, query: string): number {
  const q = normalize(query);
  if (!q) return 0;

  const title = normalize(item.title);
  const description = normalize(item.description);
  const category = normalize(item.category);
  const keywords = item.keywords.map(normalize);

  // Exact title match wins
  if (title === q) return 100;

  let score = 0;

  // Title proximity
  if (title.startsWith(q)) score += 10;
  else if (title.includes(q)) score += 8;

  // Description match
  if (description.includes(q)) score += 4;

  // Category match
  if (category.includes(q)) score += 3;

  // Keyword matches
  for (const kw of keywords) {
    if (kw === q) {
      score += 6;
      break;
    }
    if (kw.startsWith(q)) {
      score += 3;
      break;
    }
    if (kw.includes(q)) {
      score += 2;
      break;
    }
  }

  // Fuzzy fallback: all chars appear in title in order
  if (score === 0) {
    let idx = 0;
    for (const ch of q) {
      const pos = title.indexOf(ch, idx);
      if (pos === -1) return 0;
      idx = pos + 1;
    }
    score += 1;
  }

  return score;
}

export function search(query: string): SearchItem[] {
  if (!query.trim()) return [];

  const results: Array<{ item: SearchItem; score: number }> = SEARCH_INDEX.map(
    (item) => ({ item, score: scoreItem(item, query) }),
  ).filter((r) => r.score > 0);

  results.sort((a, b) => b.score - a.score);

  return results.map((r) => r.item);
}

export function groupByCategory(
  items: SearchItem[],
): Map<string, SearchItem[]> {
  const raw = new Map<string, SearchItem[]>();
  for (const item of items) {
    const existing = raw.get(item.category) ?? [];
    existing.push(item);
    raw.set(item.category, existing);
  }

  // Sort groups by canonical CATEGORY_ORDER
  const sorted = new Map<string, SearchItem[]>();
  for (const cat of CATEGORY_ORDER) {
    if (raw.has(cat)) sorted.set(cat, raw.get(cat)!);
  }
  for (const [cat, its] of raw) {
    if (!sorted.has(cat)) sorted.set(cat, its);
  }

  return sorted;
}
