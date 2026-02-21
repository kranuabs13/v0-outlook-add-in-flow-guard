"use client"

import type { PrioritizedEmail } from "@/lib/types"
import { PriorityBadge } from "../shared/priority-badge"
import { AgeBadge } from "../shared/age-badge"
import { cn } from "@/lib/utils"
import { Star, Paperclip, Reply, Tag } from "lucide-react"
import { toast } from "sonner"
import { openEmail } from "@/lib/office"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getAvatarColor(email: string): string {
  const colors = [
    "bg-primary/20 text-primary",
    "bg-priority-low/20 text-priority-low",
    "bg-priority-normal/20 text-priority-normal",
    "bg-vip/20 text-vip",
    "bg-chart-2/20 text-chart-2",
  ]
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export function EmailCard({ email }: { email: PrioritizedEmail }) {
  const handleClick = async () => {
    try {
      await openEmail(email.id)
      toast.info(`Opening "${email.subject}"`, {
        description: "In Outlook, this would open the email in the reading pane.",
      })
    } catch {
      toast.error("Could not open email")
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full flex items-start gap-3 px-3 py-3 text-left transition-colors border-b border-border hover:bg-accent/50",
        !email.isRead && "bg-primary/[0.03]"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
          getAvatarColor(email.sender.email)
        )}
      >
        {getInitials(email.sender.name)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className={cn(
              "text-xs truncate",
              !email.isRead ? "font-semibold text-foreground" : "font-medium text-foreground/80"
            )}
          >
            {email.sender.name}
          </span>
          {email.isVip && (
            <Star className="h-3 w-3 shrink-0 fill-vip text-vip" />
          )}
          {email.hasReplied && (
            <Reply className="h-3 w-3 shrink-0 text-muted-foreground" />
          )}
        </div>
        <p
          className={cn(
            "text-xs truncate mb-0.5",
            !email.isRead ? "font-medium text-foreground" : "text-foreground/70"
          )}
        >
          {email.subject}
        </p>
        <p className="text-[11px] text-muted-foreground truncate">
          {email.bodyPreview.slice(0, 80)}...
        </p>
      </div>

      {/* Right column: priority + time */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <PriorityBadge priority={email.priority} />
        <AgeBadge date={email.receivedDate} agingCategory={email.agingCategory} />
        <div className="flex items-center gap-1">
          {email.hasAttachments && (
            <Paperclip className="h-3 w-3 text-muted-foreground" />
          )}
          {email.hasQuoteKeywords && (
            <Tag className="h-3 w-3 text-priority-normal" />
          )}
        </div>
      </div>
    </button>
  )
}
