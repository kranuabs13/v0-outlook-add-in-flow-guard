"use client"

import { useFlowGuard } from "@/lib/flowguard-context"
import { Languages } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function LanguageToggle() {
  const { settings, updateSettings } = useFlowGuard()

  const handleToggle = (lang: "en" | "he") => {
    updateSettings({ language: lang })

    // Update document direction
    if (typeof document !== "undefined") {
      document.documentElement.dir = lang === "he" ? "rtl" : "ltr"
      document.documentElement.lang = lang
    }

    toast.success(lang === "he" ? "Hebrew (RTL)" : "English (LTR)", {
      description: lang === "he" ? "Switched to right-to-left layout" : "Switched to left-to-right layout",
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Languages className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-semibold text-foreground">Language & Direction</h3>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handleToggle("en")}
          className={cn(
            "flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors border",
            settings.language === "en"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-muted text-muted-foreground border-border hover:bg-accent"
          )}
        >
          English (LTR)
        </button>
        <button
          onClick={() => handleToggle("he")}
          className={cn(
            "flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors border",
            settings.language === "he"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-muted text-muted-foreground border-border hover:bg-accent"
          )}
        >
          Hebrew (RTL)
        </button>
      </div>
    </div>
  )
}
