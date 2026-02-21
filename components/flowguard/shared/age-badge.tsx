import { cn } from "@/lib/utils"
import type { AgingCategory } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

const agingStyles: Record<AgingCategory, string> = {
  fresh: "text-muted-foreground",
  aging: "text-priority-normal font-medium",
  critical: "text-priority-high font-semibold",
}

export function AgeBadge({
  date,
  agingCategory,
  className,
}: {
  date: string
  agingCategory: AgingCategory
  className?: string
}) {
  const timeAgo = formatDistanceToNow(new Date(date), { addSuffix: true })

  return (
    <span className={cn("text-[11px]", agingStyles[agingCategory], className)}>
      {timeAgo}
    </span>
  )
}
