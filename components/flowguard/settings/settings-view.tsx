"use client"

import { VipManager } from "./vip-manager"
import { SlaConfig } from "./sla-config"
import { EscalationConfig } from "./escalation-config"
import { ManifestDownload } from "./manifest-download"
import { LanguageToggle } from "./language-toggle"
import { useFlowGuard } from "@/lib/flowguard-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { DEFAULT_SETTINGS } from "@/lib/constants"

export function SettingsView() {
  const { updateSettings } = useFlowGuard()

  const handleReset = () => {
    if (confirm("Reset all settings to defaults? This cannot be undone.")) {
      updateSettings({ ...DEFAULT_SETTINGS, onboardingComplete: true })
      toast.success("Settings reset to defaults")
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-3 py-2 border-b border-border bg-muted/50">
        <h2 className="text-xs font-semibold text-foreground">Settings</h2>
        <p className="text-[10px] text-muted-foreground">
          Configure FlowGuard for your workflow
        </p>
      </div>

      <div className="flex flex-col gap-4 px-3 py-4">
        <VipManager />
        <Separator />
        <SlaConfig />
        <Separator />
        <EscalationConfig />
        <Separator />
        <LanguageToggle />
        <Separator />
        <ManifestDownload />
        <Separator />

        {/* Reset */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="w-full h-8 text-xs gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/30"
        >
          <RotateCcw className="h-3 w-3" />
          Reset All Settings
        </Button>

        <p className="text-[10px] text-muted-foreground text-center pb-4">
          FlowGuard v1.0.0 - Phase 1
        </p>
      </div>
    </div>
  )
}
