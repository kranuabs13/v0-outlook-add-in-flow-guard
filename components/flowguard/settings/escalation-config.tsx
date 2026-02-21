"use client"

import { useFlowGuard } from "@/lib/flowguard-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users } from "lucide-react"
import { toast } from "sonner"

export function EscalationConfig() {
  const { settings, updateSettings } = useFlowGuard()

  const handleEmailChange = (field: "managerEmail" | "buManagerEmail", value: string) => {
    updateSettings({
      escalation: { ...settings.escalation, [field]: value },
    })
  }

  const handleNumberChange = (
    field: "quoteReplyDeadlineHours" | "vendorResponseDeadlineHours",
    value: string
  ) => {
    const num = parseInt(value, 10)
    if (isNaN(num) || num < 0) return
    updateSettings({
      escalation: { ...settings.escalation, [field]: num },
    })
    toast.success("Escalation setting updated")
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-semibold text-foreground">Escalation</h3>
      </div>

      <p className="text-[10px] text-muted-foreground leading-relaxed">
        Configure who receives escalation alerts when SLA deadlines are missed.
        Escalation execution is coming in a future update.
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="manager-email" className="text-[11px] font-medium">
            Manager Email
          </Label>
          <Input
            id="manager-email"
            type="email"
            value={settings.escalation.managerEmail}
            onChange={(e) => handleEmailChange("managerEmail", e.target.value)}
            onBlur={() => toast.success("Manager email saved")}
            placeholder="manager@company.com"
            className="h-8 text-xs"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="bu-manager-email" className="text-[11px] font-medium">
            BU Manager Email
          </Label>
          <Input
            id="bu-manager-email"
            type="email"
            value={settings.escalation.buManagerEmail}
            onChange={(e) => handleEmailChange("buManagerEmail", e.target.value)}
            onBlur={() => toast.success("BU Manager email saved")}
            placeholder="bu-manager@company.com"
            className="h-8 text-xs"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="quote-deadline" className="text-[11px] font-medium">
            Quote Reply Deadline
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="quote-deadline"
              type="number"
              min="1"
              value={settings.escalation.quoteReplyDeadlineHours}
              onChange={(e) => handleNumberChange("quoteReplyDeadlineHours", e.target.value)}
              className="h-8 text-xs w-20"
            />
            <span className="text-[11px] text-muted-foreground">hours</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="vendor-deadline" className="text-[11px] font-medium">
            Vendor Response Deadline
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="vendor-deadline"
              type="number"
              min="1"
              value={settings.escalation.vendorResponseDeadlineHours}
              onChange={(e) => handleNumberChange("vendorResponseDeadlineHours", e.target.value)}
              className="h-8 text-xs w-20"
            />
            <span className="text-[11px] text-muted-foreground">hours</span>
          </div>
        </div>
      </div>
    </div>
  )
}
