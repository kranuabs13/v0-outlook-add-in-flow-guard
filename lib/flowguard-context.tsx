"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { AppSettings, PrioritizedEmail, Draft, TabId, StatusSummary } from "./types"
import { getSettings, saveSettings } from "./storage"
import { getInboxEmails, getDraftEmails, isDemoMode } from "./office"
import { calculatePriority, sortByPriority } from "./priority"
import { DEFAULT_SETTINGS } from "./constants"
import { getIntentionalDrafts } from "./storage"

interface FlowGuardContextValue {
  settings: AppSettings
  updateSettings: (partial: Partial<AppSettings>) => void
  activeTab: TabId
  setActiveTab: (tab: TabId) => void
  emails: PrioritizedEmail[]
  drafts: Draft[]
  statusSummary: StatusSummary
  isLoading: boolean
  isDemo: boolean
  refreshData: () => Promise<void>
  preSendOpen: boolean
  setPreSendOpen: (open: boolean) => void
}

const FlowGuardContext = createContext<FlowGuardContextValue | null>(null)

export function useFlowGuard() {
  const ctx = useContext(FlowGuardContext)
  if (!ctx) throw new Error("useFlowGuard must be used within FlowGuardProvider")
  return ctx
}

export function FlowGuardProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [activeTab, setActiveTab] = useState<TabId>("inbox")
  const [emails, setEmails] = useState<PrioritizedEmail[]>([])
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [preSendOpen, setPreSendOpen] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = getSettings()
    setSettings(stored)
  }, [])

  const refreshData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [rawEmails, rawDrafts] = await Promise.all([
        getInboxEmails(),
        getDraftEmails(),
      ])

      // Prioritize emails
      const prioritized = rawEmails.map((e) =>
        calculatePriority(e, settings.vipContacts, settings.sla)
      )
      setEmails(sortByPriority(prioritized))

      // Process drafts - filter intentional
      const intentional = getIntentionalDrafts()
      const filteredDrafts = rawDrafts
        .filter((d) => !intentional.includes(d.id))
        .filter((d) => d.hasExternalRecipients)
        .map((d) => ({
          ...d,
          idleMinutes: Math.round(
            (Date.now() - new Date(d.lastModified).getTime()) / (1000 * 60)
          ),
        }))
      setDrafts(filteredDrafts)
    } finally {
      setIsLoading(false)
    }
  }, [settings.vipContacts, settings.sla])

  // Load data on mount and when settings change
  useEffect(() => {
    refreshData()
  }, [refreshData])

  // Auto-refresh drafts every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, 60000)
    return () => clearInterval(interval)
  }, [refreshData])

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial }
      saveSettings(next)
      return next
    })
  }, [])

  const statusSummary: StatusSummary = {
    urgentCount: emails.filter((e) => e.priority === "high" && !e.hasReplied).length,
    vipPendingCount: emails.filter((e) => e.isVip && !e.hasReplied).length,
    idleDraftsCount: drafts.filter((d) => d.idleMinutes >= settings.sla.draftIdleMinutes).length,
    overdueCount: emails.filter(
      (e) => e.slaDeadline && new Date(e.slaDeadline) < new Date() && !e.hasReplied
    ).length,
  }

  return (
    <FlowGuardContext.Provider
      value={{
        settings,
        updateSettings,
        activeTab,
        setActiveTab,
        emails,
        drafts,
        statusSummary,
        isLoading,
        isDemo: isDemoMode(),
        refreshData,
        preSendOpen,
        setPreSendOpen,
      }}
    >
      {children}
    </FlowGuardContext.Provider>
  )
}
