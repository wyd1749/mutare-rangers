// app/(site)/layout.tsx
"use client"

import { useState, Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { RouteLoadingIndicator } from "@/components/route-loading-indicator"
import { AIDrawer } from "@/components/ai-drawer"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [isAIOpen, setIsAIOpen] = useState(false)

  return (
    <div className="flex min-h-dvh flex-col">
      <Suspense fallback={null}>
        <RouteLoadingIndicator />
      </Suspense>
      <SiteHeader onToggleAI={() => setIsAIOpen(!isAIOpen)} />
      <main className="flex-1">{children}</main>
      <AIDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
      <SiteFooter />
    </div>
  )
}