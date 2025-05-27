"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { motion } from "framer-motion"
import type { Language } from "@/translations"

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  const languages = [
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
    { code: "uz", name: "O'zbek" },
  ]

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <motion.div whileHover={{ rotate: 20 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Globe className="h-4 w-4" />
          </motion.div>
          <span className="sr-only">{t("common.language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as Language)}
            className={language === lang.code ? "bg-accent" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
