"use client"

import { FlowGuardProvider } from "@/lib/flowguard-context"
import { AppShell } from "@/components/flowguard/app-shell"

export default function Home() {
  return (
    <FlowGuardProvider>
      <AppShell />
    </FlowGuardProvider>
  )
}
