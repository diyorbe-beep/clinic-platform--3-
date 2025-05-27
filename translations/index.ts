import { en } from "./en"
import { ru } from "./ru"
import { uz } from "./uz"

export const translations = {
  en,
  ru,
  uz,
}

export type Language = keyof typeof translations