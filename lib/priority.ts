// FlowGuard - Priority calculation engine

import type { Email, PrioritizedEmail, VipContact, SlaSettings, AgingCategory, Priority } from "./types"
import { QUOTE_KEYWORDS, AGING_THRESHOLDS } from "./constants"

function hoursAgo(isoDate: string): number {
  return (Date.now() - new Date(isoDate).getTime()) / (1000 * 60 * 60)
}

function matchesVip(email: string, vipContacts: VipContact[]): boolean {
  const lower = email.toLowerCase()
  return vipContacts.some((vip) => {
    if (vip.type === "email") {
      return lower === vip.value.toLowerCase()
    }
    // domain match
    const domain = vip.value.toLowerCase().replace(/^@/, "")
    return lower.endsWith(`@${domain}`)
  })
}

function containsQuoteKeywords(text: string): boolean {
  const lower = text.toLowerCase()
  return QUOTE_KEYWORDS.some((kw) => lower.includes(kw))
}

function getAgingCategory(receivedDate: string): AgingCategory {
  const hours = hoursAgo(receivedDate)
  if (hours < AGING_THRESHOLDS.freshMaxHours) return "fresh"
  if (hours < AGING_THRESHOLDS.agingMaxHours) return "aging"
  return "critical"
}

export function calculatePriority(
  email: Email,
  vipContacts: VipContact[],
  slaSettings: SlaSettings
): PrioritizedEmail {
  const isVip = matchesVip(email.sender.email, vipContacts)
  const agingCategory = getAgingCategory(email.receivedDate)
  const hasQuoteKw = containsQuoteKeywords(email.subject + " " + email.bodyPreview)
  const hours = hoursAgo(email.receivedDate)

  // Calculate priority
  let priority: Priority = "low"
  let score = 0

  // VIP senders are always high priority
  if (isVip) {
    priority = "high"
    score += 100
  }

  // Quote-related emails are high priority
  if (hasQuoteKw) {
    priority = "high"
    score += 80
  }

  // Critical aging (>48h unanswered)
  if (agingCategory === "critical" && !email.hasReplied) {
    priority = "high"
    score += 70
  }

  // Aging (24-48h unanswered external)
  if (agingCategory === "aging" && !email.hasReplied) {
    if (priority !== "high") priority = "normal"
    score += 40
  }

  // Fresh but unanswered
  if (agingCategory === "fresh" && !email.hasReplied) {
    if (priority === "low") priority = "normal"
    score += 20
  }

  // Already replied = lower priority
  if (email.hasReplied) {
    priority = "low"
    score = Math.max(score - 50, 0)
  }

  // Boost by specific SLA calculations
  if (isVip && hours > slaSettings.vipReplyHours && !email.hasReplied) {
    score += 50 // Past VIP SLA
  }

  // SLA deadline calculation
  const slaHours = isVip ? slaSettings.vipReplyHours : slaSettings.normalReplyHours
  const deadline = new Date(new Date(email.receivedDate).getTime() + slaHours * 60 * 60 * 1000)

  return {
    ...email,
    priority,
    agingCategory,
    isVip,
    slaDeadline: deadline.toISOString(),
    priorityScore: score,
    hasQuoteKeywords: hasQuoteKw,
  }
}

export function sortByPriority(emails: PrioritizedEmail[]): PrioritizedEmail[] {
  return [...emails].sort((a, b) => {
    // First by priority score (descending)
    if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore
    // Then by date (newest first within same score)
    return new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime()
  })
}

export { hoursAgo, matchesVip, containsQuoteKeywords }
