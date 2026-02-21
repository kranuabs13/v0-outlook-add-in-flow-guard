"use client"

import { useFlowGuard } from "@/lib/flowguard-context"
import { AlertTriangle, Star, FileEdit, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function StatusBar() {
  const { statusSummary, isDemo } = useFlowGuard()

  const items = [
    {
      icon: AlertTriangle,
      count: statusSummary.urgentCount,
      label: "Urgent",
      colorClass: statusSummary.urgentCount > 0 ? "text-priority-high" : "text-muted-foreground",
      bgClass: statusSummary.urgentCount > 0 ? "bg-priority-high/10" : "bg-muted",
    },
    {
      icon: Star,
      count: statusSummary.vipPendingCount,
      label: "VIP",
      colorClass: statusSummary.vipPendingCount > 0 ? "text-vip" : "text-muted-foreground",
      bgClass: statusSummary.vipPendingCount > 0 ? "bg-vip/10" : "bg-muted",
    },
    {
      icon: FileEdit,
      count: statusSummary.idleDraftsCount,
      label: "Idle",
      colorClass: statusSummary.idleDraftsCount > 0 ? "text-priority-normal" : "text-muted-foreground",
      bgClass: statusSummary.idleDraftsCount > 0 ? "bg-priority-normal/10" : "bg-muted",
    },
    {
      icon: Clock,
      count: statusSummary.overdueCount,
      label: "Overdue",
      colorClass: statusSummary.overdueCount > 0 ? "text-priority-critical" : "text-muted-foreground",
      bgClass: statusSummary.overdueCount > 0 ? "bg-priority-critical/10" : "bg-muted",
    },
  ]

  return (
    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-card">
      <div className="flex items-center gap-1 mr-auto">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
          <span className="text-[10px] font-bold text-primary-foreground">FG</span>
        </div>
        <span className="text-xs font-semibold text-foreground">FlowGuard</span>
        {isDemo && (
          <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">
            Demo
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-1">
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(
              "flex items-center gap-1 rounded-md px-1.5 py-1",
              item.bgClass
            )}
            title={`${item.count} ${item.label}`}
          >
            <item.icon className={cn("h-3 w-3", item.colorClass)} />
            <span className={cn("text-[11px] font-semibold tabular-nums", item.colorClass)}>
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
