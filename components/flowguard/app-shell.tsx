"use client"

import { useFlowGuard } from "@/lib/flowguard-context"
import { StatusBar } from "./status-bar"
import { InboxView } from "./inbox/inbox-view"
import { DraftsView } from "./drafts/drafts-view"
import { SettingsView } from "./settings/settings-view"
import { PreSendDialog } from "./pre-send/pre-send-dialog"
import { OnboardingFlow } from "./onboarding/onboarding-flow"
import { Inbox, FileEdit, Bell, Settings, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TabId } from "@/lib/types"

const tabs: { id: TabId; label: string; icon: typeof Inbox }[] = [
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "drafts", label: "Drafts", icon: FileEdit },
  { id: "reminders", label: "Alerts", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
]

export function AppShell() {
  const { activeTab, setActiveTab, settings, statusSummary, preSendOpen, setPreSendOpen } = useFlowGuard()

  if (!settings.onboardingComplete) {
    return <OnboardingFlow />
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <StatusBar />

      {/* Content area */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === "inbox" && <InboxView />}
        {activeTab === "drafts" && <DraftsView />}
        {activeTab === "reminders" && (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-4">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Alerts & Reminders</h3>
            <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
              Scheduled reminders and daily summaries will appear here in a future update.
            </p>
          </div>
        )}
        {activeTab === "settings" && <SettingsView />}
      </main>

      {/* Simulate Pre-Send button in demo mode */}
      <div className="px-3 py-1.5 border-t border-border bg-card">
        <button
          onClick={() => setPreSendOpen(true)}
          className="w-full flex items-center justify-center gap-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium py-2 transition-colors"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Simulate Pre-Send Check
        </button>
      </div>

      {/* Bottom tab bar */}
      <nav className="flex items-center border-t border-border bg-card" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const hasAlert =
            (tab.id === "inbox" && statusSummary.urgentCount > 0) ||
            (tab.id === "drafts" && statusSummary.idleDraftsCount > 0)

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-0.5 py-2 px-1 text-[10px] font-medium transition-colors relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <tab.icon className="h-4.5 w-4.5" />
                {hasAlert && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-priority-high" />
                )}
              </div>
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </nav>

      <PreSendDialog open={preSendOpen} onOpenChange={setPreSendOpen} />
    </div>
  )
}
