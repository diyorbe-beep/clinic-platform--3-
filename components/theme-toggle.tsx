"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  // Only show the toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="outline" size="icon" className="h-9 w-9" />
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-9 w-9"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <motion.div
        initial={{ scale: 0.8, rotate: 0 }}
        animate={{ scale: 1, rotate: theme === "dark" ? 0 : 180 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </motion.div>
      <span className="sr-only">{theme === "dark" ? t("common.lightMode") : t("common.darkMode")}</span>
    </Button>
  )
}
