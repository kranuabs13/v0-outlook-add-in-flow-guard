"use client"

import { useFlowGuard } from "@/lib/flowguard-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock } from "lucide-react"
import { toast } from "sonner"

export function SlaConfig() {
  const { settings, updateSettings } = useFlowGuard()

  const handleChange = (field: keyof typeof settings.sla, value: string) => {
    const num = parseInt(value, 10)
    if (isNaN(num) || num < 0) return
    updateSettings({
      sla: { ...settings.sla, [field]: num },
    })
    toast.success("SLA setting updated")
  }

  const fields = [
    {
      id: "vipReplyHours",
      label: "VIP Reply Window",
      unit: "hours",
      value: settings.sla.vipReplyHours,
      description: "Maximum time to reply to VIP contacts",
    },
    {
      id: "normalReplyHours",
      label: "Normal Reply Window",
      unit: "hours",
      value: settings.sla.normalReplyHours,
      description: "Maximum time to reply to regular contacts",
    },
    {
      id: "draftIdleMinutes",
      label: "Draft Idle Alert",
      unit: "minutes",
      value: settings.sla.draftIdleMinutes,
      description: "Alert when drafts are idle longer than this",
    },
  ] as const

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-semibold text-foreground">SLA Thresholds</h3>
      </div>

      <div className="flex flex-col gap-3">
        {fields.map((field) => (
          <div key={field.id} className="flex flex-col gap-1">
            <Label htmlFor={field.id} className="text-[11px] font-medium text-foreground">
              {field.label}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id={field.id}
                type="number"
                min="0"
                value={field.value}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="h-8 text-xs w-20"
              />
              <span className="text-[11px] text-muted-foreground">{field.unit}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{field.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
