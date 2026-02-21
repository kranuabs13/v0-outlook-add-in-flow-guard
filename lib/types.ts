// FlowGuard - All TypeScript types and interfaces

export interface EmailAddress {
  name: string
  email: string
}

export interface Email {
  id: string
  sender: EmailAddress
  recipients: EmailAddress[]
  subject: string
  bodyPreview: string
  bodyText: string
  receivedDate: string // ISO 8601
  hasAttachments: boolean
  isRead: boolean
  hasReplied: boolean
  folder: "inbox" | "drafts" | "sent"
  conversationId?: string
}

export type Priority = "low" | "normal" | "high"
export type AgingCategory = "fresh" | "aging" | "critical"

export interface PrioritizedEmail extends Email {
  priority: Priority
  agingCategory: AgingCategory
  isVip: boolean
  slaDeadline?: string
  priorityScore: number // numeric for sorting
  hasQuoteKeywords: boolean
}

export interface Draft extends Email {
  lastModified: string
  idleMinutes: number
  isIntentionalDraft: boolean
  hasExternalRecipients: boolean
}

export interface VipContact {
  id: string
  value: string // email or @domain.com
  type: "email" | "domain"
  label?: string
}

export interface SlaSettings {
  vipReplyHours: number
  normalReplyHours: number
  draftIdleMinutes: number
}

export interface EscalationConfig {
  managerEmail: string
  buManagerEmail: string
  quoteReplyDeadlineHours: number
  vendorResponseDeadlineHours: number
}

export interface ComposeIntent {
  messageId: string
  isQuoteResponse: boolean
  followUpDays?: number
  createdAt: string
}

export interface AppSettings {
  language: "en" | "he"
  sla: SlaSettings
  escalation: EscalationConfig
  vipContacts: VipContact[]
  onboardingComplete: boolean
}

export interface PreSendCheck {
  id: string
  label: string
  description: string
  status: "pass" | "warning" | "fail"
  confirmed: boolean
}

export type TabId = "inbox" | "drafts" | "reminders" | "settings"

export interface StatusSummary {
  urgentCount: number
  vipPendingCount: number
  idleDraftsCount: number
  overdueCount: number
}
