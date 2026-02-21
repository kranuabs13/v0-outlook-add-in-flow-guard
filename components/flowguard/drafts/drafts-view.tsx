"use client"

import { useState, useCallback } from "react"
import { useFlowGuard } from "@/lib/flowguard-context"
import { DraftCard } from "./draft-card"
import { EmptyState } from "../shared/empty-state"
import { FileEdit, Loader2 } from "lucide-react"

export function DraftsView() {
  const { drafts, settings, isLoading, refreshData } = useFlowGuard()
  const [dismissedIds, setDismissedIds] = useState<string[]>([])

  const handleDismiss = useCallback((id: string) => {
    setDismissedIds((prev) => [...prev, id])
    // Also refresh to pick up the storage change
    setTimeout(() => refreshData(), 500)
  }, [refreshData])

  const visibleDrafts = drafts.filter((d) => !dismissedIds.includes(d.id))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    )
  }

  const idleCount = visibleDrafts.filter(
    (d) => d.idleMinutes >= settings.sla.draftIdleMinutes
  ).length

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border bg-muted/50 flex items-center gap-2">
        <span className="text-xs font-medium text-foreground">
          External Drafts
        </span>
        <span className="text-[11px] text-muted-foreground">
          {visibleDrafts.length} total
        </span>
        {idleCount > 0 && (
          <span className="ml-auto text-[11px] font-medium text-priority-normal">
            {idleCount} idle {">"}  {settings.sla.draftIdleMinutes}m
          </span>
        )}
      </div>

      {/* Info bar */}
      <div className="px-3 py-1.5 bg-primary/[0.03] border-b border-border">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Showing drafts to external recipients only. Internal drafts and
          intentionally saved drafts are hidden.
        </p>
      </div>

      {/* Draft list */}
      <div className="flex-1 overflow-y-auto">
        {visibleDrafts.length === 0 ? (
          <EmptyState
            icon={FileEdit}
            title="No idle drafts"
            description="All your drafts are either sent, internal, or marked as intentional."
          />
        ) : (
          <div>
            {visibleDrafts.map((draft) => (
              <DraftCard
                key={draft.id}
                draft={draft}
                idleThreshold={settings.sla.draftIdleMinutes}
                onDismiss={handleDismiss}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
