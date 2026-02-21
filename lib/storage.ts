// FlowGuard - Typed localStorage wrapper

import type { AppSettings, ComposeIntent } from "./types"
import { DEFAULT_SETTINGS } from "./constants"

const KEYS = {
  settings: "flowguard_settings",
  composeIntents: "flowguard_compose_intents",
  intentionalDrafts: "flowguard_intentional_drafts",
  dismissedEmails: "flowguard_dismissed_emails",
} as const

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable - silently fail
  }
}

// --- Settings ---

export function getSettings(): AppSettings {
  const saved = safeGet<Partial<AppSettings>>(KEYS.settings, {})
  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    sla: { ...DEFAULT_SETTINGS.sla, ...(saved.sla ?? {}) },
    escalation: { ...DEFAULT_SETTINGS.escalation, ...(saved.escalation ?? {}) },
    vipContacts: saved.vipContacts ?? DEFAULT_SETTINGS.vipContacts,
  }
}

export function saveSettings(settings: AppSettings): void {
  safeSet(KEYS.settings, settings)
}

// --- Compose Intents ---

export function getComposeIntents(): ComposeIntent[] {
  return safeGet<ComposeIntent[]>(KEYS.composeIntents, [])
}

export function saveComposeIntent(intent: ComposeIntent): void {
  const intents = getComposeIntents()
  const idx = intents.findIndex((i) => i.messageId === intent.messageId)
  if (idx >= 0) {
    intents[idx] = intent
  } else {
    intents.push(intent)
  }
  safeSet(KEYS.composeIntents, intents)
}

export function getComposeIntent(messageId: string): ComposeIntent | undefined {
  return getComposeIntents().find((i) => i.messageId === messageId)
}

// --- Intentional Drafts ---

export function getIntentionalDrafts(): string[] {
  return safeGet<string[]>(KEYS.intentionalDrafts, [])
}

export function markDraftIntentional(draftId: string): void {
  const drafts = getIntentionalDrafts()
  if (!drafts.includes(draftId)) {
    drafts.push(draftId)
    safeSet(KEYS.intentionalDrafts, drafts)
  }
}

export function unmarkDraftIntentional(draftId: string): void {
  const drafts = getIntentionalDrafts().filter((id) => id !== draftId)
  safeSet(KEYS.intentionalDrafts, drafts)
}

// --- Dismissed Emails ---

export function getDismissedEmails(): string[] {
  return safeGet<string[]>(KEYS.dismissedEmails, [])
}

export function dismissEmail(emailId: string): void {
  const dismissed = getDismissedEmails()
  if (!dismissed.includes(emailId)) {
    dismissed.push(emailId)
    safeSet(KEYS.dismissedEmails, dismissed)
  }
}
