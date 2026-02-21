// FlowGuard - Keywords, defaults, and configuration constants

export const QUOTE_KEYWORDS = [
  "quote",
  "quotation",
  "price",
  "pricing",
  "offer",
  "rfq",
  "rfp",
  "bom",
  "proposal",
  "bid",
  "estimate",
  "cost",
  "rate",
  "tariff",
] as const

export const ATTACHMENT_KEYWORDS = [
  "attached",
  "please find attached",
  "see attached",
  "attachment",
  "enclosed",
  "find enclosed",
  "attaching",
  "i have attached",
  "i've attached",
  "file attached",
  "document attached",
] as const

export const CURRENCY_PATTERNS = [
  /\$[\d,.]+/,
  /[\d,.]+\s?USD/i,
  /[\d,.]+\s?ILS/i,
  /[\d,.]+\s?EUR/i,
  /[\d,.]+\s?GBP/i,
  /\u20AA[\d,.]+/, // shekel sign
  /\u20AC[\d,.]+/, // euro sign
  /\u00A3[\d,.]+/, // pound sign
]

export const INTERNAL_DOMAIN_HINTS = [
  "internal",
  "corp",
  "company",
] as const

export const DEFAULT_SLA = {
  vipReplyHours: 2,
  normalReplyHours: 24,
  draftIdleMinutes: 30,
} as const

export const DEFAULT_ESCALATION = {
  managerEmail: "",
  buManagerEmail: "",
  quoteReplyDeadlineHours: 24,
  vendorResponseDeadlineHours: 24,
} as const

export const DEFAULT_SETTINGS = {
  language: "en" as const,
  sla: { ...DEFAULT_SLA },
  escalation: { ...DEFAULT_ESCALATION },
  vipContacts: [],
  onboardingComplete: false,
}

export const SLA_PRESETS = {
  strict: {
    label: "Strict",
    description: "Fast response times for high-urgency environments",
    sla: { vipReplyHours: 1, normalReplyHours: 8, draftIdleMinutes: 15 },
  },
  normal: {
    label: "Normal",
    description: "Balanced response windows for most teams",
    sla: { vipReplyHours: 2, normalReplyHours: 24, draftIdleMinutes: 30 },
  },
  relaxed: {
    label: "Relaxed",
    description: "Extended windows for lower-volume workflows",
    sla: { vipReplyHours: 4, normalReplyHours: 48, draftIdleMinutes: 60 },
  },
} as const

export const AGING_THRESHOLDS = {
  freshMaxHours: 24,
  agingMaxHours: 48,
} as const

export const PIPELINE_STAGES = [
  "lead",
  "qualified",
  "proposal",
  "negotiation",
  "closed-won",
  "closed-lost",
] as const
