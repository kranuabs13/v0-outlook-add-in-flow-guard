"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, ChevronDown, ChevronUp, FileCode } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const SIDELOAD_STEPS = [
  {
    title: "Classic Outlook (Windows)",
    steps: [
      "Open Outlook, go to File > Manage Add-ins",
      "Click 'Add a custom add-in' > 'Add from File'",
      "Select the downloaded manifest.xml file",
      "FlowGuard will appear in your ribbon toolbar",
    ],
  },
  {
    title: "New Outlook / Web",
    steps: [
      "Open Outlook on the web or New Outlook",
      "Click the apps icon (grid) in the left sidebar",
      "Select 'Get Add-ins' > 'My add-ins'",
      "Under 'Custom add-ins', click 'Add a custom add-in' > 'Add from file'",
      "Upload the downloaded manifest.xml",
    ],
  },
  {
    title: "Mobile (iOS/Android)",
    steps: [
      "Mobile sideloading requires admin deployment",
      "Ask your IT admin to deploy via Microsoft 365 Admin Center",
      "Once deployed, FlowGuard appears automatically in mobile Outlook",
    ],
  },
]

export function ManifestDownload() {
  const [expanded, setExpanded] = useState(false)

  const handleDownload = async () => {
    try {
      const response = await fetch("/manifest.xml")
      if (!response.ok) {
        throw new Error("Manifest not found")
      }
      const text = await response.text()
      const blob = new Blob([text], { type: "application/xml" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "flowguard-manifest.xml"
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Manifest downloaded", {
        description: "Follow the sideload guide below to install.",
      })
    } catch {
      toast.error("Download failed", {
        description: "Manifest file not found. Make sure the app is deployed.",
      })
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <FileCode className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-semibold text-foreground">Install Add-in</h3>
      </div>

      <Button
        onClick={handleDownload}
        variant="outline"
        size="sm"
        className="w-full h-9 text-xs gap-2"
      >
        <Download className="h-3.5 w-3.5" />
        Download FlowGuard Manifest
      </Button>

      {/* Sideload guide */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[11px] font-medium text-primary hover:underline"
      >
        {expanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
        Sideload Instructions
      </button>

      {expanded && (
        <div className="flex flex-col gap-3">
          {SIDELOAD_STEPS.map((section) => (
            <div key={section.title} className="flex flex-col gap-1">
              <h4 className="text-[11px] font-semibold text-foreground">
                {section.title}
              </h4>
              <ol className="flex flex-col gap-0.5 list-decimal list-inside">
                {section.steps.map((step, i) => (
                  <li key={i} className="text-[10px] text-muted-foreground leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
