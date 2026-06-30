"use client";

import { useMemo, useState } from "react";
import { getRepositoryStatus } from "@/lib/github";
import type { Repository, RepositoryStatus, RepoVisibility, HealthLabel } from "@/types/github";

export type SortKey = "updated" | "health" | "name" | "stars" | "issues";

export type FilterValue<T extends string> = T | "All";

export interface UseGithubRepositoriesResult {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: FilterValue<RepositoryStatus>;
  setStatusFilter: (value: FilterValue<RepositoryStatus>) => void;
  languageFilter: FilterValue<string>;
  setLanguageFilter: (value: FilterValue<string>) => void;
  visibilityFilter: FilterValue<RepoVisibility>;
  setVisibilityFilter: (value: FilterValue<RepoVisibility>) => void;
  healthFilter: FilterValue<HealthLabel>;
  setHealthFilter: (value: FilterValue<HealthLabel>) => void;
  sortKey: SortKey;
  setSortKey: (value: SortKey) => void;
  languages: string[];
  filtered: Repository[];
  resultCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  resetFilters: () => void;
}

export function useGithubRepositories(
  repositories: Repository[],
): UseGithubRepositoriesResult {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterValue<RepositoryStatus>>("All");
  const [languageFilter, setLanguageFilter] = useState<FilterValue<string>>("All");
  const [visibilityFilter, setVisibilityFilter] = useState<FilterValue<RepoVisibility>>("All");
  const [healthFilter, setHealthFilter] = useState<FilterValue<HealthLabel>>("All");
  const [sortKey, setSortKey] = useState<SortKey>("updated");

  const languages = useMemo(() => {
    const set = new Set<string>();
    for (const repo of repositories) {
      if (repo.language) set.add(repo.language);
    }
    return Array.from(set).sort();
  }, [repositories]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const matches = repositories.filter((repo) => {
      if (
        query &&
        !repo.name.toLowerCase().includes(query) &&
        !repo.description.toLowerCase().includes(query)
      ) {
        return false;
      }
      if (statusFilter !== "All" && getRepositoryStatus(repo) !== statusFilter) {
        return false;
      }
      if (languageFilter !== "All" && repo.language !== languageFilter) {
        return false;
      }
      if (visibilityFilter !== "All" && repo.visibility !== visibilityFilter) {
        return false;
      }
      if (healthFilter !== "All" && repo.health.label !== healthFilter) {
        return false;
      }
      return true;
    });

    return [...matches].sort((a, b) => {
      switch (sortKey) {
        case "health":
          return b.health.score - a.health.score;
        case "name":
          return a.name.localeCompare(b.name);
        case "stars":
          return b.stars - a.stars;
        case "issues":
          return b.openIssues - a.openIssues;
        case "updated":
        default: {
          const aTime = a.lastCommitDate ?? a.lastUpdated ?? "";
          const bTime = b.lastCommitDate ?? b.lastUpdated ?? "";
          return bTime.localeCompare(aTime);
        }
      }
    });
  }, [repositories, search, statusFilter, languageFilter, visibilityFilter, healthFilter, sortKey]);

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "All" ||
    languageFilter !== "All" ||
    visibilityFilter !== "All" ||
    healthFilter !== "All";

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setLanguageFilter("All");
    setVisibilityFilter("All");
    setHealthFilter("All");
  }

  return {
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
    resultCount: filtered.length,
    totalCount: repositories.length,
    hasActiveFilters,
    resetFilters,
  };
}
