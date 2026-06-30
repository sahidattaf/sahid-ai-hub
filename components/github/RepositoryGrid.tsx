"use client";

import { useGithubRepositories, type SortKey, type FilterValue } from "@/hooks/use-github";
import type { Repository, RepositoryStatus, RepoVisibility, HealthLabel } from "@/types/github";
import RepositoryCard from "./RepositoryCard";

const STATUS_OPTIONS: RepositoryStatus[] = [
  "Live",
  "Active",
  "Planning",
  "Archived",
  "Not Connected",
];
const VISIBILITY_OPTIONS: RepoVisibility[] = ["Public", "Private"];
const HEALTH_OPTIONS: HealthLabel[] = ["Excellent", "Good", "Needs Attention", "Critical"];
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "updated", label: "Recently Updated" },
  { value: "health", label: "Health" },
  { value: "name", label: "Name" },
  { value: "stars", label: "Stars" },
  { value: "issues", label: "Issues" },
];

const selectStyle = {
  backgroundColor: "var(--navy-800)",
  borderColor: "var(--navy-border)",
  color: "var(--text-primary)",
};

export default function RepositoryGrid({ repositories }: { repositories: Repository[] }) {
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    languageFilter,
    setLanguageFilter,
    visibilityFilter,
    setVisibilityFilter,
    healthFilter,
    setHealthFilter,
    sortKey,
    setSortKey,
    languages,
    filtered,
    resultCount,
    totalCount,
    hasActiveFilters,
    resetFilters,
  } = useGithubRepositories(repositories);

  return (
    <div>
      <div
        className="rounded-lg border p-4 mb-6 flex flex-col lg:flex-row lg:items-center gap-3"
        style={{ backgroundColor: "var(--navy-card)", borderColor: "var(--navy-border)" }}
      >
        <div className="flex-1 min-w-0">
          <label htmlFor="repo-search" className="sr-only">
            Search repositories
          </label>
          <input
            id="repo-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search repositories…"
            className="w-full text-sm px-3 py-2 rounded border outline-none"
            style={selectStyle}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            id="repo-filter-status"
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS}
          />
          <FilterSelect
            id="repo-filter-language"
            label="Language"
            value={languageFilter}
            onChange={setLanguageFilter}
            options={languages}
          />
          <FilterSelect
            id="repo-filter-visibility"
            label="Visibility"
            value={visibilityFilter}
            onChange={setVisibilityFilter}
            options={VISIBILITY_OPTIONS}
          />
          <FilterSelect
            id="repo-filter-health"
            label="Health"
            value={healthFilter}
            onChange={setHealthFilter}
            options={HEALTH_OPTIONS}
          />

          <label htmlFor="repo-sort" className="sr-only">
            Sort repositories
          </label>
          <select
            id="repo-sort"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="text-xs px-2.5 py-2 rounded border outline-none"
            style={selectStyle}
            aria-label="Sort repositories"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort: {opt.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs px-2.5 py-2 rounded border transition-colors"
              style={{ borderColor: "var(--navy-border)", color: "var(--text-subtle)" }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <p
        className="text-xs font-mono uppercase tracking-widest mb-5"
        style={{ color: "var(--text-subtle)", letterSpacing: "0.15em" }}
      >
        {resultCount} of {totalCount} repositor{totalCount !== 1 ? "ies" : "y"}
      </p>

      {filtered.length === 0 ? (
        <div
          className="rounded-lg border p-12 text-center"
          style={{ backgroundColor: "var(--navy-card)", borderColor: "var(--navy-border)" }}
        >
          <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
            No repositories match your filters.
          </p>
          <button
            onClick={resetFilters}
            className="text-xs font-medium"
            style={{ color: "var(--cyan)" }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4" role="list">
          {filtered.map((repo) => (
            <div key={repo.id} role="listitem">
              <RepositoryCard repo={repo} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: FilterValue<T>;
  onChange: (value: FilterValue<T>) => void;
  options: T[];
}) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        Filter by {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as FilterValue<T>)}
        className="text-xs px-2.5 py-2 rounded border outline-none"
        style={selectStyle}
        aria-label={`Filter by ${label}`}
      >
        <option value="All">{label}: All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </>
  );
}
