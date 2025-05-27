"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"

export function useLanguageChange() {
  const { language } = useLanguage()
  const [forceUpdate, setForceUpdate] = useState(0)

  useEffect(() => {
    const handleLanguageChange = () => {
      setForceUpdate((prev) => prev + 1)
    }

    window.addEventListener("app-language-change", handleLanguageChange)
    return () => {
      window.removeEventListener("app-language-change", handleLanguageChange)
    }
  }, [])

  return { language, forceUpdate }
}
