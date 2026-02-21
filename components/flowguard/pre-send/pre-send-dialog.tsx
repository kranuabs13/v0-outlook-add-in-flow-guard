"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  ShieldCheck,
  Paperclip,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import {
  getCurrentItemBody,
  getCurrentItemAttachmentCount,
  getCurrentItemRecipients,
  getCurrentItemSubject,
} from "@/lib/office"
import { ATTACHMENT_KEYWORDS, QUOTE_KEYWORDS, CURRENCY_PATTERNS } from "@/lib/constants"
import type { PreSendCheck } from "@/lib/types"

function checkAttachments(body: string, attachmentCount: number): PreSendCheck {
  const bodyLower = body.toLowerCase()
  const mentionsAttachment = ATTACHMENT_KEYWORDS.some((kw) => bodyLower.includes(kw))

  if (mentionsAttachment && attachmentCount === 0) {
    return {
      id: "attachment",
      label: "Attachment Check",
      description: "Email mentions attachments but none are attached.",
      status: "warning",
      confirmed: false,
    }
  }

  return {
    id: "attachment",
    label: "Attachment Check",
    description: attachmentCount > 0
      ? `${attachmentCount} file(s) attached.`
      : "No attachment keywords found and none attached.",
    status: "pass",
    confirmed: true,
  }
}

function checkPricing(body: string, subject: string): PreSendCheck {
  const combined = (body + " " + subject).toLowerCase()
  const isQuoteRelated = QUOTE_KEYWORDS.some((kw) => combined.includes(kw))

  if (isQuoteRelated) {
    const hasCurrency = CURRENCY_PATTERNS.some((p) => p.test(body))
    if (!hasCurrency) {
      return {
        id: "pricing",
        label: "Price/Quote Check",
        description: "This looks like a quote reply but no pricing was found in the body.",
        status: "warning",
        confirmed: false,
      }
    }
    return {
      id: "pricing",
      label: "Price/Quote Check",
      description: "Quote-related email with pricing detected.",
      status: "pass",
      confirmed: true,
    }
  }

  return {
    id: "pricing",
    label: "Price/Quote Check",
    description: "Not a quote-related email.",
    status: "pass",
    confirmed: true,
  }
}

function checkRecipients(recipients: string[]): PreSendCheck {
  const externalCount = recipients.filter(
    (r) => !r.includes("@team-internal.com") && !r.includes("@mycompany.com")
  ).length

  return {
    id: "recipients",
    label: "Recipient Review",
    description: externalCount > 0
      ? `Sending to ${externalCount} external recipient(s). Please verify.`
      : "All recipients are internal.",
    status: externalCount > 0 ? "warning" : "pass",
    confirmed: false,
  }
}

const statusIcon = {
  pass: CheckCircle2,
  warning: AlertTriangle,
  fail: XCircle,
}

const statusStyle = {
  pass: "text-priority-low",
  warning: "text-priority-normal",
  fail: "text-priority-high",
}

export function PreSendDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [checks, setChecks] = useState<PreSendCheck[]>([])
  const [loading, setLoading] = useState(false)

  const runChecks = useCallback(async () => {
    setLoading(true)
    try {
      const [body, attachments, recipients, subject] = await Promise.all([
        getCurrentItemBody(),
        getCurrentItemAttachmentCount(),
        getCurrentItemRecipients(),
        getCurrentItemSubject(),
      ])

      setChecks([
        checkAttachments(body, attachments),
        checkPricing(body, subject),
        checkRecipients(recipients),
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      runChecks()
    }
  }, [open, runChecks])

  const handleToggleConfirm = (checkId: string) => {
    setChecks((prev) =>
      prev.map((c) => (c.id === checkId ? { ...c, confirmed: !c.confirmed } : c))
    )
  }

  const allConfirmed = checks.every((c) => c.confirmed)
  const hasWarnings = checks.some((c) => c.status === "warning")

  const handleSend = () => {
    onOpenChange(false)
    toast.success("Pre-send check passed", {
      description: "In Outlook, the email would now be sent.",
    })
  }

  const handleGoBack = () => {
    onOpenChange(false)
    toast.info("Send cancelled", {
      description: "Go back and edit your email before sending.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[360px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-sm">Pre-Send Checklist</DialogTitle>
              <DialogDescription className="text-[11px]">
                Review before sending
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {checks.map((check) => {
              const Icon = statusIcon[check.status]
              return (
                <div
                  key={check.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3",
                    check.status === "warning" && !check.confirmed
                      ? "border-priority-normal/30 bg-priority-normal/5"
                      : "border-border bg-card"
                  )}
                >
                  <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", statusStyle[check.status])} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{check.label}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                      {check.description}
                    </p>
                  </div>
                  {check.status !== "pass" && (
                    <div className="shrink-0 mt-0.5">
                      <Checkbox
                        checked={check.confirmed}
                        onCheckedChange={() => handleToggleConfirm(check.id)}
                        aria-label={`Confirm ${check.label}`}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {hasWarnings && !loading && (
          <div className="flex items-center gap-2 rounded-lg bg-priority-normal/10 px-3 py-2">
            <AlertTriangle className="h-3.5 w-3.5 text-priority-normal shrink-0" />
            <p className="text-[11px] text-priority-normal font-medium">
              Confirm all checks before sending
            </p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoBack}
            className="flex-1 text-xs"
          >
            Go Back & Edit
          </Button>
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!allConfirmed || loading}
            className="flex-1 text-xs"
          >
            Confirm & Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
