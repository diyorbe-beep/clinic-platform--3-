"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { translations, type Language } from "@/translations"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize with a default language
  const [language, setLanguage] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  // This effect runs only once on component mount to load the saved language
  useEffect(() => {
    // Check if we have a saved language preference
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
    setMounted(true)
  }, []) // Empty dependency array means this runs once on mount

  // Custom language change handler
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    // Dispatch a custom event that components can listen for
    const event = new CustomEvent("app-language-change", { detail: { language: newLanguage } })
    window.dispatchEvent(event)
  }

  // This effect runs when language changes to save it and update the HTML lang
  useEffect(() => {
    if (!mounted) return

    // Save language preference to localStorage whenever it changes
    localStorage.setItem("language", language)

    // Set HTML lang attribute
    document.documentElement.lang = language
  }, [language, mounted]) // Only run when language changes

  // Function to get translation by key (dot notation supported)
  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[language]

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        return key // Return the key if translation not found
      }
    }

    return typeof value === "string" ? value : key
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleLanguageChange,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
