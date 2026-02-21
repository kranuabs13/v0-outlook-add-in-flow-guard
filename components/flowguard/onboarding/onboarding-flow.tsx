"use client"

import { useState } from "react"
import { useFlowGuard } from "@/lib/flowguard-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ShieldCheck, Star, Mail, Clock, ArrowRight, Plus, X } from "lucide-react"
import { SLA_PRESETS } from "@/lib/constants"
import type { VipContact } from "@/lib/types"

type Step = "welcome" | "vips" | "manager" | "sla"

export function OnboardingFlow() {
  const { updateSettings, settings } = useFlowGuard()
  const [step, setStep] = useState<Step>("welcome")
  const [vipInput, setVipInput] = useState("")
  const [vipList, setVipList] = useState<VipContact[]>([])
  const [managerEmail, setManagerEmail] = useState("")
  const [selectedPreset, setSelectedPreset] = useState<"strict" | "normal" | "relaxed">("normal")

  const addVip = () => {
    const trimmed = vipInput.trim()
    if (!trimmed) return
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
    const isDomain = /^@?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(trimmed)
    if (!isEmail && !isDomain) return

    const value = isDomain && !trimmed.startsWith("@") ? `@${trimmed}` : trimmed
    if (vipList.some((v) => v.value === value)) return

    setVipList((prev) => [
      ...prev,
      {
        id: `vip-${Date.now()}`,
        value,
        type: isEmail ? "email" : "domain",
      },
    ])
    setVipInput("")
  }

  const removeVip = (id: string) => {
    setVipList((prev) => prev.filter((v) => v.id !== id))
  }

  const handleComplete = () => {
    const preset = SLA_PRESETS[selectedPreset]
    updateSettings({
      onboardingComplete: true,
      vipContacts: vipList,
      sla: { ...preset.sla },
      escalation: {
        ...settings.escalation,
        managerEmail,
      },
    })
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Progress */}
      <div className="flex items-center gap-1 px-4 pt-4">
        {(["welcome", "vips", "manager", "sla"] as Step[]).map((s, i) => (
          <div
            key={s}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              (["welcome", "vips", "manager", "sla"] as Step[]).indexOf(step) >= i
                ? "bg-primary"
                : "bg-muted"
            )}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {step === "welcome" && (
          <div className="flex flex-col items-center text-center gap-4 max-w-[280px]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground text-balance mb-2">
                Welcome to FlowGuard
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed text-balance">
                Never miss a customer email or forget to send a quote.
                FlowGuard prioritizes your inbox, monitors drafts, and checks
                emails before you send them.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full mt-2">
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span className="text-[11px] text-foreground">Smart inbox prioritization</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span className="text-[11px] text-foreground">Draft idle monitoring</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span className="text-[11px] text-foreground">Pre-send safeguards</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              FlowGuard will never send emails automatically.
            </p>
            <Button
              onClick={() => setStep("vips")}
              className="w-full mt-2 gap-1.5"
              size="sm"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {step === "vips" && (
          <div className="flex flex-col items-center text-center gap-4 max-w-[280px] w-full">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-vip/10">
              <Star className="h-6 w-6 text-vip" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground mb-1">Add VIP Contacts</h2>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Emails from VIP contacts and domains will be flagged as high priority.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full">
              <Input
                value={vipInput}
                onChange={(e) => setVipInput(e.target.value)}
                placeholder="email@company.com or @domain.com"
                className="h-8 text-xs"
                onKeyDown={(e) => e.key === "Enter" && addVip()}
              />
              <Button size="sm" onClick={addVip} className="h-8 px-2 shrink-0">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>

            {vipList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 w-full">
                {vipList.map((vip) => (
                  <span
                    key={vip.id}
                    className="inline-flex items-center gap-1 rounded-full bg-vip/10 text-vip px-2.5 py-1 text-[11px] font-medium"
                  >
                    {vip.value}
                    <button onClick={() => removeVip(vip.id)} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2 w-full mt-2">
              <Button variant="outline" size="sm" onClick={() => setStep("welcome")} className="flex-1 text-xs">
                Back
              </Button>
              <Button size="sm" onClick={() => setStep("manager")} className="flex-1 text-xs gap-1">
                {vipList.length === 0 ? "Skip" : "Next"}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {step === "manager" && (
          <div className="flex flex-col items-center text-center gap-4 max-w-[280px] w-full">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground mb-1">Manager Email</h2>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Optionally set your manager's email for future escalation features.
              </p>
            </div>

            <Input
              value={managerEmail}
              onChange={(e) => setManagerEmail(e.target.value)}
              placeholder="manager@company.com"
              type="email"
              className="h-8 text-xs w-full"
            />

            <div className="flex gap-2 w-full mt-2">
              <Button variant="outline" size="sm" onClick={() => setStep("vips")} className="flex-1 text-xs">
                Back
              </Button>
              <Button size="sm" onClick={() => setStep("sla")} className="flex-1 text-xs gap-1">
                {managerEmail ? "Next" : "Skip"}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {step === "sla" && (
          <div className="flex flex-col items-center text-center gap-4 max-w-[280px] w-full">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground mb-1">Response Speed</h2>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Choose how fast you aim to respond. You can adjust this later.
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full">
              {(Object.entries(SLA_PRESETS) as [string, typeof SLA_PRESETS.normal][]).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPreset(key as "strict" | "normal" | "relaxed")}
                  className={cn(
                    "flex flex-col items-start rounded-lg border px-3 py-2.5 text-left transition-colors",
                    selectedPreset === key
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-accent/50"
                  )}
                >
                  <span className="text-xs font-semibold text-foreground">{preset.label}</span>
                  <span className="text-[10px] text-muted-foreground">{preset.description}</span>
                  <span className="text-[10px] text-primary mt-1">
                    VIP: {preset.sla.vipReplyHours}h / Normal: {preset.sla.normalReplyHours}h / Draft: {preset.sla.draftIdleMinutes}m
                  </span>
                </button>
              ))}
            </div>

            <div className="flex gap-2 w-full mt-2">
              <Button variant="outline" size="sm" onClick={() => setStep("manager")} className="flex-1 text-xs">
                Back
              </Button>
              <Button size="sm" onClick={handleComplete} className="flex-1 text-xs gap-1">
                Start Using FlowGuard
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
