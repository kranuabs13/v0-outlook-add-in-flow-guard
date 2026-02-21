"use client"

import { useState, useMemo } from "react"
import { useFlowGuard } from "@/lib/flowguard-context"
import { EmailCard } from "./email-card"
import { EmailFilters, type FilterMode, type SortMode } from "./email-filters"
import { EmptyState } from "../shared/empty-state"
import { Inbox, Loader2 } from "lucide-react"

export function InboxView() {
  const { emails, isLoading } = useFlowGuard()
  const [filter, setFilter] = useState<FilterMode>("all")
  const [sort, setSort] = useState<SortMode>("priority")

  const filtered = useMemo(() => {
    let result = [...emails]

    // Apply filter
    switch (filter) {
      case "vip":
        result = result.filter((e) => e.isVip)
        break
      case "high":
        result = result.filter((e) => e.priority === "high")
        break
      case "unread":
        result = result.filter((e) => !e.isRead)
        break
    }

    // Apply sort
    switch (sort) {
      case "newest":
        result.sort((a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.receivedDate).getTime() - new Date(b.receivedDate).getTime())
        break
      case "priority":
        // Already sorted by priority from context
        break
    }

    return result
  }, [emails, filter, sort])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <EmailFilters
        activeFilter={filter}
        onFilterChange={setFilter}
        activeSort={sort}
        onSortChange={setSort}
      />

      {/* Email count */}
      <div className="px-3 py-1.5 bg-muted/50">
        <span className="text-[11px] text-muted-foreground">
          {filtered.length} email{filtered.length !== 1 ? "s" : ""}
          {filter !== "all" && ` (${filter} filter)`}
        </span>
      </div>

      {/* Email list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No emails found"
            description={
              filter !== "all"
                ? "Try changing your filter to see more emails."
                : "Your inbox is empty. New emails will appear here."
            }
          />
        ) : (
          <div>
            {filtered.map((email) => (
              <EmailCard key={email.id} email={email} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
