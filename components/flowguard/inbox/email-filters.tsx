"use client"

import { cn } from "@/lib/utils"

export type FilterMode = "all" | "vip" | "high" | "unread"
export type SortMode = "priority" | "newest" | "oldest"

const filterOptions: { id: FilterMode; label: string }[] = [
  { id: "all", label: "All" },
  { id: "vip", label: "VIP" },
  { id: "high", label: "High" },
  { id: "unread", label: "Unread" },
]

const sortOptions: { id: SortMode; label: string }[] = [
  { id: "priority", label: "Priority" },
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
]

export function EmailFilters({
  activeFilter,
  onFilterChange,
  activeSort,
  onSortChange,
}: {
  activeFilter: FilterMode
  onFilterChange: (f: FilterMode) => void
  activeSort: SortMode
  onSortChange: (s: SortMode) => void
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
      <div className="flex items-center gap-1 flex-1">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onFilterChange(opt.id)}
            className={cn(
              "rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
              activeFilter === opt.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <select
        value={activeSort}
        onChange={(e) => onSortChange(e.target.value as SortMode)}
        className="text-[11px] bg-muted text-foreground border-none rounded-md px-2 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-ring"
        aria-label="Sort emails"
      >
        {sortOptions.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
