"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ClinicSidebar } from "@/components/clinic-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from "@/contexts/language-context"
import { useLanguageChangeListener } from "@/components/language-change-listener"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This will cause a re-render when language changes
  const languageChangeCount = useLanguageChangeListener()

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        <SidebarProvider>
          <div className="flex min-h-screen">
            <ClinicSidebar key={`sidebar-${languageChangeCount}`} />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
          <Toaster />
        </SidebarProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
