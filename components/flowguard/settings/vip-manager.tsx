"use client"

import { useState } from "react"
import { useFlowGuard } from "@/lib/flowguard-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Star, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"
import type { VipContact } from "@/lib/types"

export function VipManager() {
  const { settings, updateSettings } = useFlowGuard()
  const [newValue, setNewValue] = useState("")

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  const isValidDomain = (v: string) => /^@?[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/.test(v)

  const handleAdd = () => {
    const trimmed = newValue.trim()
    if (!trimmed) return

    const isEmail = isValidEmail(trimmed)
    const isDomain = isValidDomain(trimmed)

    if (!isEmail && !isDomain) {
      toast.error("Invalid format", {
        description: "Enter an email (name@company.com) or domain (@company.com).",
      })
      return
    }

    const value = isDomain && !trimmed.startsWith("@") ? `@${trimmed}` : trimmed

    if (settings.vipContacts.some((v) => v.value.toLowerCase() === value.toLowerCase())) {
      toast.error("Already exists", { description: "This VIP contact is already in your list." })
      return
    }

    const newContact: VipContact = {
      id: `vip-${Date.now()}`,
      value,
      type: isEmail ? "email" : "domain",
    }

    updateSettings({
      vipContacts: [...settings.vipContacts, newContact],
    })
    setNewValue("")
    toast.success("VIP added", { description: `${value} added to VIP contacts.` })
  }

  const handleRemove = (id: string) => {
    updateSettings({
      vipContacts: settings.vipContacts.filter((v) => v.id !== id),
    })
    toast.success("VIP removed")
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Star className="h-4 w-4 text-vip" />
        <h3 className="text-xs font-semibold text-foreground">VIP Contacts</h3>
        <span className="text-[10px] text-muted-foreground ml-auto">
          {settings.vipContacts.length} contact{settings.vipContacts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Add form */}
      <div className="flex items-center gap-2">
        <Input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="email@company.com or @domain.com"
          className="h-8 text-xs"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button size="sm" onClick={handleAdd} className="h-8 px-2.5 shrink-0">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* VIP list */}
      {settings.vipContacts.length === 0 ? (
        <p className="text-[11px] text-muted-foreground py-2 text-center">
          No VIP contacts added yet. Add emails or domains above.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {settings.vipContacts.map((vip) => (
            <div
              key={vip.id}
              className="flex items-center gap-2 rounded-md bg-muted/50 px-2.5 py-1.5"
            >
              <span
                className={cn(
                  "text-[10px] font-medium rounded px-1.5 py-0.5",
                  vip.type === "email"
                    ? "bg-primary/10 text-primary"
                    : "bg-vip/10 text-vip"
                )}
              >
                {vip.type === "email" ? "Email" : "Domain"}
              </span>
              <span className="text-xs text-foreground flex-1 truncate">{vip.value}</span>
              {vip.label && (
                <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">
                  {vip.label}
                </span>
              )}
              <button
                onClick={() => handleRemove(vip.id)}
                className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                aria-label={`Remove ${vip.value}`}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
