import { Trophy, Users, Zap } from "lucide-react"

/**
 * Retourne l'icône correspondant à une catégorie de news
 */
export const getNewsIcon = (category: string) => {
  switch (category) {
    case "MATCH":
      return Trophy
    case "TRANSFER":
      return Users
    case "OTHER":
      return Zap
    default:
      return Zap
  }
}

/**
 * Retourne les classes de couleur pour une catégorie de news
 */
export const getNewsColor = (category: string) => {
  switch (category) {
    case "MATCH":
      return "text-primary"
    case "TRANSFER":
      return "text-secondary"
    case "OTHER":
      return "text-tertiary"
    default:
      return "text-tertiary"
  }
}

/**
 * Traduit une catégorie de news en français
 */
export const translateNewsCategory = (category: string) => {
  switch (category) {
    case "MATCH":
      return "Match"
    case "TRANSFER":
      return "Transfert"
    case "OTHER":
      return "Autre"
    default:
      return category
  }
}

/**
 * Options de catégories pour les formulaires (sans "all")
 */
export const categoryOptions = [
  { value: "MATCH", label: "Match" },
  { value: "TRANSFER", label: "Transfert" },
  { value: "OTHER", label: "Autre" },
]

/**
 * Options de catégories pour les filtres (avec "all")
 */
export const categoryFilterOptions = [
  { value: "all", label: "Toutes les catégories" },
  ...categoryOptions,
]
