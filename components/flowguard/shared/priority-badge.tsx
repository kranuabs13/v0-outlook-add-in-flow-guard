import { cn } from "@/lib/utils"
import type { Priority } from "@/lib/types"

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  high: {
    label: "High",
    className: "bg-priority-high/15 text-priority-high border-priority-high/30",
  },
  normal: {
    label: "Normal",
    className: "bg-priority-normal/15 text-priority-normal border-priority-normal/30",
  },
  low: {
    label: "Low",
    className: "bg-priority-low/15 text-priority-low border-priority-low/30",
  },
}

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  const config = priorityConfig[priority]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
