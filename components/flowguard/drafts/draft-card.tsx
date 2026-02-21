"use client"

import type { Draft } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Clock, ExternalLink, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { openDraft } from "@/lib/office"
import { markDraftIntentional } from "@/lib/storage"
import { Button } from "@/components/ui/button"

function formatIdleTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours < 24) return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d ${hours % 24}h`
}

function getIdleSeverity(minutes: number, threshold: number): "ok" | "warning" | "critical" {
  if (minutes < threshold) return "ok"
  if (minutes < threshold * 2) return "warning"
  return "critical"
}

const severityStyles = {
  ok: "text-muted-foreground bg-muted",
  warning: "text-priority-normal bg-priority-normal/10",
  critical: "text-priority-high bg-priority-high/10",
}

export function DraftCard({
  draft,
  idleThreshold,
  onDismiss,
}: {
  draft: Draft
  idleThreshold: number
  onDismiss: (id: string) => void
}) {
  const severity = getIdleSeverity(draft.idleMinutes, idleThreshold)

  const handleOpen = async () => {
    try {
      await openDraft(draft.id)
      toast.info(`Opening draft: "${draft.subject}"`, {
        description: "In Outlook, this would open the draft in compose mode.",
      })
    } catch {
      toast.error("Could not open draft")
    }
  }

  const handleMarkIntentional = () => {
    markDraftIntentional(draft.id)
    onDismiss(draft.id)
    toast.success("Draft marked as intentional", {
      description: "This draft will no longer appear in idle alerts.",
    })
  }

  return (
    <div className="flex flex-col gap-2 px-3 py-3 border-b border-border">
      <div className="flex items-start gap-3">
        {/* Idle indicator */}
        <div
          className={cn(
            "flex items-center gap-1 rounded-md px-2 py-1 shrink-0",
            severityStyles[severity]
          )}
        >
          <Clock className="h-3 w-3" />
          <span className="text-[11px] font-semibold tabular-nums">
            {formatIdleTime(draft.idleMinutes)}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground truncate mb-0.5">
            To: {draft.recipients.map((r) => r.name || r.email).join(", ")}
          </p>
          <p className="text-xs text-foreground/70 truncate mb-0.5">
            {draft.subject}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            {draft.bodyPreview.slice(0, 60)}...
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-0">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-[11px] gap-1 flex-1"
          onClick={handleOpen}
        >
          <ExternalLink className="h-3 w-3" />
          Open Draft
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-[11px] gap-1 text-muted-foreground flex-1"
          onClick={handleMarkIntentional}
        >
          <EyeOff className="h-3 w-3" />
          Intentional
        </Button>
      </div>
    </div>
  )
}
