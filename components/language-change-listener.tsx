"use client"

import { useEffect, useState } from "react"

export function useLanguageChangeListener() {
  const [languageChangeCount, setLanguageChangeCount] = useState(0)

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageChangeCount((prev) => prev + 1)
    }

    window.addEventListener("languagechange", handleLanguageChange)
    return () => {
      window.removeEventListener("languagechange", handleLanguageChange)
    }
  }, [])

  return languageChangeCount
}
