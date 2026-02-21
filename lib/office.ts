// FlowGuard - Office.js abstraction layer with mock fallback

import type { Email, Draft } from "./types"
import { MOCK_INBOX_EMAILS, MOCK_DRAFTS } from "./mock-data"

declare global {
  interface Window {
    Office?: {
      initialize: (callback: () => void) => void
      context?: {
        mailbox?: unknown
        roamingSettings?: unknown
      }
    }
  }
}

export function isInsideOutlook(): boolean {
  if (typeof window === "undefined") return false
  return !!(window.Office?.context?.mailbox)
}

export function isDemoMode(): boolean {
  return !isInsideOutlook()
}

export async function initializeOffice(): Promise<boolean> {
  if (typeof window === "undefined") return false

  if (window.Office) {
    return new Promise((resolve) => {
      window.Office!.initialize(() => {
        resolve(true)
      })
    })
  }

  // Demo mode - no Office.js available
  return false
}

export async function getInboxEmails(): Promise<Email[]> {
  if (isInsideOutlook()) {
    // In real Outlook, we would use Office.context.mailbox REST API
    // or EWS to fetch inbox items. For now, return mock data as
    // the full Office.js mail API integration requires Exchange connectivity.
    return MOCK_INBOX_EMAILS
  }

  // Demo mode: return mock data
  return MOCK_INBOX_EMAILS
}

export async function getDraftEmails(): Promise<Draft[]> {
  if (isInsideOutlook()) {
    return MOCK_DRAFTS
  }

  return MOCK_DRAFTS
}

export async function openEmail(emailId: string): Promise<void> {
  if (isInsideOutlook()) {
    // In Outlook: Office.context.mailbox.displayMessageForm(emailId)
    return
  }
  // Demo mode: no-op (handled by UI toast)
}

export async function openDraft(draftId: string): Promise<void> {
  if (isInsideOutlook()) {
    // In Outlook: Office.context.mailbox.displayNewMessageForm or navigate to draft
    return
  }
  // Demo mode: no-op
}

export function getCurrentItemBody(): Promise<string> {
  if (isInsideOutlook()) {
    return new Promise((resolve) => {
      // Office.context.mailbox.item.body.getAsync("text", (result) => resolve(result.value))
      resolve("")
    })
  }
  return Promise.resolve("Hi David, Thank you for your inquiry. Please find attached our quotation for the Dell servers. The total price is $124,500 USD including 3-year ProSupport.")
}

export function getCurrentItemAttachmentCount(): Promise<number> {
  if (isInsideOutlook()) {
    return new Promise((resolve) => {
      // Office.context.mailbox.item.attachments would give us the count
      resolve(0)
    })
  }
  return Promise.resolve(0) // Simulate no attachments for pre-send check demo
}

export function getCurrentItemRecipients(): Promise<string[]> {
  if (isInsideOutlook()) {
    return new Promise((resolve) => {
      resolve([])
    })
  }
  return Promise.resolve(["david.chen@acmelogistics.com"])
}

export function getCurrentItemSubject(): Promise<string> {
  if (isInsideOutlook()) {
    return new Promise((resolve) => {
      resolve("")
    })
  }
  return Promise.resolve("RE: RFQ - Dell PowerEdge R760 Servers (Qty 12)")
}
